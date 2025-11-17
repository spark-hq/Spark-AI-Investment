// src/routes/portfolioRoutes.js
const express = require('express');
const router = express.Router();
const {
  initializePortfolio,
  getPortfolio,
  getPortfolioSummary,
  getAssetAllocation,
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.post('/init', initializePortfolio);
router.get('/', getPortfolio);
router.get('/summary', getPortfolioSummary);
router.get('/allocation', getAssetAllocation);

module.exports = router;