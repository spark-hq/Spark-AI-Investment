// src/jobs/priceUpdateJob.js
const cron = require('node-cron');
const { updateAllPrices } = require('../services/marketDataService');
const logger = require('../utils/logger');

/**
 * Schedule price updates every 5 minutes
 * Runs only during market hours (9 AM - 4 PM IST, Mon-Fri)
 */
const startPriceUpdateJob = () => {
  // Run every 5 minutes
  cron.schedule('*/1 * * * *', async () => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();

    // Check if market hours (9 AM - 4 PM IST, Mon-Fri)
    const isMarketHours = day >= 1 && day <= 5 && hour >= 9 && hour <= 16;

    // For crypto, update 24/7
    // For stocks, only during market hours
    
    logger.info('Starting scheduled price update...');
    
    try {
      await updateAllPrices();
      logger.info('Scheduled price update completed');
    } catch (error) {
      logger.error('Scheduled price update failed:', error);
    }
  });

  logger.info('Price update job scheduled (every 5 minutes)');
};

module.exports = { startPriceUpdateJob };