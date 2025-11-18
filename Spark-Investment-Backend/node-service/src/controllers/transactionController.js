// src/controllers/transactionController.js
const prisma = require('../config/database');
const {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  calculateTransactionSummary,
  getTransactionStats,
} = require('../services/transactionService');
const { AppError, ERROR_CODES } = require('../middleware/errorHandler');

/**
 * Add new transaction
 * POST /api/transactions
 */
const addTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { investmentId, type, quantity, price, charges, tax, date, notes } = req.body;

    // Validate required fields
    if (!investmentId || !type || !quantity || !price || !date) {
      throw new AppError(
        'Missing required fields: investmentId, type, quantity, price, date',
        400,
        ERROR_CODES.MISSING_FIELD
      );
    }

    // Validate transaction type
    const validTypes = ['BUY', 'SELL', 'DIVIDEND', 'BONUS', 'SPLIT', 'MERGER'];
    if (!validTypes.includes(type)) {
      throw new AppError(
        `Invalid transaction type. Must be one of: ${validTypes.join(', ')}`,
        400,
        ERROR_CODES.VALIDATION_ERROR,
        'type'
      );
    }

    // Verify investment belongs to user
    const investment = await prisma.investment.findFirst({
      where: {
        id: investmentId,
        portfolio: { userId },
      },
    });

    if (!investment) {
      throw new AppError('Investment not found', 404, 'NOT_FOUND');
    }

    // Create transaction
    const transaction = await createTransaction({
      investmentId,
      type,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      charges: charges ? parseFloat(charges) : 0,
      tax: tax ? parseFloat(tax) : 0,
      date,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Transaction added successfully',
      data: { transaction },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all transactions with filters
 * GET /api/transactions?type=BUY&investmentId=uuid&startDate=2024-01-01&endDate=2024-12-31&limit=50
 */
const getAllTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      type,
      investmentId,
      startDate,
      endDate,
      limit = 100,
      sortBy = 'date',
      order = 'desc',
    } = req.query;

    // Get user's portfolio
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId },
    });

    if (!portfolio) {
      throw new AppError('Portfolio not found', 404, 'NOT_FOUND');
    }

    // Build where clause
    const where = {
      investment: {
        portfolioId: portfolio.id,
      },
    };

    if (type) {
      where.type = type.toUpperCase();
    }

    if (investmentId) {
      where.investmentId = investmentId;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    // Get transactions
    const transactions = await prisma.transaction.findMany({
      where,
      take: parseInt(limit),
      orderBy: { [sortBy]: order },
      include: {
        investment: {
          select: {
            id: true,
            symbol: true,
            name: true,
            type: true,
            platform: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: {
        transactions,
        count: transactions.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single transaction
 * GET /api/transactions/:id
 */
const getTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        investment: {
          portfolio: { userId },
        },
      },
      include: {
        investment: {
          select: {
            id: true,
            symbol: true,
            name: true,
            type: true,
            platform: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new AppError('Transaction not found', 404, 'NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      data: { transaction },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update transaction
 * PUT /api/transactions/:id
 */
const updateTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    // Verify ownership
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        investment: {
          portfolio: { userId },
        },
      },
    });

    if (!transaction) {
      throw new AppError('Transaction not found', 404, 'NOT_FOUND');
    }

    // Update transaction
    const updated = await updateTransaction(id, updates);

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: { transaction: updated },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete transaction
 * DELETE /api/transactions/:id
 */
const deleteTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify ownership
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        investment: {
          portfolio: { userId },
        },
      },
    });

    if (!transaction) {
      throw new AppError('Transaction not found', 404, 'NOT_FOUND');
    }

    // Delete transaction
    await deleteTransaction(id);

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get transaction summary with period filter
 * GET /api/transactions/summary?period=1M
 */
const getTransactionSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { period = 'All' } = req.query;

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId },
    });

    if (!portfolio) {
      throw new AppError('Portfolio not found', 404, 'NOT_FOUND');
    }

    const summary = await calculateTransactionSummary(portfolio.id, period);

    res.status(200).json({
      success: true,
      data: { summary },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get transaction statistics
 * GET /api/transactions/stats
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

    const stats = await getTransactionStats(portfolio.id);

    res.status(200).json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Export transactions
 * GET /api/transactions/export?format=csv&type=BUY&startDate=2024-01-01
 */
const exportTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { format = 'csv', type, startDate, endDate } = req.query;

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId },
    });

    if (!portfolio) {
      throw new AppError('Portfolio not found', 404, 'NOT_FOUND');
    }

    // Build where clause
    const where = {
      investment: {
        portfolioId: portfolio.id,
      },
    };

    if (type) where.type = type.toUpperCase();
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    // Get transactions
    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        investment: {
          select: {
            symbol: true,
            name: true,
            type: true,
            platform: true,
          },
        },
      },
    });

    if (format === 'csv') {
      // Generate CSV
      const csvRows = [];
      csvRows.push([
        'Date',
        'Type',
        'Symbol',
        'Investment Name',
        'Investment Type',
        'Platform',
        'Quantity',
        'Price',
        'Amount',
        'Charges',
        'Tax',
        'Total Amount',
        'Notes',
      ].join(','));

      transactions.forEach((txn) => {
        csvRows.push([
          new Date(txn.date).toISOString().split('T')[0],
          txn.type,
          txn.investment.symbol,
          `"${txn.investment.name}"`,
          txn.investment.type,
          txn.investment.platform,
          txn.quantity,
          txn.price,
          txn.amount,
          txn.charges,
          txn.tax,
          txn.totalAmount,
          `"${txn.notes || ''}"`,
        ].join(','));
      });

      const csv = csvRows.join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=transactions_${Date.now()}.csv`);
      res.status(200).send(csv);
    } else if (format === 'json') {
      res.status(200).json({
        success: true,
        data: { transactions },
      });
    } else {
      throw new AppError('Invalid format. Supported formats: csv, json', 400, ERROR_CODES.VALIDATION_ERROR);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get investment transactions
 * GET /api/investments/:id/transactions
 */
const getInvestmentTransactions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify investment ownership
    const investment = await prisma.investment.findFirst({
      where: {
        id,
        portfolio: { userId },
      },
    });

    if (!investment) {
      throw new AppError('Investment not found', 404, 'NOT_FOUND');
    }

    // Get transactions
    const transactions = await prisma.transaction.findMany({
      where: { investmentId: id },
      orderBy: { date: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: {
        transactions,
        count: transactions.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get investment transaction summary
 * GET /api/investments/:id/transactions/summary
 */
const getInvestmentTransactionSummary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify investment ownership
    const investment = await prisma.investment.findFirst({
      where: {
        id,
        portfolio: { userId },
      },
      include: {
        transactions: true,
      },
    });

    if (!investment) {
      throw new AppError('Investment not found', 404, 'NOT_FOUND');
    }

    let totalBought = 0;
    let totalSold = 0;
    let totalDividends = 0;
    let totalCharges = 0;
    let totalTax = 0;

    investment.transactions.forEach((txn) => {
      const amount = parseFloat(txn.amount);
      totalCharges += parseFloat(txn.charges);
      totalTax += parseFloat(txn.tax);

      switch (txn.type) {
        case 'BUY':
          totalBought += amount;
          break;
        case 'SELL':
          totalSold += amount;
          break;
        case 'DIVIDEND':
          totalDividends += amount;
          break;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        summary: {
          symbol: investment.symbol,
          name: investment.name,
          totalBought: parseFloat(totalBought.toFixed(2)),
          totalSold: parseFloat(totalSold.toFixed(2)),
          netInvested: parseFloat((totalBought - totalSold).toFixed(2)),
          totalDividends: parseFloat(totalDividends.toFixed(2)),
          totalCharges: parseFloat(totalCharges.toFixed(2)),
          totalTax: parseFloat(totalTax.toFixed(2)),
          transactionCount: investment.transactions.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addTransaction,
  getAllTransactions,
  getTransaction,
  updateTransactionById,
  deleteTransactionById,
  getTransactionSummary,
  getStats,
  exportTransactions,
  getInvestmentTransactions,
  getInvestmentTransactionSummary,
};