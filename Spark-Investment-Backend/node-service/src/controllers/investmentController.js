// src/controllers/investmentController.js
const prisma = require('../config/database');
const {
  createInvestment,
  updateInvestment,
  deleteInvestment,
  getInvestmentStats,
} = require('../services/investmentService');
const { AppError, ERROR_CODES } = require('../middleware/errorHandler');

/**
 * Add new investment
 * POST /api/investments
 */
const addInvestment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      symbol,
      name,
      type,
      platform,
      sector,
      quantity,
      avgBuyPrice,
      currentPrice,
      purchaseDate,
      notes,
    } = req.body;

    // Validate required fields
    if (!symbol || !name || !type || !quantity || !avgBuyPrice || !currentPrice || !purchaseDate) {
      throw new AppError(
        'Missing required fields: symbol, name, type, quantity, avgBuyPrice, currentPrice, purchaseDate',
        400,
        ERROR_CODES.MISSING_FIELD
      );
    }

    // Validate investment type
    const validTypes = ['STOCK', 'MUTUAL_FUND', 'CRYPTO', 'ETF', 'BOND', 'GOLD', 'FD', 'PPF', 'NPS'];
    if (!validTypes.includes(type)) {
      throw new AppError(
        `Invalid investment type. Must be one of: ${validTypes.join(', ')}`,
        400,
        ERROR_CODES.VALIDATION_ERROR,
        'type'
      );
    }

    // Get portfolio
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId },
    });

    if (!portfolio) {
      throw new AppError('Portfolio not found. Please initialize first.', 404, 'NOT_FOUND');
    }

    // Create investment
    const investment = await createInvestment(portfolio.id, {
      symbol,
      name,
      type,
      platform,
      sector,
      quantity: parseFloat(quantity),
      avgBuyPrice: parseFloat(avgBuyPrice),
      currentPrice: parseFloat(currentPrice),
      purchaseDate,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Investment added successfully',
      data: { investment },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all investments
 * GET /api/investments?type=STOCK&platform=Zerodha&search=reliance
 */
const getAllInvestments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let { type, platform, search, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Get portfolio
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId },
    });

    if (!portfolio) {
      throw new AppError('Portfolio not found', 404, 'NOT_FOUND');
    }

    // Build where clause
    const where = {
      portfolioId: portfolio.id,
      isActive: true,
    };

    // Handle type filter (case-insensitive)
    if (type) {
      // Convert lowercase with underscore to uppercase
      // mutual_fund -> MUTUAL_FUND
      // stock -> STOCK
      // crypto -> CRYPTO
      const typeUpper = type.toUpperCase();
      where.type = typeUpper;
    }

    if (platform) {
      where.platform = platform;
    }

    if (search) {
      where.OR = [
        { symbol: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get investments
    const investments = await prisma.investment.findMany({
      where,
      orderBy: { [sortBy]: order },
      include: {
        transactions: {
          orderBy: { date: 'desc' },
          take: 5, // Last 5 transactions
        },
      },
    });

    res.status(200).json({
      success: true,
      data: {
        investments,
        count: investments.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
/**
 * Get single investment
 * GET /api/investments/:id
 */
const getInvestment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const investment = await prisma.investment.findFirst({
      where: {
        id,
        portfolio: { userId },
        isActive: true,
      },
      include: {
        transactions: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!investment) {
      throw new AppError('Investment not found', 404, 'NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      data: { investment },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update investment
 * PUT /api/investments/:id
 */
const updateInvestmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    // Check ownership
    const investment = await prisma.investment.findFirst({
      where: {
        id,
        portfolio: { userId },
      },
    });

    if (!investment) {
      throw new AppError('Investment not found', 404, 'NOT_FOUND');
    }

    // Update investment
    const updated = await updateInvestment(id, updates);

    res.status(200).json({
      success: true,
      message: 'Investment updated successfully',
      data: { investment: updated },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete investment
 * DELETE /api/investments/:id
 */
const deleteInvestmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check ownership
    const investment = await prisma.investment.findFirst({
      where: {
        id,
        portfolio: { userId },
      },
    });

    if (!investment) {
      throw new AppError('Investment not found', 404, 'NOT_FOUND');
    }

    // Delete investment
    await deleteInvestment(id);

    res.status(200).json({
      success: true,
      message: 'Investment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get investment statistics
 * GET /api/investments/stats
 */
const getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId },
    });

    if (!portfolio) {
      throw new AppError('Portfolio not found', 404, 'NOT_FOUND');
    }

    const stats = await getInvestmentStats(portfolio.id);

    res.status(200).json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addInvestment,
  getAllInvestments,
  getInvestment,
  updateInvestmentById,
  deleteInvestmentById,
  getStats,
};