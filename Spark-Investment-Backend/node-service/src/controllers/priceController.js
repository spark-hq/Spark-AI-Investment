// src/controllers/priceController.js
const { updateAllPrices, getStockPrice, getCryptoPrice } = require('../services/marketDataService');
const { AppError, ERROR_CODES } = require('../middleware/errorHandler');
const prisma = require('../config/database');

/**
 * Update all investment prices
 * POST /api/prices/update
 */
const updatePrices = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user's portfolio
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId },
    });

    if (!portfolio) {
      throw new AppError('Portfolio not found', 404, 'NOT_FOUND');
    }

    // Update prices
    const results = await updateAllPrices(portfolio.id);

    res.status(200).json({
      success: true,
      message: 'Price update completed',
      data: {
        summary: {
          total: results.total,
          updated: results.updated,
          failed: results.failed,
          skipped: results.skipped,
        },
        details: results.details,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current price for a symbol
 * GET /api/prices/:symbol?type=stock&exchange=NSE
 */
const getPrice = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const { type = 'stock', exchange = 'NSE' } = req.query;

    let priceData;

    if (type.toLowerCase() === 'crypto') {
      priceData = await getCryptoPrice(symbol);
    } else {
      priceData = await getStockPrice(symbol, exchange.toUpperCase());
    }

    if (!priceData) {
      throw new AppError('Price not available', 404, 'NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      data: { price: priceData },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get price update status
 * GET /api/prices/status
 */
const getPriceUpdateStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId },
      select: {
        lastUpdated: true,
        investments: {
          where: { isActive: true },
          select: {
            symbol: true,
            type: true,
            currentPrice: true,
            updatedAt: true,
          },
          take: 10,
          orderBy: { updatedAt: 'desc' },
        },
      },
    });

    if (!portfolio) {
      throw new AppError('Portfolio not found', 404, 'NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      data: {
        portfolioLastUpdated: portfolio.lastUpdated,
        recentUpdates: portfolio.investments,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updatePrices,
  getPrice,
  getPriceUpdateStatus,
};