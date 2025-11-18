// src/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const {
  addTransaction,
  getAllTransactions,
  getTransaction,
  updateTransactionById,
  deleteTransactionById,
  getTransactionSummary,
  getStats,
  exportTransactions,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Summary and stats routes must come before :id route
router.get('/summary', getTransactionSummary);
router.get('/stats', getStats);
router.get('/export', exportTransactions);

// Transaction CRUD
router.post('/', addTransaction);
router.get('/', getAllTransactions);
router.get('/:id', getTransaction);
router.put('/:id', updateTransactionById);
router.delete('/:id', deleteTransactionById);

module.exports = router;