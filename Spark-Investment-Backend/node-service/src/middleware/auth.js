const { verifyAccessToken } = require('../utils/jwt');
const prisma = require('../config/database');

// Protect routes - require valid JWT
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Or from cookie
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. No token provided.',
      });
    }

    try {
      // Verify token
      const decoded = verifyAccessToken(token);

      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          kycStatus: true,
          emailVerified: true,
          status: true,
          preferences: true,
        },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found. Token is invalid.',
        });
      }

      // Check if user is active
      if (user.status !== 'ACTIVE') {
        return res.status(401).json({
          success: false,
          message: 'Your account has been suspended or deleted.',
        });
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please login again.',
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

module.exports = { protect };