// src/services/transactionService.js
const prisma = require('../config/database');
const { updatePortfolioSummary } = require('./portfolioService');

/**
 * Calculate investment metrics after transaction changes
 */
const recalculateInvestmentFromTransactions = async (investmentId) => {
  const investment = await prisma.investment.findUnique({
    where: { id: investmentId },
    include: {
      transactions: {
        orderBy: { date: 'asc' },
      },
    },
  });

  if (!investment) {
    throw new Error('Investment not found');
  }

  let totalQuantity = 0;
  let totalInvested = 0;
  let totalDividends = 0;

  investment.transactions.forEach((txn) => {
    const quantity = parseFloat(txn.quantity);
    const price = parseFloat(txn.price);
    const amount = parseFloat(txn.amount);

    switch (txn.type) {
      case 'BUY':
        totalQuantity += quantity;
        totalInvested += amount;
        break;

      case 'SELL':
        const avgPrice = totalQuantity > 0 ? totalInvested / totalQuantity : 0;
        totalQuantity -= quantity;
        totalInvested -= quantity * avgPrice;
        break;

      case 'DIVIDEND':
        totalDividends += amount;
        break;

      case 'BONUS':
        totalQuantity += quantity;
        // Bonus shares don't increase invested amount
        break;

      case 'SPLIT':
        totalQuantity += quantity;
        // Stock splits don't increase invested amount
        break;

      case 'MERGER':
        // Handle merger logic
        break;
    }
  });

  const avgBuyPrice = totalQuantity > 0 ? totalInvested / totalQuantity : 0;
  const currentPrice = parseFloat(investment.currentPrice);
  const currentValue = totalQuantity * currentPrice;
  const returns = (currentValue - totalInvested) + totalDividends;
  const returnsPercent = totalInvested > 0 ? (returns / totalInvested) * 100 : 0;

  // Update investment
  const updated = await prisma.investment.update({
    where: { id: investmentId },
    data: {
      quantity: totalQuantity,
      avgBuyPrice,
      investedAmount: totalInvested,
      currentValue,
      returns,
      returnsPercent,
    },
  });

  // Update portfolio summary
  await updatePortfolioSummary(investment.portfolioId);

  return updated;
};

/**
 * Create transaction and recalculate
 */
const createTransaction = async (data) => {
  // Validate investment exists
  const investment = await prisma.investment.findUnique({
    where: { id: data.investmentId },
  });

  if (!investment) {
    throw new Error('Investment not found');
  }

  // Calculate total amount
  const amount = parseFloat(data.quantity) * parseFloat(data.price);
  const totalAmount = amount + parseFloat(data.charges || 0) + parseFloat(data.tax || 0);

  // Create transaction
  const transaction = await prisma.transaction.create({
    data: {
      investmentId: data.investmentId,
      type: data.type,
      quantity: data.quantity,
      price: data.price,
      amount,
      charges: data.charges || 0,
      tax: data.tax || 0,
      totalAmount,
      date: new Date(data.date),
      notes: data.notes,
    },
  });

  // Recalculate investment
  await recalculateInvestmentFromTransactions(data.investmentId);

  return transaction;
};

/**
 * Update transaction and recalculate
 */
const updateTransaction = async (transactionId, updates) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!transaction) {
    throw new Error('Transaction not found');
  }

  // Recalculate amounts if quantity or price changed
  if (updates.quantity || updates.price || updates.charges || updates.tax) {
    const quantity = parseFloat(updates.quantity || transaction.quantity);
    const price = parseFloat(updates.price || transaction.price);
    const charges = parseFloat(updates.charges !== undefined ? updates.charges : transaction.charges);
    const tax = parseFloat(updates.tax !== undefined ? updates.tax : transaction.tax);

    const amount = quantity * price;
    const totalAmount = amount + charges + tax;

    updates.amount = amount;
    updates.totalAmount = totalAmount;
  }

  // Update transaction
  const updated = await prisma.transaction.update({
    where: { id: transactionId },
    data: updates,
  });

  // Recalculate investment
  await recalculateInvestmentFromTransactions(transaction.investmentId);

  return updated;
};

/**
 * Delete transaction and recalculate
 */
const deleteTransaction = async (transactionId) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!transaction) {
    throw new Error('Transaction not found');
  }

  await prisma.transaction.delete({
    where: { id: transactionId },
  });

  // Recalculate investment
  await recalculateInvestmentFromTransactions(transaction.investmentId);
};

/**
 * Calculate transaction summary with period filter
 */
const calculateTransactionSummary = async (portfolioId, period = 'All') => {
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
    case 'All':
      startDate = new Date('2000-01-01'); // Far past
      break;
    default:
      startDate = new Date('2000-01-01');
  }

  // Get all transactions in period
  const transactions = await prisma.transaction.findMany({
    where: {
      investment: {
        portfolioId,
      },
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  let totalBought = 0;
  let totalSold = 0;
  let totalDividends = 0;
  let totalCharges = 0;
  let totalTax = 0;
  let buyCount = 0;
  let sellCount = 0;
  let dividendCount = 0;

  transactions.forEach((txn) => {
    const amount = parseFloat(txn.amount);
    const charges = parseFloat(txn.charges);
    const tax = parseFloat(txn.tax);

    totalCharges += charges;
    totalTax += tax;

    switch (txn.type) {
      case 'BUY':
        totalBought += amount;
        buyCount++;
        break;
      case 'SELL':
        totalSold += amount;
        sellCount++;
        break;
      case 'DIVIDEND':
        totalDividends += amount;
        dividendCount++;
        break;
    }
  });

  const netInvested = totalBought - totalSold;

  return {
    period,
    totalBought: parseFloat(totalBought.toFixed(2)),
    totalSold: parseFloat(totalSold.toFixed(2)),
    netInvested: parseFloat(netInvested.toFixed(2)),
    totalDividends: parseFloat(totalDividends.toFixed(2)),
    totalCharges: parseFloat(totalCharges.toFixed(2)),
    totalTax: parseFloat(totalTax.toFixed(2)),
    transactionCount: transactions.length,
    buyCount,
    sellCount,
    dividendCount,
    dateRange: {
      from: startDate.toISOString().split('T')[0],
      to: endDate.toISOString().split('T')[0],
    },
  };
};

/**
 * Get transaction statistics
 */
const getTransactionStats = async (portfolioId) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      investment: {
        portfolioId,
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
  });

  // Group by type
  const byType = {};
  const byMonth = {};
  const byInvestment = {};

  transactions.forEach((txn) => {
    // By type
    if (!byType[txn.type]) {
      byType[txn.type] = { count: 0, amount: 0 };
    }
    byType[txn.type].count++;
    byType[txn.type].amount += parseFloat(txn.amount);

    // By month
    const month = new Date(txn.date).toISOString().slice(0, 7); // YYYY-MM
    if (!byMonth[month]) {
      byMonth[month] = { count: 0, amount: 0 };
    }
    byMonth[month].count++;
    byMonth[month].amount += parseFloat(txn.amount);

    // By investment
    if (!byInvestment[txn.investment.symbol]) {
      byInvestment[txn.investment.symbol] = {
        symbol: txn.investment.symbol,
        name: txn.investment.name,
        count: 0,
        amount: 0,
      };
    }
    byInvestment[txn.investment.symbol].count++;
    byInvestment[txn.investment.symbol].amount += parseFloat(txn.amount);
  });

  return {
    byType,
    byMonth,
    byInvestment: Object.values(byInvestment).sort((a, b) => b.amount - a.amount),
  };
};

module.exports = {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  recalculateInvestmentFromTransactions,
  calculateTransactionSummary,
  getTransactionStats,
};