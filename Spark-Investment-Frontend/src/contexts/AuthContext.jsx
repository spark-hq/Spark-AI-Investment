import { createContext, useState, useEffect, useCallback } from 'react';

// Create Auth Context
export const AuthContext = createContext(null);

// Token expiry times (in milliseconds)
const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

// Local storage keys
const STORAGE_KEYS = {
  USER: 'spark_user',
  ACCESS_TOKEN: 'spark_access_token',
  REFRESH_TOKEN: 'spark_refresh_token',
  TOKEN_EXPIRY: 'spark_token_expiry',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ===================================
  // Initialize Auth State from LocalStorage
  // ===================================
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const tokenExpiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);

        if (storedUser && accessToken && tokenExpiry) {
          const expiryTime = parseInt(tokenExpiry, 10);
          const now = Date.now();

          // Check if token is still valid
          if (now < expiryTime) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Token expired, try to refresh
            attemptTokenRefresh();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ===================================
  // Token Refresh Logic
  // ===================================
  const attemptTokenRefresh = useCallback(() => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    if (refreshToken) {
      // Mock refresh token validation
      // In real app, this would be an API call
      const newAccessToken = `access_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newExpiry = Date.now() + ACCESS_TOKEN_EXPIRY;

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
      localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, newExpiry.toString());

      return true;
    }

    // Refresh failed, logout
    logout();
    return false;
  }, []);

  // ===================================
  // Auto Token Refresh Timer
  // ===================================
  useEffect(() => {
    if (!isAuthenticated) return;

    // Set up timer to refresh token before it expires
    const tokenExpiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
    if (!tokenExpiry) return;

    const expiryTime = parseInt(tokenExpiry, 10);
    const now = Date.now();
    const timeUntilExpiry = expiryTime - now;

    // Refresh 2 minutes before expiry
    const refreshTime = timeUntilExpiry - (2 * 60 * 1000);

    if (refreshTime > 0) {
      const refreshTimer = setTimeout(() => {
        attemptTokenRefresh();
      }, refreshTime);

      return () => clearTimeout(refreshTimer);
    } else {
      // Token already expired or about to expire
      attemptTokenRefresh();
    }
  }, [isAuthenticated, attemptTokenRefresh]);

  // ===================================
  // Clear Auth Data Helper
  // ===================================
  const clearAuthData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // ===================================
  // Login Function (Mock Implementation)
  // ===================================
  const login = useCallback(async (email, password, keepSignedIn = false) => {
    try {
      // Mock authentication - in real app, this would be an API call
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock validation (accept any non-empty credentials for demo)
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Mock user data
      const mockUser = {
        id: `user_${Date.now()}`,
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email: email,
        avatar: null,
        preferences: {
          theme: 'light',
          notifications: true,
          currency: 'INR',
        },
        portfolioIds: ['portfolio_1', 'portfolio_2'],
        createdAt: new Date().toISOString(),
      };

      // Generate mock tokens
      const accessToken = `access_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const refreshToken = `refresh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const tokenExpiry = Date.now() + ACCESS_TOKEN_EXPIRY;

      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, tokenExpiry.toString());

      // Update state
      setUser(mockUser);
      setIsAuthenticated(true);

      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // ===================================
  // Signup Function (Mock Implementation)
  // ===================================
  const signup = useCallback(async (userData) => {
    try {
      // Mock signup - in real app, this would be an API call
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Validate required fields
      const { name, email, password, phone, dob, riskProfile } = userData;

      if (!name || !email || !password) {
        throw new Error('Name, email, and password are required');
      }

      // Mock user creation
      const newUser = {
        id: `user_${Date.now()}`,
        name: name,
        email: email,
        phone: phone || null,
        dob: dob || null,
        riskProfile: riskProfile || 'moderate',
        avatar: null,
        preferences: {
          theme: 'light',
          notifications: true,
          currency: 'INR',
        },
        portfolioIds: [],
        createdAt: new Date().toISOString(),
        kycStatus: phone && dob ? 'pending' : 'incomplete',
      };

      // Generate mock tokens
      const accessToken = `access_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const refreshToken = `refresh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const tokenExpiry = Date.now() + ACCESS_TOKEN_EXPIRY;

      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, tokenExpiry.toString());

      // Update state
      setUser(newUser);
      setIsAuthenticated(true);

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // ===================================
  // Logout Function
  // ===================================
  const logout = useCallback(() => {
    clearAuthData();
  }, [clearAuthData]);

  // ===================================
  // Update User Profile
  // ===================================
  const updateUserProfile = useCallback((updates) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const updatedUser = { ...user, ...updates };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  }, [user]);

  // ===================================
  // Update User Preferences
  // ===================================
  const updatePreferences = useCallback((preferences) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const updatedUser = {
        ...user,
        preferences: { ...user.preferences, ...preferences },
      };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Update preferences error:', error);
      return { success: false, error: error.message };
    }
  }, [user]);

  // ===================================
  // Send OTP (Mock)
  // ===================================
  const sendOTP = useCallback(async (email) => {
    try {
      // Mock OTP sending - in real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate mock OTP (in real app, this would be sent to email)
      const mockOTP = Math.floor(100000 + Math.random() * 900000).toString();

      // Store OTP temporarily (in real app, this would be handled by backend)
      sessionStorage.setItem(`otp_${email}`, mockOTP);
      sessionStorage.setItem(`otp_expiry_${email}`, (Date.now() + 5 * 60 * 1000).toString());

      console.log(`Mock OTP for ${email}: ${mockOTP}`); // For testing

      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      console.error('Send OTP error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // ===================================
  // Verify OTP (Mock)
  // ===================================
  const verifyOTP = useCallback(async (email, otp) => {
    try {
      // Mock OTP verification - in real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const storedOTP = sessionStorage.getItem(`otp_${email}`);
      const otpExpiry = sessionStorage.getItem(`otp_expiry_${email}`);

      if (!storedOTP || !otpExpiry) {
        throw new Error('OTP not found or expired');
      }

      if (Date.now() > parseInt(otpExpiry, 10)) {
        sessionStorage.removeItem(`otp_${email}`);
        sessionStorage.removeItem(`otp_expiry_${email}`);
        throw new Error('OTP expired');
      }

      if (storedOTP !== otp) {
        throw new Error('Invalid OTP');
      }

      // Clear OTP after successful verification
      sessionStorage.removeItem(`otp_${email}`);
      sessionStorage.removeItem(`otp_expiry_${email}`);

      return { success: true, message: 'OTP verified successfully' };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // ===================================
  // Reset Password (Mock)
  // ===================================
  const resetPassword = useCallback(async (email, newPassword, otp) => {
    try {
      // Mock password reset - in real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Verify OTP first
      const otpVerification = await verifyOTP(email, otp);
      if (!otpVerification.success) {
        throw new Error(otpVerification.error);
      }

      // In real app, update password in backend
      // For mock, we just return success

      return { success: true, message: 'Password reset successfully' };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: error.message };
    }
  }, [verifyOTP]);

  // ===================================
  // Context Value
  // ===================================
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    updateUserProfile,
    updatePreferences,
    sendOTP,
    verifyOTP,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
