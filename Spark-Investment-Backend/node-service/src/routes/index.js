// src/routes/index.js
const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const portfolioRoutes = require('./portfolioRoutes');

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
      health: '/api/health',
      auth: '/api/auth',
      portfolio: '/api/portfolio',
    },
  });
});

// Routes
router.use('/auth', authRoutes);
router.use('/portfolio', portfolioRoutes);
router.delete('/platforms/connect/:platformId', protect, disconnectPlatform);

module.exports = router;