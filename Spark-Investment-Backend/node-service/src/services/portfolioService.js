// src/services/portfolioService.js
const prisma = require('../config/database');

/**
 * Calculate portfolio summary
 */
const calculatePortfolioSummary = async (portfolioId) => {
  const investments = await prisma.investment.findMany({
    where: {
      portfolioId,
      isActive: true,
    },
  });

  let totalInvested = 0;
  let currentValue = 0;

  investments.forEach((inv) => {
    totalInvested += parseFloat(inv.investedAmount);
    currentValue += parseFloat(inv.currentValue);
  });

  const returns = currentValue - totalInvested;
  const returnsPercent = totalInvested > 0 ? (returns / totalInvested) * 100 : 0;

  return {
    totalInvested,
    currentValue,
    returns,
    returnsPercent,
  };
};

/**
 * Update portfolio summary
 */
const updatePortfolioSummary = async (portfolioId) => {
  const summary = await calculatePortfolioSummary(portfolioId);

  await prisma.portfolio.update({
    where: { id: portfolioId },
    data: {
      ...summary,
      lastUpdated: new Date(),
    },
  });

  return summary;
};

/**
 * Calculate asset allocation
 */
const calculateAssetAllocation = async (portfolioId) => {
  const investments = await prisma.investment.findMany({
    where: {
      portfolioId,
      isActive: true,
    },
  });

  const allocation = {};
  let totalValue = 0;

  investments.forEach((inv) => {
    const value = parseFloat(inv.currentValue);
    totalValue += value;

    if (!allocation[inv.type]) {
      allocation[inv.type] = {
        type: inv.type,
        value: 0,
        count: 0,
      };
    }

    allocation[inv.type].value += value;
    allocation[inv.type].count += 1;
  });

  // Calculate percentages
  const allocationArray = Object.values(allocation).map((item) => ({
    ...item,
    percentage: totalValue > 0 ? (item.value / totalValue) * 100 : 0,
  }));

  return allocationArray;
};

/**
 * Calculate investment metrics
 */
const calculateInvestmentMetrics = (investment) => {
  const quantity = parseFloat(investment.quantity);
  const avgBuyPrice = parseFloat(investment.avgBuyPrice);
  const currentPrice = parseFloat(investment.currentPrice);

  const investedAmount = quantity * avgBuyPrice;
  const currentValue = quantity * currentPrice;
  const returns = currentValue - investedAmount;
  const returnsPercent = investedAmount > 0 ? (returns / investedAmount) * 100 : 0;

  return {
    investedAmount: investedAmount.toFixed(2),
    currentValue: currentValue.toFixed(2),
    returns: returns.toFixed(2),
    returnsPercent: returnsPercent.toFixed(4),
  };
};

/**
 * Recalculate investment after transaction
 */
const recalculateInvestment = async (investmentId) => {
  const investment = await prisma.investment.findUnique({
    where: { id: investmentId },
    include: { transactions: true },
  });

  if (!investment) {
    throw new Error('Investment not found');
  }

  let totalQuantity = 0;
  let totalInvested = 0;

  investment.transactions.forEach((txn) => {
    const quantity = parseFloat(txn.quantity);
    const price = parseFloat(txn.price);

    if (txn.type === 'BUY') {
      totalQuantity += quantity;
      totalInvested += quantity * price;
    } else if (txn.type === 'SELL') {
      const avgPrice = totalQuantity > 0 ? totalInvested / totalQuantity : 0;
      totalQuantity -= quantity;
      totalInvested -= quantity * avgPrice;
    }
  });

  const avgBuyPrice = totalQuantity > 0 ? totalInvested / totalQuantity : 0;
  const currentPrice = parseFloat(investment.currentPrice);

  const metrics = calculateInvestmentMetrics({
    quantity: totalQuantity,
    avgBuyPrice,
    currentPrice,
  });

  await prisma.investment.update({
    where: { id: investmentId },
    data: {
      quantity: totalQuantity,
      avgBuyPrice,
      ...metrics,
    },
  });

  return metrics;
};

module.exports = {
  calculatePortfolioSummary,
  updatePortfolioSummary,
  calculateAssetAllocation,
  calculateInvestmentMetrics,
  recalculateInvestment,
};