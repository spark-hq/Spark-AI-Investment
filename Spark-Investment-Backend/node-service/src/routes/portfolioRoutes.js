// src/routes/portfolioRoutes.js
const express = require('express');
const router = express.Router();
const {
  initializePortfolio,
  getPortfolio,
  getPortfolioSummary,
  getAssetAllocation,
  getPerformance,
  getPlatforms,
  syncPlatform,
  getTopPerformers,
  getActivity,
  connectPlatform,
  disconnectPlatform,
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Portfolio management
router.post('/init', initializePortfolio);
router.get('/', getPortfolio);
router.get('/summary', getPortfolioSummary);
router.get('/allocation', getAssetAllocation);

// Performance & analytics
router.get('/performance', getPerformance);
router.get('/top-performers', getTopPerformers);
router.get('/activity', getActivity);

// Platform management
router.get('/platforms', getPlatforms);
router.post('/platforms/connect', connectPlatform);        
router.post('/platforms/:platformId/sync', syncPlatform);

module.exports = router;