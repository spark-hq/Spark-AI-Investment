// src/controllers/portfolioController.js
const prisma = require('../config/database');
const {
  updatePortfolioSummary,
  calculateAssetAllocation,
} = require('../services/portfolioService');
const { AppError, ERROR_CODES } = require('../middleware/errorHandler');

/**
 * Initialize portfolio for user
 * POST /api/portfolio/init
 */
const initializePortfolio = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Check if portfolio already exists
    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { userId },
    });

    if (existingPortfolio) {
      return res.status(200).json({
        success: true,
        message: 'Portfolio already exists',
        data: { portfolio: existingPortfolio },
      });
    }

    // Create new portfolio
    const portfolio = await prisma.portfolio.create({
      data: { userId },
    });

    res.status(201).json({
      success: true,
      message: 'Portfolio initialized successfully',
      data: { portfolio },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get portfolio summary
 * GET /api/portfolio
 */
const getPortfolio = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId },
      include: {
        investments: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!portfolio) {
      throw new AppError('Portfolio not found. Please initialize first.', 404, 'NOT_FOUND');
    }

    // Update summary
    await updatePortfolioSummary(portfolio.id);

    // Get fresh data
    const updatedPortfolio = await prisma.portfolio.findUnique({
      where: { userId },
      include: {
        investments: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: { portfolio: updatedPortfolio },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get portfolio summary (without investments)
 * GET /api/portfolio/summary
 */
const getPortfolioSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId },
    });

    if (!portfolio) {
      throw new AppError('Portfolio not found. Please initialize first.', 404, 'NOT_FOUND');
    }

    // Update summary
    await updatePortfolioSummary(portfolio.id);

    // Get fresh data
    const updatedPortfolio = await prisma.portfolio.findUnique({
      where: { userId },
    });

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalInvested: updatedPortfolio.totalInvested,
          currentValue: updatedPortfolio.currentValue,
          returns: updatedPortfolio.returns,
          returnsPercent: updatedPortfolio.returnsPercent,
          lastUpdated: updatedPortfolio.lastUpdated,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get asset allocation
 * GET /api/portfolio/allocation
 */
const getAssetAllocation = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId },
    });

    if (!portfolio) {
      throw new AppError('Portfolio not found', 404, 'NOT_FOUND');
    }

    const allocation = await calculateAssetAllocation(portfolio.id);

    res.status(200).json({
      success: true,
      data: { allocation },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  initializePortfolio,
  getPortfolio,
  getPortfolioSummary,
  getAssetAllocation,
};