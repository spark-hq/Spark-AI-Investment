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
      include: {
        investments: {
          where: { isActive: true },
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
        },
      },
    });

    // Calculate day change (mock for now - will be real with price updates later)
    const dayChange = 0; // TODO: Calculate from price history
    const dayChangePercentage = 0;

    // Calculate asset allocation
    const allocation = {
      equity: 0,
      debt: 0,
      gold: 0,
      crypto: 0,
    };

    let totalValue = parseFloat(updatedPortfolio.currentValue);

    updatedPortfolio.investments.forEach((inv) => {
      const value = parseFloat(inv.currentValue);
      const percent = totalValue > 0 ? (value / totalValue) * 100 : 0;

      switch (inv.type) {
        case 'STOCK':
        case 'ETF':
          allocation.equity += percent;
          break;
        case 'BOND':
        case 'FD':
        case 'PPF':
          allocation.debt += percent;
          break;
        case 'GOLD':
          allocation.gold += percent;
          break;
        case 'CRYPTO':
          allocation.crypto += percent;
          break;
      }
    });

    // Calculate platform breakdown
    const platformMap = {};
    updatedPortfolio.investments.forEach((inv) => {
      if (!platformMap[inv.platform]) {
        platformMap[inv.platform] = {
          platform: inv.platform,
          invested: 0,
          currentValue: 0,
          returns: 0,
          returnsPercentage: 0,
        };
      }

      platformMap[inv.platform].invested += parseFloat(inv.investedAmount);
      platformMap[inv.platform].currentValue += parseFloat(inv.currentValue);
    });

    const platformBreakdown = Object.values(platformMap).map((p) => {
      p.returns = p.currentValue - p.invested;
      p.returnsPercentage = p.invested > 0 ? (p.returns / p.invested) * 100 : 0;
      return p;
    });

    res.status(200).json({
      success: true,
      data: {
        totalInvested: parseFloat(updatedPortfolio.totalInvested),
        currentValue: parseFloat(updatedPortfolio.currentValue),
        totalReturns: parseFloat(updatedPortfolio.returns),
        returnsPercentage: parseFloat(updatedPortfolio.returnsPercent),
        dayChange,
        dayChangePercentage,
        assetAllocation: {
          equity: parseFloat(allocation.equity.toFixed(2)),
          debt: parseFloat(allocation.debt.toFixed(2)),
          gold: parseFloat(allocation.gold.toFixed(2)),
          crypto: parseFloat(allocation.crypto.toFixed(2)),
        },
        platformBreakdown,
        lastUpdated: updatedPortfolio.lastUpdated,
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

/**
 * Get portfolio performance over time
 * GET /api/portfolio/performance?period=1M&interval=day
 */
const getPerformance = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { period = '1M', interval = 'day' } = req.query;

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId },
      include: {
        investments: {
          where: { isActive: true },
          include: {
            transactions: {
              orderBy: { date: 'asc' },
            },
          },
        },
      },
    });

    if (!portfolio) {
      throw new AppError('Portfolio not found', 404, 'NOT_FOUND');
    }

    // Calculate date range
    const endDate = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '1W':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '1M':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case '6M':
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case '1Y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      case '3Y':
        startDate.setFullYear(endDate.getFullYear() - 3);
        break;
      case '5Y':
        startDate.setFullYear(endDate.getFullYear() - 5);
        break;
      case 'All':
        startDate = new Date(portfolio.createdAt);
        break;
    }

    // Generate performance data points
    // For now, generate mock data - will be real when we add price history
    const data = [];
    const currentDate = new Date(startDate);
    let invested = 0;
    let currentValue = 0;

    // Get transactions in date range
    const allTransactions = portfolio.investments.flatMap(inv => 
      inv.transactions.filter(t => new Date(t.date) >= startDate)
    ).sort((a, b) => new Date(a.date) - new Date(b.date));

    while (currentDate <= endDate) {
      // Calculate invested amount up to this date
      const txnsUpToDate = allTransactions.filter(t => 
        new Date(t.date) <= currentDate
      );

      invested = txnsUpToDate.reduce((sum, txn) => {
        return txn.type === 'BUY' ? sum + parseFloat(txn.totalAmount) : sum;
      }, 0);

      // For now, use current value (mock growth)
      // TODO: Calculate actual value based on historical prices
      const growthFactor = invested > 0 ? parseFloat(portfolio.currentValue) / parseFloat(portfolio.totalInvested) : 1;
      currentValue = invested * growthFactor;

      data.push({
        date: currentDate.toISOString().split('T')[0],
        invested: parseFloat(invested.toFixed(2)),
        currentValue: parseFloat(currentValue.toFixed(2)),
        returns: parseFloat((currentValue - invested).toFixed(2)),
      });

      // Increment date based on interval
      switch (interval) {
        case 'day':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'week':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'month':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
      }
    }

    // Calculate metrics
    const totalReturn = parseFloat(portfolio.returns);
    const totalInvested = parseFloat(portfolio.totalInvested);
    
    // CAGR calculation (annualized return)
    const years = (endDate - startDate) / (365 * 24 * 60 * 60 * 1000);
    const cagr = years > 0 && totalInvested > 0
      ? (Math.pow((totalInvested + totalReturn) / totalInvested, 1 / years) - 1) * 100
      : 0;

    // Mock values for now
    const sharpeRatio = 1.5; // TODO: Calculate from returns volatility
    const maxDrawdown = -10; // TODO: Calculate from data points
    const volatility = 15; // TODO: Calculate standard deviation

    res.status(200).json({
      success: true,
      data: {
        period,
        data: data.slice(-100), // Limit to last 100 points
        cagr: parseFloat(cagr.toFixed(2)),
        sharpeRatio: parseFloat(sharpeRatio.toFixed(2)),
        maxDrawdown: parseFloat(maxDrawdown.toFixed(2)),
        volatility: parseFloat(volatility.toFixed(2)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get connected platforms
 * GET /api/portfolio/platforms
 */
const getPlatforms = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId },
      include: {
        investments: {
          where: { isActive: true },
        },
      },
    });

    if (!portfolio) {
      throw new AppError('Portfolio not found', 404, 'NOT_FOUND');
    }

    // Group investments by platform
    const platformMap = {};
    
    portfolio.investments.forEach((inv) => {
      if (!platformMap[inv.platform]) {
        platformMap[inv.platform] = {
          id: inv.platform.toLowerCase().replace(/\s+/g, '-'),
          name: inv.platform,
          status: 'connected', // Manual entry platforms are always "connected"
          lastSynced: inv.updatedAt,
          holdings: 0,
          value: 0,
          apiKeyId: null, // No API keys for manual entry
        };
      }

      platformMap[inv.platform].holdings += 1;
      platformMap[inv.platform].value += parseFloat(inv.currentValue);
      
      // Update lastSynced to most recent
      if (new Date(inv.updatedAt) > new Date(platformMap[inv.platform].lastSynced)) {
        platformMap[inv.platform].lastSynced = inv.updatedAt;
      }
    });

    const platforms = Object.values(platformMap);

    res.status(200).json({
      success: true,
      data: { platforms },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Connect platform
 * POST /api/portfolio/platforms/connect
 */
const connectPlatform = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { platform, apiKey, apiSecret, additionalAuth } = req.body;

    // Validate required fields
    if (!platform) {
      throw new AppError('Platform name is required', 400, ERROR_CODES.MISSING_FIELD, 'platform');
    }

    // Get portfolio
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId },
    });

    if (!portfolio) {
      throw new AppError('Portfolio not found. Please initialize first.', 404, 'NOT_FOUND');
    }

    // Validate platform name
    const validPlatforms = ['Zerodha', 'Groww', 'Upstox', 'Binance', 'Angel One', 'ICICI Direct'];
    if (!validPlatforms.includes(platform)) {
      throw new AppError(
        `Invalid platform. Supported platforms: ${validPlatforms.join(', ')}`,
        400,
        ERROR_CODES.VALIDATION_ERROR,
        'platform'
      );
    }

    // Check if platform already exists
    const existingInvestments = await prisma.investment.findFirst({
      where: {
        portfolioId: portfolio.id,
        platform,
        isActive: true,
      },
    });

    if (existingInvestments) {
      return res.status(200).json({
        success: true,
        message: 'Platform already connected',
        data: {
          platform,
          status: 'connected',
          connectedAt: new Date().toISOString(),
        },
      });
    }

    // For now, we're not storing API keys (manual entry mode)
    // TODO: When implementing real API integration, store encrypted credentials
    
    // Create a placeholder to mark platform as "connected"
    // In reality, this would validate API credentials with the platform
    
    res.status(201).json({
      success: true,
      message: 'Platform connected successfully',
      data: {
        platform,
        status: 'connected',
        connectedAt: new Date().toISOString(),
        note: 'You can now add investments from this platform manually. API sync coming soon!',
      },
    });

    // TODO: Background job to sync platform data using API credentials
  } catch (error) {
    next(error);
  }
};

/**
 * Disconnect platform
 * DELETE /api/platforms/connect/:platformId
 */
const disconnectPlatform = async (req, res, next) => {
  try {
    const { platformId } = req.params;
    const userId = req.user.id;

    // Get portfolio
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId },
    });

    if (!portfolio) {
      throw new AppError('Portfolio not found', 404, 'NOT_FOUND');
    }

    // platformId is actually the platform name (zerodha, groww, etc.)
    // Convert to proper case
    const platformName = platformId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Find investments for this platform
    const investments = await prisma.investment.findMany({
      where: {
        portfolioId: portfolio.id,
        platform: {
          contains: platformName,
          mode: 'insensitive',
        },
        isActive: true,
      },
    });

    if (investments.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Platform not connected or no active investments found',
      });
    }

    // Soft delete all investments from this platform
    await prisma.investment.updateMany({
      where: {
        portfolioId: portfolio.id,
        platform: {
          contains: platformName,
          mode: 'insensitive',
        },
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    // Update portfolio summary
    await updatePortfolioSummary(portfolio.id);

    res.status(200).json({
      success: true,
      message: 'Platform disconnected successfully',
      data: {
        platform: platformName,
        investmentsRemoved: investments.length,
      },
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Sync platform data
 * POST /api/portfolio/platforms/:platformId/sync
 */
const syncPlatform = async (req, res, next) => {
  try {
    const { platformId } = req.params;
    const userId = req.user.id;

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId },
    });

    if (!portfolio) {
      throw new AppError('Portfolio not found', 404, 'NOT_FOUND');
    }

    // For now, return mock response
    // TODO: Implement actual platform API sync
    const syncId = require('crypto').randomUUID();

    res.status(202).json({
      success: true,
      message: 'Sync initiated',
      data: {
        syncId,
        status: 'pending',
        estimatedTime: 30, // seconds
      },
    });

    // TODO: Background job to sync platform data
  } catch (error) {
    next(error);
  }
};


/**
 * Get top performers
 * GET /api/portfolio/top-performers?limit=5
 */
const getTopPerformers = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 5 } = req.query;

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId },
      include: {
        investments: {
          where: { isActive: true },
          orderBy: { returnsPercent: 'desc' },
          take: parseInt(limit),
        },
      },
    });

    if (!portfolio) {
      throw new AppError('Portfolio not found', 404, 'NOT_FOUND');
    }

    const topPerformers = portfolio.investments.map((inv) => ({
      symbol: inv.symbol,
      name: inv.name,
      returns: parseFloat(inv.returnsPercent),
      currentValue: parseFloat(inv.currentValue),
      type: inv.type,
    }));

    res.status(200).json({
      success: true,
      data: topPerformers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get recent activity
 * GET /api/portfolio/activity?limit=10
 */
const getActivity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId },
    });

    if (!portfolio) {
      throw new AppError('Portfolio not found', 404, 'NOT_FOUND');
    }

    // Get recent transactions
    const transactions = await prisma.transaction.findMany({
      where: {
        investment: {
          portfolioId: portfolio.id,
        },
      },
      include: {
        investment: {
          select: {
            symbol: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: { date: 'desc' },
      take: parseInt(limit),
    });

    const activity = transactions.map((txn) => ({
      type: txn.type.toLowerCase(),
      symbol: txn.investment.symbol,
      name: txn.investment.name,
      investmentType: txn.investment.type,
      amount: parseFloat(txn.totalAmount),
      quantity: parseFloat(txn.quantity),
      price: parseFloat(txn.price),
      timestamp: txn.date,
    }));

    res.status(200).json({
      success: true,
      data: activity,
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
  getPerformance,       
  getPlatforms,         
  syncPlatform,         
  getTopPerformers,     
  getActivity,
  connectPlatform,
  disconnectPlatform,          
};