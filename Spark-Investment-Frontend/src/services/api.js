// ===================================
// API Service Layer with MOCK_MODE Support
// ===================================
import axios from 'axios';
import {
  mockPortfolio,
  mockInvestments,
  mockMarketData,
  mockAIAnalysis,
  mockTransactions,
  mockAutoInvest,
  mockSettings,
  simulateDelay,
  mockResponse,
} from '../data/mockData';

// ===================================
// Configuration
// ===================================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const MOCK_MODE = import.meta.env.VITE_MOCK_MODE === 'true';
const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === 'true';

// Always log API configuration on startup
console.log('🔧 API Configuration:');
console.log('   MOCK_MODE:', MOCK_MODE ? '✅ ENABLED' : '❌ DISABLED');
console.log('   VITE_MOCK_MODE env:', import.meta.env.VITE_MOCK_MODE);
console.log('   Base URL:', API_BASE_URL);
console.log('   WebSocket:', import.meta.env.VITE_WEBSOCKET_URL);

// Axios instance with interceptors
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add auth tokens, logging)
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (DEBUG_MODE) {
      console.log('📤 API Request:', config.method.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor (error handling, logging)
apiClient.interceptors.response.use(
  (response) => {
    if (DEBUG_MODE) {
      console.log('📥 API Response:', response.config.url, response.data);
    }
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.message);

    // Handle specific error codes
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// ===================================
// Portfolio API
// ===================================
export const portfolioAPI = {
  // Get portfolio summary
  getSummary: async () => {
    console.log('🔍 getSummary - MOCK_MODE:', MOCK_MODE, '| env value:', import.meta.env.VITE_MOCK_MODE);
    if (MOCK_MODE) {
      console.log('✅ Using Mock Data - GET /api/portfolio/summary');
      await simulateDelay(300);
      return mockResponse(mockPortfolio.summary);
    }
    console.log('🌐 Calling Real API - GET /api/portfolio/summary');
    const response = await apiClient.get('/portfolio/summary');
    return response.data;
  },

  // Get connected platforms
  getPlatforms: async () => {
    console.log('🔍 getPlatforms - MOCK_MODE:', MOCK_MODE);
    if (MOCK_MODE) {
      console.log('✅ Using Mock Data - GET /api/portfolio/platforms');
      await simulateDelay(300);
      return mockResponse(mockPortfolio.platforms);
    }
    console.log('🌐 Calling Real API - GET /api/portfolio/platforms');
    const response = await apiClient.get('/portfolio/platforms');
    return response.data;
  },

  // Get performance data
  getPerformance: async (period = '1M') => {
    if (MOCK_MODE) {
      await simulateDelay(400);
      return mockResponse(mockPortfolio.performance);
    }
    const response = await apiClient.get(`/portfolio/performance?period=${period}`);
    return response.data;
  },

  // Get asset allocation
  getAllocation: async () => {
    if (MOCK_MODE) {
      await simulateDelay(300);
      return mockResponse(mockPortfolio.allocation);
    }
    const response = await apiClient.get('/portfolio/allocation');
    return response.data;
  },

  // Get top performers
  getTopPerformers: async () => {
    if (MOCK_MODE) {
      await simulateDelay(350);
      return mockResponse(mockPortfolio.topPerformers);
    }
    const response = await apiClient.get('/portfolio/top-performers');
    return response.data;
  },

  // Get recent activity
  getRecentActivity: async (limit = 10) => {
    if (MOCK_MODE) {
      await simulateDelay(250);
      return mockResponse(mockPortfolio.recentActivity.slice(0, limit));
    }
    const response = await apiClient.get(`/portfolio/activity?limit=${limit}`);
    return response.data;
  },

  // Connect new platform
  connectPlatform: async (platform, credentials) => {
    if (MOCK_MODE) {
      await simulateDelay(1500);
      return mockResponse({ success: true, message: 'Platform connected successfully' });
    }
    const response = await apiClient.post('/portfolio/connect', { platform, credentials });
    return response.data;
  },

  // Disconnect platform
  disconnectPlatform: async (platformId) => {
    if (MOCK_MODE) {
      await simulateDelay(800);
      return mockResponse({ success: true, message: 'Platform disconnected' });
    }
    const response = await apiClient.delete(`/portfolio/platforms/${platformId}`);
    return response.data;
  },
};

// ===================================
// Investments API
// ===================================
export const investmentsAPI = {
  // Get all investments
  getAll: async () => {
    if (MOCK_MODE) {
      await simulateDelay(400);
      return mockResponse(mockInvestments);
    }
    const response = await apiClient.get('/investments');
    return response.data;
  },

  // Get investment by ID
  getById: async (id) => {
    if (MOCK_MODE) {
      await simulateDelay(300);
      const allHoldings = [
        ...mockInvestments.mutualFunds,
        ...mockInvestments.stocks,
        ...mockInvestments.crypto,
      ];
      const investment = allHoldings.find((h) => h.id === id);
      return mockResponse(investment);
    }
    const response = await apiClient.get(`/investments/${id}`);
    return response.data;
  },

  // Get mutual funds
  getMutualFunds: async () => {
    if (MOCK_MODE) {
      await simulateDelay(350);
      return mockResponse(mockInvestments.mutualFunds);
    }
    const response = await apiClient.get('/investments/mutual-funds');
    return response.data;
  },

  // Get stocks
  getStocks: async () => {
    if (MOCK_MODE) {
      await simulateDelay(350);
      return mockResponse(mockInvestments.stocks);
    }
    const response = await apiClient.get('/investments/stocks');
    return response.data;
  },

  // Get crypto
  getCrypto: async () => {
    if (MOCK_MODE) {
      await simulateDelay(350);
      return mockResponse(mockInvestments.crypto);
    }
    const response = await apiClient.get('/investments/crypto');
    return response.data;
  },

  // Add new investment
  add: async (investment) => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse({ success: true, id: Math.random().toString(36).substr(2, 9) });
    }
    const response = await apiClient.post('/investments', investment);
    return response.data;
  },

  // Update investment
  update: async (id, updates) => {
    if (MOCK_MODE) {
      await simulateDelay(800);
      return mockResponse({ success: true, message: 'Investment updated' });
    }
    const response = await apiClient.put(`/investments/${id}`, updates);
    return response.data;
  },

  // Delete investment
  delete: async (id) => {
    if (MOCK_MODE) {
      await simulateDelay(600);
      return mockResponse({ success: true, message: 'Investment deleted' });
    }
    const response = await apiClient.delete(`/investments/${id}`);
    return response.data;
  },
};

// ===================================
// Market Data API
// ===================================
export const marketDataAPI = {
  // Get market indices
  getIndices: async () => {
    if (MOCK_MODE) {
      await simulateDelay(200);
      return mockResponse(mockMarketData.indices);
    }
    const response = await apiClient.get('/market/indices');
    return response.data;
  },

  // Get top gainers
  getTopGainers: async (limit = 10) => {
    if (MOCK_MODE) {
      await simulateDelay(300);
      return mockResponse(mockMarketData.topGainers.slice(0, limit));
    }
    const response = await apiClient.get(`/market/gainers?limit=${limit}`);
    return response.data;
  },

  // Get top losers
  getTopLosers: async (limit = 10) => {
    if (MOCK_MODE) {
      await simulateDelay(300);
      return mockResponse(mockMarketData.topLosers.slice(0, limit));
    }
    const response = await apiClient.get(`/market/losers?limit=${limit}`);
    return response.data;
  },

  // Get sector performance
  getSectorPerformance: async () => {
    if (MOCK_MODE) {
      await simulateDelay(350);
      return mockResponse(mockMarketData.sectorPerformance);
    }
    const response = await apiClient.get('/market/sectors');
    return response.data;
  },

  // Get stock quote
  getQuote: async (symbol) => {
    if (MOCK_MODE) {
      await simulateDelay(250);
      return mockResponse({
        symbol,
        price: 1500 + Math.random() * 500,
        change: Math.random() * 100 - 50,
        changePercent: (Math.random() - 0.5) * 10,
        volume: Math.floor(Math.random() * 1000000),
        timestamp: new Date().toISOString(),
      });
    }
    const response = await apiClient.get(`/market/quote/${symbol}`);
    return response.data;
  },

  // Get crypto market data
  getCryptoMarket: async () => {
    if (MOCK_MODE) {
      await simulateDelay(350);
      return mockResponse(mockMarketData.cryptoMarket);
    }
    const response = await apiClient.get('/market/crypto');
    return response.data;
  },

  // Get forex rates
  getForexRates: async () => {
    if (MOCK_MODE) {
      await simulateDelay(300);
      return mockResponse(mockMarketData.forexRates);
    }
    const response = await apiClient.get('/market/forex');
    return response.data;
  },
};

// ===================================
// AI Analysis API
// ===================================
export const aiAPI = {
  // Get portfolio insights
  getPortfolioInsights: async () => {
    if (MOCK_MODE) {
      await simulateDelay(800);
      return mockResponse(mockAIAnalysis.portfolioInsights);
    }
    const response = await apiClient.get('/ai/insights');
    return response.data;
  },

  // Get recommendations
  getRecommendations: async () => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse(mockAIAnalysis.recommendations);
    }
    const response = await apiClient.get('/ai/recommendations');
    return response.data;
  },

  // Get risk analysis
  getRiskAnalysis: async () => {
    if (MOCK_MODE) {
      await simulateDelay(900);
      return mockResponse(mockAIAnalysis.riskAnalysis);
    }
    const response = await apiClient.get('/ai/risk-analysis');
    return response.data;
  },

  // Get market sentiment
  getMarketSentiment: async () => {
    if (MOCK_MODE) {
      await simulateDelay(600);
      return mockResponse(mockAIAnalysis.marketSentiment);
    }
    const response = await apiClient.get('/ai/market-sentiment');
    return response.data;
  },

  // Chat with AI
  chat: async (message) => {
    if (MOCK_MODE) {
      await simulateDelay(1200);
      return mockResponse({
        message: `AI Response to: "${message}"`,
        timestamp: new Date().toISOString(),
        suggestions: ['Learn more about diversification', 'Check risk analysis'],
      });
    }
    const response = await apiClient.post('/ai/chat', { message });
    return response.data;
  },

  // Get quick insights
  getQuickInsights: async () => {
    if (MOCK_MODE) {
      await simulateDelay(500);
      return mockResponse(mockAIAnalysis.quickInsights);
    }
    const response = await apiClient.get('/ai/quick-insights');
    return response.data;
  },

  // Get investment-specific AI analysis
  getInvestmentAnalysis: async (investmentId) => {
    if (MOCK_MODE) {
      await simulateDelay(700);
      // Import aiAnalysisData to get per-investment analysis
      const { aiAnalysisData } = await import('../data/aiAnalysisData.js');
      const investmentAnalysis = aiAnalysisData[investmentId];

      if (!investmentAnalysis) {
        // Return default analysis if investment not found
        return mockResponse({
          investmentId,
          recommendation: 'HOLD',
          confidence: 75,
          riskLevel: 'MEDIUM',
          riskScore: 55,
          volatility: 'Moderate',
          healthScore: 70,
          healthGrade: 'B',
          valuation: 'Fair Value',
          pros: ['No specific analysis available'],
          cons: ['Limited data for this investment'],
          aiExplanation: 'Detailed analysis for this investment is being generated.',
        });
      }

      return mockResponse(investmentAnalysis);
    }
    const response = await apiClient.get(`/ai/investments/${investmentId}/analysis`);
    return response.data;
  },
};

// ===================================
// Trading API
// ===================================
export const tradingAPI = {
  // Execute trade
  executeTrade: async (tradeData) => {
    if (MOCK_MODE) {
      await simulateDelay(1500);
      return mockResponse({
        success: true,
        orderId: `ORD${Date.now()}`,
        status: 'pending',
        message: 'Trade order placed successfully',
      });
    }
    const response = await apiClient.post('/trading/execute', tradeData);
    return response.data;
  },

  // Get trade history
  getTradeHistory: async (limit = 50) => {
    if (MOCK_MODE) {
      await simulateDelay(400);
      return mockResponse(mockTransactions.transactions.slice(0, limit));
    }
    const response = await apiClient.get(`/trading/history?limit=${limit}`);
    return response.data;
  },

  // Get pending orders
  getPendingOrders: async () => {
    if (MOCK_MODE) {
      await simulateDelay(350);
      return mockResponse([]);
    }
    const response = await apiClient.get('/trading/pending');
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    if (MOCK_MODE) {
      await simulateDelay(800);
      return mockResponse({ success: true, message: 'Order cancelled' });
    }
    const response = await apiClient.delete(`/trading/orders/${orderId}`);
    return response.data;
  },
};

// ===================================
// Transactions API
// ===================================
export const transactionsAPI = {
  // Get all transactions
  getAll: async (filters = {}) => {
    if (MOCK_MODE) {
      await simulateDelay(400);
      return mockResponse(mockTransactions.transactions);
    }
    const response = await apiClient.get('/transactions', { params: filters });
    return response.data;
  },

  // Get transaction summary
  getSummary: async (period = '1M') => {
    if (MOCK_MODE) {
      await simulateDelay(350);
      return mockResponse(mockTransactions.summary);
    }
    const response = await apiClient.get(`/transactions/summary?period=${period}`);
    return response.data;
  },

  // Export transactions
  export: async (format = 'csv', filters = {}) => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse({ downloadUrl: '#', message: 'Export ready' });
    }
    const response = await apiClient.get(`/transactions/export?format=${format}`, {
      params: filters,
    });
    return response.data;
  },
};

// ===================================
// Auto-Invest API
// ===================================
export const autoInvestAPI = {
  // Get strategies
  getStrategies: async () => {
    if (MOCK_MODE) {
      await simulateDelay(400);
      return mockResponse(mockAutoInvest.strategies);
    }
    const response = await apiClient.get('/auto-invest/strategies');
    return response.data;
  },

  // Create strategy
  createStrategy: async (strategyData) => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse({
        success: true,
        id: `STRAT${Date.now()}`,
        message: 'Strategy created successfully',
      });
    }
    const response = await apiClient.post('/auto-invest/strategies', strategyData);
    return response.data;
  },

  // Update strategy
  updateStrategy: async (id, updates) => {
    if (MOCK_MODE) {
      await simulateDelay(800);
      return mockResponse({ success: true, message: 'Strategy updated' });
    }
    const response = await apiClient.put(`/auto-invest/strategies/${id}`, updates);
    return response.data;
  },

  // Delete strategy
  deleteStrategy: async (id) => {
    if (MOCK_MODE) {
      await simulateDelay(600);
      return mockResponse({ success: true, message: 'Strategy deleted' });
    }
    const response = await apiClient.delete(`/auto-invest/strategies/${id}`);
    return response.data;
  },

  // Get backtest results
  getBacktestResults: async (strategyId) => {
    if (MOCK_MODE) {
      await simulateDelay(1200);
      return mockResponse(mockAutoInvest.backtestResults);
    }
    const response = await apiClient.get(`/auto-invest/backtest/${strategyId}`);
    return response.data;
  },

  // Get SIP recommendations
  getSIPRecommendations: async () => {
    if (MOCK_MODE) {
      await simulateDelay(800);
      return mockResponse(mockAutoInvest.sipRecommendations);
    }
    const response = await apiClient.get('/auto-invest/sip-recommendations');
    return response.data;
  },
};

// ===================================
// Settings API
// ===================================
export const settingsAPI = {
  // Get user profile
  getProfile: async () => {
    if (MOCK_MODE) {
      await simulateDelay(300);
      return mockResponse(mockSettings.profile);
    }
    const response = await apiClient.get('/settings/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (updates) => {
    if (MOCK_MODE) {
      await simulateDelay(800);
      return mockResponse({ success: true, message: 'Profile updated' });
    }
    const response = await apiClient.put('/settings/profile', updates);
    return response.data;
  },

  // Get preferences
  getPreferences: async () => {
    if (MOCK_MODE) {
      await simulateDelay(250);
      return mockResponse(mockSettings.preferences);
    }
    const response = await apiClient.get('/settings/preferences');
    return response.data;
  },

  // Update preferences
  updatePreferences: async (updates) => {
    if (MOCK_MODE) {
      await simulateDelay(600);
      return mockResponse({ success: true, message: 'Preferences updated' });
    }
    const response = await apiClient.put('/settings/preferences', updates);
    return response.data;
  },

  // Get connected accounts
  getConnectedAccounts: async () => {
    if (MOCK_MODE) {
      await simulateDelay(300);
      return mockResponse(mockSettings.connectedAccounts);
    }
    const response = await apiClient.get('/settings/accounts');
    return response.data;
  },

  // Get notification settings
  getNotifications: async () => {
    if (MOCK_MODE) {
      await simulateDelay(250);
      return mockResponse(mockSettings.notifications);
    }
    const response = await apiClient.get('/settings/notifications');
    return response.data;
  },

  // Update notification settings
  updateNotifications: async (updates) => {
    if (MOCK_MODE) {
      await simulateDelay(600);
      return mockResponse({ success: true, message: 'Notifications updated' });
    }
    const response = await apiClient.put('/settings/notifications', updates);
    return response.data;
  },
};

// ===================================
// Export all APIs
// ===================================
export default {
  portfolio: portfolioAPI,
  investments: investmentsAPI,
  market: marketDataAPI,
  ai: aiAPI,
  trading: tradingAPI,
  transactions: transactionsAPI,
  autoInvest: autoInvestAPI,
  settings: settingsAPI,
};

// Log MOCK_MODE status
if (DEBUG_MODE) {
  console.log(`🔧 API Service initialized - MOCK_MODE: ${MOCK_MODE ? '✅ ENABLED' : '❌ DISABLED'}`);
  console.log(`🌐 API Base URL: ${API_BASE_URL}`);
}
