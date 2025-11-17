const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API info
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Spark Investment API',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/health',
      auth: '/api/v1/auth',
    },
  });
});

// Auth routes
router.use('/auth', authRoutes);

module.exports = router;