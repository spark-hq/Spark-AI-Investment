// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { generateTokens, verifyRefreshToken } = require('../utils/jwt');
const { AppError, ERROR_CODES } = require('../middleware/errorHandler');

// Helper: Transform user data for response
const transformUser = (user) => {
  // Convert enum to lowercase
  const kycStatus = user.kycStatus ? user.kycStatus.toLowerCase() : 'incomplete';
  
  // Provide default preferences if null
  const defaultPreferences = {
    theme: 'light',
    language: 'en',
    currency: 'INR',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  };
  
  const preferences = user.preferences || defaultPreferences;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    kycStatus,
    emailVerified: user.emailVerified,
    preferences,
    ...(user.lastLogin && { lastLogin: user.lastLogin }),
  };
};

// Signup
const signup = async (req, res, next) => {
  try {
    const { name, email, password, phone, acceptedTerms } = req.body;

    // Validate required fields
    if (!name) {
      throw new AppError('Name is required', 400, ERROR_CODES.MISSING_FIELD, 'name');
    }
    if (!email) {
      throw new AppError('Email is required', 400, ERROR_CODES.MISSING_FIELD, 'email');
    }
    if (!password) {
      throw new AppError('Password is required', 400, ERROR_CODES.MISSING_FIELD, 'password');
    }
    if (!acceptedTerms) {
      throw new AppError('You must accept the terms and conditions', 400, ERROR_CODES.VALIDATION_ERROR);
    }

    // Email validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      throw new AppError('Invalid email format', 400, ERROR_CODES.INVALID_EMAIL, 'email');
    }

    // Password validation
    if (password.length < 8) {
      throw new AppError('Password must be at least 8 characters', 400, ERROR_CODES.INVALID_PASSWORD, 'password');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('Email already exists', 409, ERROR_CODES.EMAIL_EXISTS, 'email');
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user with default preferences
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        phone,
        preferences: {
          theme: 'light',
          language: 'en',
          currency: 'INR',
          notifications: {
            email: true,
            sms: false,
            push: true,
            priceAlerts: true,
            newsAlerts: false
          },
          safetyControls: {
            requireConfirmation: true,
            dailyTradingLimit: 100000,
            enableAutoTrade: false
          }
        }
      },
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Update user with refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: transformUser(user),
        token: accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login
const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Validate input
    if (!email) {
      throw new AppError('Email is required', 400, ERROR_CODES.MISSING_FIELD, 'email');
    }
    if (!password) {
      throw new AppError('Password is required', 400, ERROR_CODES.MISSING_FIELD, 'password');
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401, ERROR_CODES.INVALID_CREDENTIALS);
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new AppError(
        'Account locked due to multiple failed login attempts. Please try again after 30 minutes.',
        403,
        ERROR_CODES.ACCOUNT_LOCKED
      );
    }

    // Check if account is active
    if (user.status !== 'ACTIVE') {
      throw new AppError(
        'Your account has been suspended or deleted',
        403,
        ERROR_CODES.ACCOUNT_SUSPENDED
      );
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordCorrect) {
      // Increment failed login attempts
      const loginAttempts = (user.loginAttempts || 0) + 1;
      const updates = { loginAttempts };

      // Lock account after 5 failed attempts
      if (loginAttempts >= 5) {
        updates.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      }

      await prisma.user.update({
        where: { id: user.id },
        data: updates,
      });

      throw new AppError('Invalid credentials', 401, ERROR_CODES.INVALID_CREDENTIALS);
    }

    // Reset login attempts on successful login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: 0,
        lockUntil: null,
        lastLogin: new Date(),
      },
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // Set cookie with appropriate expiry based on rememberMe
    const cookieMaxAge = rememberMe
      ? 30 * 24 * 60 * 60 * 1000 // 30 days
      : 24 * 60 * 60 * 1000; // 24 hours

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: cookieMaxAge,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: transformUser(user),
        token: accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Refresh Token (NEW)
const refreshToken = async (req, res, next) => {
  try {
    // Get refresh token from cookie or body
    const token = req.cookies.refreshToken || req.body.refreshToken;

    if (!token) {
      throw new AppError('Refresh token not provided', 401, ERROR_CODES.UNAUTHORIZED);
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch (error) {
      throw new AppError('Invalid or expired refresh token', 401, ERROR_CODES.TOKEN_INVALID);
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new AppError('User not found', 401, ERROR_CODES.INVALID_CREDENTIALS);
    }

    // Check if refresh token matches
    if (user.refreshToken !== token) {
      throw new AppError('Invalid refresh token', 401, ERROR_CODES.TOKEN_INVALID);
    }

    // Generate new tokens
    const tokens = generateTokens(user);

    // Update refresh token in database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    // Set new refresh token in cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      data: {
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get Me
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: transformUser(req.user),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Logout
const logout = async (req, res, next) => {
  try {
    // Clear refresh token from database
    await prisma.user.update({
      where: { id: req.user.id },
      data: { refreshToken: null },
    });

    // Clear cookie
    res.clearCookie('refreshToken');

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  refreshToken,
  getMe,
  logout,
};