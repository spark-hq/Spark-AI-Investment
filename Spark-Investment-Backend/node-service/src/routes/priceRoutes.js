// src/routes/priceRoutes.js
const express = require('express');
const router = express.Router();
const {
  updatePrices,
  getPrice,
  getPriceUpdateStatus,
} = require('../controllers/priceController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.post('/update', updatePrices);
router.get('/status', getPriceUpdateStatus);
router.get('/:symbol', getPrice);

module.exports = router;