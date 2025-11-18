// src/routes/investmentRoutes.js
const express = require('express');
const router = express.Router();
const {
  addInvestment,
  getAllInvestments,
  getInvestment,
  updateInvestmentById,
  deleteInvestmentById,
  getStats,
} = require('../controllers/investmentController');
const {
  getInvestmentTransactions,
  getInvestmentTransactionSummary,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Stats route must come before :id route
router.get('/stats', getStats);

// Type-specific routes (NEW - must come before general routes)
router.get('/stocks', async (req, res, next) => {
  req.query.type = 'STOCK';
  return getAllInvestments(req, res, next);
});

router.get('/mutual-funds', async (req, res, next) => {
  req.query.type = 'MUTUAL_FUND';
  return getAllInvestments(req, res, next);
});

router.get('/crypto', async (req, res, next) => {
  req.query.type = 'CRYPTO';
  return getAllInvestments(req, res, next);
});

// General investment CRUD
router.post('/', addInvestment);
router.get('/', getAllInvestments);
router.get('/:id', getInvestment);
router.put('/:id', updateInvestmentById);
router.delete('/:id', deleteInvestmentById);

// Investment transaction routes
router.get('/:id/transactions', getInvestmentTransactions);
router.get('/:id/transactions/summary', getInvestmentTransactionSummary);
module.exports = router;