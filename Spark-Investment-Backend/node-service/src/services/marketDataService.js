// src/services/marketDataService.js
const axios = require('axios');
const redis = require('../config/redis');
const prisma = require('../config/database');
const logger = require('../utils/logger');

/**
 * Get stock price from Yahoo Finance
 */
const getStockPrice = async (symbol, exchange = 'NSE') => {
  try {
    // Add exchange suffix
    let yahooSymbol = symbol;
    if (exchange === 'NSE') {
      yahooSymbol = `${symbol}.NS`;
    } else if (exchange === 'BSE') {
      yahooSymbol = `${symbol}.BO`;
    }

    // Check Redis cache first (5 minute cache)
    const cacheKey = `price:${yahooSymbol}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    // Fetch from Yahoo Finance API
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`;
    const response = await axios.get(url, {
      params: {
        interval: '1d',
        range: '1d',
      },
      timeout: 5000,
    });

    const result = response.data.chart.result[0];
    const quote = result.meta;
    const currentPrice = quote.regularMarketPrice;

    if (!currentPrice) {
      throw new Error('Price not available');
    }

    const priceData = {
      symbol,
      yahooSymbol,
      price: currentPrice,
      currency: quote.currency || 'INR',
      exchange: quote.exchangeName || exchange,
      timestamp: new Date().toISOString(),
      source: 'Yahoo Finance',
    };

    // Cache for 5 minutes
    await redis.set(cacheKey, JSON.stringify(priceData), 'EX', 300);

    return priceData;
  } catch (error) {
    logger.error(`Failed to fetch price for ${symbol}:`, error.message);
    return null;
  }
};

/**
 * Get crypto price from CoinGecko
 */
const getCryptoPrice = async (symbol) => {
  try {
    // Map common symbols to CoinGecko IDs
    const cryptoMap = {
      BTC: 'bitcoin',
      ETH: 'ethereum',
      USDT: 'tether',
      BNB: 'binancecoin',
      XRP: 'ripple',
      ADA: 'cardano',
      DOGE: 'dogecoin',
      SOL: 'solana',
      MATIC: 'matic-network',
      DOT: 'polkadot',
    };

    const coinId = cryptoMap[symbol.toUpperCase()] || symbol.toLowerCase();

    // Check Redis cache (5 minute cache)
    const cacheKey = `crypto:${coinId}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    // Fetch from CoinGecko
    const url = `https://api.coingecko.com/api/v3/simple/price`;
    const response = await axios.get(url, {
      params: {
        ids: coinId,
        vs_currencies: 'inr,usd',
        include_24hr_change: true,
      },
      timeout: 5000,
    });

    const data = response.data[coinId];
    
    if (!data) {
      throw new Error('Crypto not found');
    }

    const priceData = {
      symbol: symbol.toUpperCase(),
      coinId,
      price: data.inr,
      priceUSD: data.usd,
      change24h: data.inr_24h_change,
      currency: 'INR',
      timestamp: new Date().toISOString(),
      source: 'CoinGecko',
    };

    // Cache for 5 minutes
    await redis.set(cacheKey, JSON.stringify(priceData), 'EX', 300);

    return priceData;
  } catch (error) {
    logger.error(`Failed to fetch crypto price for ${symbol}:`, error.message);
    return null;
  }
};

/**
 * Get mutual fund NAV (mock for now - need proper MF API)
 */
const getMutualFundNAV = async (symbol) => {
  try {
    // Check cache
    const cacheKey = `mf:${symbol}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    // TODO: Integrate proper mutual fund API
    // For now, return mock data
    const priceData = {
      symbol,
      price: null, // Will need proper MF API
      currency: 'INR',
      timestamp: new Date().toISOString(),
      source: 'Manual',
      note: 'Mutual fund prices need manual update or proper API integration',
    };

    return priceData;
  } catch (error) {
    logger.error(`Failed to fetch MF NAV for ${symbol}:`, error.message);
    return null;
  }
};

/**
 * Update price for single investment
 */
const updateInvestmentPrice = async (investment) => {
  let priceData = null;

  try {
    switch (investment.type) {
      case 'STOCK':
      case 'ETF':
        // Try NSE first, then BSE
        priceData = await getStockPrice(investment.symbol, 'NSE');
        if (!priceData) {
          priceData = await getStockPrice(investment.symbol, 'BSE');
        }
        break;

      case 'CRYPTO':
        priceData = await getCryptoPrice(investment.symbol);
        break;

      case 'MUTUAL_FUND':
        priceData = await getMutualFundNAV(investment.symbol);
        break;

      default:
        // For BOND, GOLD, FD, PPF, NPS - manual update only
        return null;
    }

    if (!priceData || !priceData.price) {
      return null;
    }

    // Update investment
    const quantity = parseFloat(investment.quantity);
    const avgBuyPrice = parseFloat(investment.avgBuyPrice);
    const currentPrice = priceData.price;
    const investedAmount = parseFloat(investment.investedAmount);
    const currentValue = quantity * currentPrice;
    const returns = currentValue - investedAmount;
    const returnsPercent = investedAmount > 0 ? (returns / investedAmount) * 100 : 0;

    await prisma.investment.update({
      where: { id: investment.id },
      data: {
        currentPrice,
        currentValue,
        returns,
        returnsPercent,
        updatedAt: new Date(),
      },
    });

    return {
      investmentId: investment.id,
      symbol: investment.symbol,
      oldPrice: parseFloat(investment.currentPrice),
      newPrice: currentPrice,
      updated: true,
    };
  } catch (error) {
    logger.error(`Failed to update price for ${investment.symbol}:`, error.message);
    return null;
  }
};

/**
 * Update all investment prices
 */
const updateAllPrices = async (portfolioId = null) => {
  try {
    logger.info('Starting price update job...');

    // Build where clause
    const where = {
      isActive: true,
    };

    if (portfolioId) {
      where.portfolioId = portfolioId;
    }

    // Get all active investments that support price updates
    const investments = await prisma.investment.findMany({
      where,
      select: {
        id: true,
        portfolioId: true,
        symbol: true,
        type: true,
        quantity: true,
        avgBuyPrice: true,
        currentPrice: true,
        investedAmount: true,
      },
    });

    logger.info(`Found ${investments.length} investments to update`);

    const results = {
      total: investments.length,
      updated: 0,
      failed: 0,
      skipped: 0,
      details: [],
    };

    // Update prices with rate limiting (max 10 concurrent)
    const batchSize = 10;
    for (let i = 0; i < investments.length; i += batchSize) {
      const batch = investments.slice(i, i + batchSize);
      
      const batchResults = await Promise.all(
        batch.map(inv => updateInvestmentPrice(inv))
      );

      batchResults.forEach((result) => {
        if (result === null) {
          results.skipped++;
        } else if (result.updated) {
          results.updated++;
          results.details.push(result);
        } else {
          results.failed++;
        }
      });

      // Wait 1 second between batches to avoid rate limits
      if (i + batchSize < investments.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Update portfolio summaries
    const portfolioIds = [...new Set(investments.map(inv => inv.portfolioId))];
    const { updatePortfolioSummary } = require('./portfolioService');
    
    for (const pid of portfolioIds) {
      await updatePortfolioSummary(pid);
    }

    logger.info(`Price update complete. Updated: ${results.updated}, Failed: ${results.failed}, Skipped: ${results.skipped}`);

    return results;
  } catch (error) {
    logger.error('Price update job failed:', error);
    throw error;
  }
};

module.exports = {
  getStockPrice,
  getCryptoPrice,
  getMutualFundNAV,
  updateInvestmentPrice,
  updateAllPrices,
};