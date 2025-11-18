// src/services/investmentService.js
const prisma = require('../config/database');
const { updatePortfolioSummary } = require('./portfolioService');

/**
 * Calculate investment metrics
 */
const calculateInvestmentMetrics = (data) => {
  const quantity = parseFloat(data.quantity);
  const avgBuyPrice = parseFloat(data.avgBuyPrice);
  const currentPrice = parseFloat(data.currentPrice);

  const investedAmount = quantity * avgBuyPrice;
  const currentValue = quantity * currentPrice;
  const returns = currentValue - investedAmount;
  const returnsPercent = investedAmount > 0 ? (returns / investedAmount) * 100 : 0;

  return {
    investedAmount: parseFloat(investedAmount.toFixed(2)),
    currentValue: parseFloat(currentValue.toFixed(2)),
    returns: parseFloat(returns.toFixed(2)),
    returnsPercent: parseFloat(returnsPercent.toFixed(4)),
  };
};

/**
 * Create investment with calculated metrics
 */
const createInvestment = async (portfolioId, data) => {
  const metrics = calculateInvestmentMetrics(data);

  const investment = await prisma.investment.create({
    data: {
      portfolioId,
      symbol: data.symbol.toUpperCase(),
      name: data.name,
      type: data.type,
      platform: data.platform || 'Manual',
      sector: data.sector,
      quantity: data.quantity,
      avgBuyPrice: data.avgBuyPrice,
      currentPrice: data.currentPrice,
      purchaseDate: new Date(data.purchaseDate),
      notes: data.notes,
      ...metrics,
    },
  });

  // Create initial BUY transaction
  await prisma.transaction.create({
    data: {
      investmentId: investment.id,
      type: 'BUY',
      quantity: data.quantity,
      price: data.avgBuyPrice,
      amount: metrics.investedAmount,
      totalAmount: metrics.investedAmount,
      date: new Date(data.purchaseDate),
      notes: 'Initial purchase',
    },
  });

  // Update portfolio summary
  await updatePortfolioSummary(portfolioId);

  return investment;
};

/**
 * Update investment with recalculation
 */
const updateInvestment = async (investmentId, data) => {
  const investment = await prisma.investment.findUnique({
    where: { id: investmentId },
  });

  if (!investment) {
    throw new Error('Investment not found');
  }

  // Calculate new metrics if price/quantity changed
  const updateData = { ...data };
  
  if (data.quantity || data.avgBuyPrice || data.currentPrice) {
    const metrics = calculateInvestmentMetrics({
      quantity: data.quantity || investment.quantity,
      avgBuyPrice: data.avgBuyPrice || investment.avgBuyPrice,
      currentPrice: data.currentPrice || investment.currentPrice,
    });
    Object.assign(updateData, metrics);
  }

  const updated = await prisma.investment.update({
    where: { id: investmentId },
    data: updateData,
  });

  // Update portfolio summary
  await updatePortfolioSummary(investment.portfolioId);

  return updated;
};

/**
 * Delete investment (soft delete)
 */
const deleteInvestment = async (investmentId) => {
  const investment = await prisma.investment.findUnique({
    where: { id: investmentId },
  });

  if (!investment) {
    throw new Error('Investment not found');
  }

  // Soft delete - mark as inactive
  await prisma.investment.update({
    where: { id: investmentId },
    data: { isActive: false },
  });

  // Update portfolio summary
  await updatePortfolioSummary(investment.portfolioId);
};

/**
 * Get investment statistics
 */
const getInvestmentStats = async (portfolioId) => {
  const investments = await prisma.investment.findMany({
    where: {
      portfolioId,
      isActive: true,
    },
  });

  const stats = {
    totalInvestments: investments.length,
    byType: {},
    byPlatform: {},
    topGainers: [],
    topLosers: [],
  };

  // Group by type
  investments.forEach((inv) => {
    if (!stats.byType[inv.type]) {
      stats.byType[inv.type] = 0;
    }
    stats.byType[inv.type] += 1;

    if (!stats.byPlatform[inv.platform]) {
      stats.byPlatform[inv.platform] = 0;
    }
    stats.byPlatform[inv.platform] += 1;
  });

  // Top gainers and losers
  const sorted = investments
    .map((inv) => ({
      id: inv.id,
      symbol: inv.symbol,
      name: inv.name,
      returnsPercent: parseFloat(inv.returnsPercent),
    }))
    .sort((a, b) => b.returnsPercent - a.returnsPercent);

  stats.topGainers = sorted.slice(0, 5);
  stats.topLosers = sorted.slice(-5).reverse();

  return stats;
};

module.exports = {
  calculateInvestmentMetrics,
  createInvestment,
  updateInvestment,
  deleteInvestment,
  getInvestmentStats,
};