// ===================================
// Consolidated Mock Data
// ===================================
// This file consolidates all mock data for easy access by the API service layer
// When MOCK_MODE is enabled, the API service will return data from here

// Import all existing mock data files
import * as dummyData from './dummyData';
import * as investmentData from './investmentData';
import * as aiAnalysisData from './aiAnalysisData';
import * as portfolioData from './portfolioData';
import * as marketData from './marketData';
import * as liveMarketData from './liveMarketData';
import * as transactionData from './transactionData';
import * as autoInvestData from './autoInvestData';
import * as settingsData from './settingsData';

// ===================================
// Portfolio Mock Data
// ===================================
export const mockPortfolio = {
  summary: portfolioData.portfolioSummary,
  platforms: portfolioData.connectedPlatforms,
  performance: portfolioData.performanceData,
  allocation: portfolioData.assetAllocation,
  topPerformers: portfolioData.topPerformers,
  recentActivity: portfolioData.recentActivity,
};

// ===================================
// Investment Mock Data
// ===================================
export const mockInvestments = {
  summary: investmentData.investmentSummary,
  holdings: investmentData.investments, // Main investments array
  mutualFunds: investmentData.investments.filter(inv => inv.type === 'Mutual Fund'),
  stocks: investmentData.investments.filter(inv => inv.type === 'Stock'),
  crypto: investmentData.investments.filter(inv => inv.type === 'Crypto'),
};

// ===================================
// Market Data Mock
// ===================================
export const mockMarketData = {
  indices: liveMarketData.indianIndices,
  topGainers: liveMarketData.topGainers,
  topLosers: liveMarketData.topLosers,
  sectorPerformance: liveMarketData.sectorPerformance,
  cryptoMarket: marketData.cryptoMarket,
  forexRates: marketData.forexRates,
};

// ===================================
// AI Analysis Mock Data
// ===================================
export const mockAIAnalysis = {
  portfolioInsights: aiAnalysisData.portfolioInsights,
  recommendations: aiAnalysisData.portfolioRecommendations,
  riskAnalysis: aiAnalysisData.riskAnalysis,
  marketSentiment: aiAnalysisData.marketSentiment,
  aiChat: aiAnalysisData.chatMessages,
  quickInsights: aiAnalysisData.quickInsights,
};

// ===================================
// Transaction Mock Data
// ===================================
export const mockTransactions = {
  transactions: transactionData.transactions,
  summary: transactionData.transactionSummary,
};

// ===================================
// Auto-Invest Mock Data
// ===================================
export const mockAutoInvest = {
  strategies: autoInvestData.aiInvestmentPlans, // Fixed: was autoInvestStrategies
  backtestResults: autoInvestData.backtestResults, // Fixed: was historicalBacktestData
  sipRecommendations: autoInvestData.aiInvestmentPlans.filter(plan => plan.type === 'SIP'), // Fixed: was smartSIPRecommendations
};

// ===================================
// Settings Mock Data
// ===================================
export const mockSettings = {
  profile: settingsData.userProfile,
  preferences: settingsData.preferenceSettings,
  connectedAccounts: settingsData.connectedPlatforms,
  notifications: settingsData.notificationSettings,
};

// ===================================
// Helper Functions for Mock Data
// ===================================

// Simulate API delay (realistic loading experience)
export const simulateDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Generate random success/error responses
export const mockResponse = async (data, successRate = 0.95) => {
  await simulateDelay();

  if (Math.random() < successRate) {
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  } else {
    throw new Error('Mock API Error: Service temporarily unavailable');
  }
};

// Mock WebSocket updates
export const generateMockMarketUpdate = () => {
  const change = (Math.random() - 0.5) * 2; // -1 to +1
  return {
    symbol: ['NIFTY', 'SENSEX', 'BANKNIFTY'][Math.floor(Math.random() * 3)],
    price: 18000 + Math.random() * 2000,
    change: change,
    changePercent: change / 100,
    timestamp: new Date().toISOString(),
  };
};

// Export all for backward compatibility
export {
  dummyData,
  investmentData,
  aiAnalysisData,
  portfolioData,
  marketData,
  liveMarketData,
  transactionData,
  autoInvestData,
  settingsData,
};
