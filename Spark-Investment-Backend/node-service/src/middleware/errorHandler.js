// src/middleware/errorHandler.js
const logger = require('../utils/logger');

// Error codes mapping
const ERROR_CODES = {
  // Validation errors (VAL)
  VALIDATION_ERROR: 'VAL_001',
  INVALID_EMAIL: 'VAL_002',
  INVALID_PASSWORD: 'VAL_003',
  INVALID_PHONE: 'VAL_004',
  MISSING_FIELD: 'VAL_005',
  
  // Authentication errors (AUTH)
  INVALID_CREDENTIALS: 'AUTH_001',
  TOKEN_EXPIRED: 'AUTH_002',
  TOKEN_INVALID: 'AUTH_003',
  ACCOUNT_LOCKED: 'AUTH_004',
  ACCOUNT_SUSPENDED: 'AUTH_005',
  UNAUTHORIZED: 'AUTH_006',
  
  // Duplicate errors (DUP)
  EMAIL_EXISTS: 'DUP_001',
  PHONE_EXISTS: 'DUP_002',
  
  // Server errors (SRV)
  INTERNAL_ERROR: 'SRV_001',
  DATABASE_ERROR: 'SRV_002',
};

class AppError extends Error {
  constructor(message, statusCode, code, field = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.field = field;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route not found - ${req.originalUrl}`,
      timestamp: new Date().toISOString(),
    },
  });
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let errorCode = err.code || ERROR_CODES.INTERNAL_ERROR;
  let message = err.message || 'Internal Server Error';
  let field = err.field || null;

  // Log error
  logger.error('Error:', {
    message: err.message,
    statusCode,
    code: errorCode,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorCode = ERROR_CODES.VALIDATION_ERROR;
    const fields = Object.keys(err.errors);
    message = err.errors[fields[0]].message;
    field = fields[0];
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    errorCode = field === 'email' ? ERROR_CODES.EMAIL_EXISTS : ERROR_CODES.DUP_001;
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    statusCode = 400;
    errorCode = ERROR_CODES.VALIDATION_ERROR;
    message = 'Invalid ID format';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorCode = ERROR_CODES.TOKEN_INVALID;
    message = 'Invalid token. Please login again.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorCode = ERROR_CODES.TOKEN_EXPIRED;
    message = 'Token expired. Please login again.';
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      ...(field && { field }),
      timestamp: new Date().toISOString(),
    },
  });
};

module.exports = {
  AppError,
  notFound,
  errorHandler,
  ERROR_CODES,
};