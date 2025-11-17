// ===================================
// API Service Layer with MOCK_MODE Support
// ===================================
import axios from "axios";
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
} from "../data/mockData";

// ===================================
// Configuration
// ===================================
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const MOCK_MODE = import.meta.env.VITE_MOCK_MODE === "true";
const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === "true";

// Always log API configuration on startup
console.log("🔧 API Configuration:");
console.log("   MOCK_MODE:", MOCK_MODE ? "✅ ENABLED" : "❌ DISABLED");
console.log("   VITE_MOCK_MODE env:", import.meta.env.VITE_MOCK_MODE);
console.log("   Base URL:", API_BASE_URL);
console.log("   WebSocket:", import.meta.env.VITE_WEBSOCKET_URL);

// Axios instance with interceptors
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple redirects
let isRedirecting = false;

// ===================================
// Authentication API
// ===================================
export const authAPI = {
  // Signup
  signup: async (userData) => {
    if (MOCK_MODE) {
      await simulateDelay(1500);
      return mockResponse({
        success: true,
        data: {
          user: { id: "mock_id", email: userData.email, name: userData.name },
          token: "mock_token",
          refreshToken: "mock_refresh_token",
        },
      });
    }
    const response = await apiClient.post("/auth/signup", userData);
    return response.data;
  },

  // Login
  login: async (email, password, rememberMe) => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse({
        success: true,
        data: {
          user: { id: "mock_id", email, name: email.split("@")[0] },
          token: "mock_token",
          refreshToken: "mock_refresh_token",
        },
      });
    }
    const response = await apiClient.post("/auth/login", {
      email,
      password,
      rememberMe,
    });
    return response.data;
  },

  // Logout
  logout: async () => {
    if (MOCK_MODE) {
      await simulateDelay(500);
      return mockResponse({
        success: true,
        message: "Logged out successfully",
      });
    }
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },

  // Refresh Token
  refreshToken: async (refreshToken) => {
    if (MOCK_MODE) {
      await simulateDelay(500);
      return mockResponse({
        success: true,
        data: {
          token: "new_mock_token",
          refreshToken: "new_mock_refresh_token",
        },
      });
    }
    const response = await apiClient.post(
      "/auth/refresh",
      {},
      {
        headers: { Authorization: `Bearer ${refreshToken}` },
      }
    );
    return response.data;
  },

  // Forgot Password
  forgotPassword: async (email) => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse({
        success: true,
        message: "OTP sent to registered email and phone",
        data: { otpSentTo: `em***@example.com`, expiresIn: 600 },
      });
    }
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  },

  // Reset Password
  resetPassword: async (email, otp, newPassword) => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse({
        success: true,
        message: "Password reset successfully",
      });
    }
    const response = await apiClient.post("/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
    return response.data;
  },
};

// Request interceptor (add auth tokens, logging)
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("spark_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (DEBUG_MODE) {
      console.log("📤 API Request:", config.method.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor (error handling, logging)
apiClient.interceptors.response.use(
  (response) => {
    if (DEBUG_MODE) {
      console.log("📥 API Response:", response.config.url, response.data);
    }
    return response;
  },
  (error) => {
    console.error("❌ Response Error:", error.response?.status, error.message);

    // Handle specific error codes
    if (error.response?.status === 401 && !isRedirecting) {
      // Unauthorized - redirect to login
      isRedirecting = true;
      localStorage.removeItem("spark_access_token");
      localStorage.removeItem("spark_refresh_token");

      // Use setTimeout to ensure redirect happens after error is returned
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
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
    if (DEBUG_MODE) {
      console.log("🔍 getSummary - MOCK_MODE:", MOCK_MODE);
    }
    if (MOCK_MODE) {
      await simulateDelay(800);
      return mockResponse(mockPortfolio.summary);
    }
    const response = await apiClient.get("/portfolio/summary");
    return response.data;
  },

  // Get connected platforms
  getPlatforms: async () => {
    if (DEBUG_MODE) {
      console.log("🔍 getPlatforms - MOCK_MODE:", MOCK_MODE);
    }
    if (MOCK_MODE) {
      await simulateDelay(800);
      return mockResponse(mockPortfolio.platforms);
    }
    const response = await apiClient.get("/portfolio/platforms");
    return response.data;
  },

  // Get performance data
  getPerformance: async (period = "1M") => {
    if (MOCK_MODE) {
      await simulateDelay(800);
      return mockResponse(mockPortfolio.performance);
    }
    const response = await apiClient.get(
      `/portfolio/performance?period=${period}`
    );
    return response.data;
  },

  // Get asset allocation
  getAllocation: async () => {
    if (MOCK_MODE) {
      await simulateDelay(800);
      return mockResponse(mockPortfolio.allocation);
    }
    const response = await apiClient.get("/portfolio/allocation");
    return response.data;
  },

  // Get top performers
  getTopPerformers: async () => {
    if (MOCK_MODE) {
      await simulateDelay(800);
      return mockResponse(mockPortfolio.topPerformers);
    }
    const response = await apiClient.get("/portfolio/top-performers");
    return response.data;
  },

  // Get recent activity
  getRecentActivity: async (limit = 10) => {
    if (MOCK_MODE) {
      await simulateDelay(800);
      return mockResponse(mockPortfolio.recentActivity.slice(0, limit));
    }
    const response = await apiClient.get(`/portfolio/activity?limit=${limit}`);
    return response.data;
  },

  // Connect new platform
  connectPlatform: async (platform, credentials) => {
    if (MOCK_MODE) {
      await simulateDelay(1500);
      return mockResponse({
        success: true,
        message: "Platform connected successfully",
      });
    }
    // Changed path to match API contract
    const response = await apiClient.post("/portfolio/platforms/connect", {
      platform,
      apiKey: credentials.apiKey,
      apiSecret: credentials.apiSecret,
      additionalAuth: credentials.additionalAuth,
    });
    return response.data;
  },

  // Disconnect platform
  disconnectPlatform: async (platformId) => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse({ success: true, message: "Platform disconnected" });
    }
    const response = await apiClient.delete(
      `/platforms/connect/${platformId}`
    );
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
      await simulateDelay(800);
      return mockResponse(mockInvestments);
    }
    const response = await apiClient.get("/investments");
    return response.data;
  },

  // Get investment by ID
  getById: async (id) => {
    if (MOCK_MODE) {
      await simulateDelay(800);
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
    const response = await apiClient.get("/investments?type=mutual_fund");
    return response.data;
  },

  // Get stocks
  getStocks: async () => {
    if (MOCK_MODE) {
      await simulateDelay(350);
      return mockResponse(mockInvestments.stocks);
    }
    const response = await apiClient.get("/investments?type=stock");
    return response.data;
  },

  // Get crypto
  getCrypto: async () => {
    if (MOCK_MODE) {
      await simulateDelay(350);
      return mockResponse(mockInvestments.crypto);
    }
    const response = await apiClient.get("/investments?type=crypto");
    return response.data;
  },

  // Add new investment
  add: async (investment) => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse({
        success: true,
        id: Math.random().toString(36).substr(2, 9),
      });
    }
    const response = await apiClient.post("/investments", investment);
    return response.data;
  },

  // Update investment
  update: async (id, updates) => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse({ success: true, message: "Investment updated" });
    }
    const response = await apiClient.put(`/investments/${id}`, updates);
    return response.data;
  },

  // Delete investment
  delete: async (id) => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse({ success: true, message: "Investment deleted" });
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
      await simulateDelay(800);
      return mockResponse(mockMarketData.indices);
    }
    const response = await apiClient.get("/market/indices");
    return response.data;
  },

  // Get top gainers
  getTopGainers: async (limit = 10) => {
    if (MOCK_MODE) {
      await simulateDelay(800);
      return mockResponse(mockMarketData.topGainers.slice(0, limit));
    }
    const response = await apiClient.get(`/market/gainers?limit=${limit}`);
    return response.data;
  },

  // Get top losers
  getTopLosers: async (limit = 10) => {
    if (MOCK_MODE) {
      await simulateDelay(800);
      return mockResponse(mockMarketData.topLosers.slice(0, limit));
    }
    const response = await apiClient.get(`/market/losers?limit=${limit}`);
    return response.data;
  },

  // Get sector performance
  getSectorPerformance: async () => {
    if (MOCK_MODE) {
      await simulateDelay(800);
      return mockResponse(mockMarketData.sectorPerformance);
    }
    const response = await apiClient.get("/market/sectors");
    return response.data;
  },

  // Get stock quote
  getQuote: async (symbol) => {
    if (MOCK_MODE) {
      await simulateDelay(800);
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
      await simulateDelay(800);
      return mockResponse(mockMarketData.cryptoMarket);
    }
    const response = await apiClient.get("/market/crypto");
    return response.data;
  },

  // Get forex rates
  getForexRates: async () => {
    if (MOCK_MODE) {
      await simulateDelay(800);
      return mockResponse(mockMarketData.forexRates);
    }
    const response = await apiClient.get("/market/forex");
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
      await simulateDelay(1000);
      return mockResponse(mockAIAnalysis.portfolioInsights);
    }
    const response = await apiClient.get("/ai/insights");
    return response.data;
  },

  // Get recommendations
  getRecommendations: async () => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse(mockAIAnalysis.recommendations);
    }
    const response = await apiClient.get("/ai/recommendations");
    return response.data;
  },

  // Get risk analysis
  getRiskAnalysis: async () => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse(mockAIAnalysis.riskAnalysis);
    }
    const response = await apiClient.get("/ai/risk-analysis");
    return response.data;
  },

  // Get market sentiment
  getMarketSentiment: async () => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse(mockAIAnalysis.marketSentiment);
    }
    const response = await apiClient.get("/ai/market-sentiment");
    return response.data;
  },

  // Chat with AI
  chat: async (message) => {
    if (MOCK_MODE) {
      await simulateDelay(1200);
      return mockResponse({
        message: `AI Response to: "${message}"`,
        timestamp: new Date().toISOString(),
        suggestions: [
          "Learn more about diversification",
          "Check risk analysis",
        ],
      });
    }
    const response = await apiClient.post("/ai/chat", { message });
    return response.data;
  },

  // Get quick insights
  getQuickInsights: async () => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse(mockAIAnalysis.quickInsights);
    }
    const response = await apiClient.get("/ai/quick-insights");
    return response.data;
  },

  // Get investment-specific AI analysis
  getInvestmentAnalysis: async (investmentId) => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      try {
        // Import aiAnalysisData to get per-investment analysis
        const { aiAnalysisData } = await import("../data/aiAnalysisData.js");
        const investmentAnalysis = aiAnalysisData[investmentId];

        if (!investmentAnalysis) {
          // Return default analysis if investment not found
          return mockResponse({
            investmentId,
            recommendation: "HOLD",
            confidence: 75,
            riskLevel: "MEDIUM",
            riskScore: 55,
            volatility: "Moderate",
            healthScore: 70,
            healthGrade: "B",
            valuation: "Fair Value",
            pros: ["No specific analysis available"],
            cons: ["Limited data for this investment"],
            aiExplanation:
              "Detailed analysis for this investment is being generated.",
          });
        }

        return mockResponse(investmentAnalysis);
      } catch (error) {
        console.error("Error loading AI analysis data:", error);
        return mockResponse({
          investmentId,
          recommendation: "HOLD",
          confidence: 75,
          riskLevel: "MEDIUM",
          riskScore: 55,
          volatility: "Moderate",
          healthScore: 70,
          healthGrade: "B",
          valuation: "Fair Value",
          pros: ["Analysis data unavailable"],
          cons: ["Unable to load detailed analysis"],
          aiExplanation: "Analysis data could not be loaded at this time.",
        });
      }
    }
    const response = await apiClient.get(
      `/ai/investments/${investmentId}/analysis`
    );
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
        status: "pending",
        message: "Trade order placed successfully",
      });
    }
    const response = await apiClient.post("/trading/execute", tradeData);
    return response.data;
  },

  // Get trade history
  getTradeHistory: async (limit = 50) => {
    if (MOCK_MODE) {
      await simulateDelay(800);
      return mockResponse(mockTransactions.transactions.slice(0, limit));
    }
    const response = await apiClient.get(`/trading/history?limit=${limit}`);
    return response.data;
  },

  // Get pending orders
  getPendingOrders: async () => {
    if (MOCK_MODE) {
      await simulateDelay(800);
      return mockResponse([]);
    }
    const response = await apiClient.get("/trading/pending");
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse({ success: true, message: "Order cancelled" });
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
      await simulateDelay(800);
      return mockResponse(mockTransactions.transactions);
    }
    const response = await apiClient.get("/transactions", { params: filters });
    return response.data;
  },

  // Get transaction summary
  getSummary: async (period = "1M") => {
    if (MOCK_MODE) {
      await simulateDelay(800);
      return mockResponse(mockTransactions.summary);
    }
    const response = await apiClient.get(
      `/transactions/summary?period=${period}`
    );
    return response.data;
  },

  // Export transactions
  export: async (format = "csv", filters = {}) => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse({ downloadUrl: "#", message: "Export ready" });
    }
    const response = await apiClient.get(
      `/transactions/export?format=${format}`,
      {
        params: filters,
      }
    );
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
      await simulateDelay(800);
      return mockResponse(mockAutoInvest.strategies);
    }
    const response = await apiClient.get("/auto-invest/strategies");
    return response.data;
  },

  // Create strategy
  createStrategy: async (strategyData) => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse({
        success: true,
        id: `STRAT${Date.now()}`,
        message: "Strategy created successfully",
      });
    }
    const response = await apiClient.post(
      "/auto-invest/strategies",
      strategyData
    );
    return response.data;
  },

  // Update strategy
  updateStrategy: async (id, updates) => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse({ success: true, message: "Strategy updated" });
    }
    const response = await apiClient.put(
      `/auto-invest/strategies/${id}`,
      updates
    );
    return response.data;
  },

  // Delete strategy
  deleteStrategy: async (id) => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse({ success: true, message: "Strategy deleted" });
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
      await simulateDelay(1000);
      return mockResponse(mockAutoInvest.sipRecommendations);
    }
    const response = await apiClient.get("/auto-invest/sip-recommendations");
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
      await simulateDelay(800);
      return mockResponse(mockSettings.profile);
    }
    const response = await apiClient.get("/settings/profile");
    return response.data;
  },

  // Update profile
  updateProfile: async (updates) => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse({ success: true, message: "Profile updated" });
    }
    const response = await apiClient.put("/settings/profile", updates);
    return response.data;
  },

  // Get preferences
  getPreferences: async () => {
    if (MOCK_MODE) {
      await simulateDelay(800);
      return mockResponse(mockSettings.preferences);
    }
    const response = await apiClient.get("/settings/preferences");
    return response.data;
  },

  // Update preferences
  updatePreferences: async (updates) => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse({ success: true, message: "Preferences updated" });
    }
    const response = await apiClient.put("/settings/preferences", updates);
    return response.data;
  },

  // Get connected accounts
  getConnectedAccounts: async () => {
    if (MOCK_MODE) {
      await simulateDelay(800);
      return mockResponse(mockSettings.connectedAccounts);
    }
    const response = await apiClient.get("/settings/accounts");
    return response.data;
  },

  // Get notification settings
  getNotifications: async () => {
    if (MOCK_MODE) {
      await simulateDelay(800);
      return mockResponse(mockSettings.notifications);
    }
    const response = await apiClient.get("/settings/notifications");
    return response.data;
  },

  // Update notification settings
  updateNotifications: async (updates) => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse({ success: true, message: "Notifications updated" });
    }
    const response = await apiClient.put("/settings/notifications", updates);
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
  console.log(
    `🔧 API Service initialized - MOCK_MODE: ${
      MOCK_MODE ? "✅ ENABLED" : "❌ DISABLED"
    }`
  );
  console.log(`🌐 API Base URL: ${API_BASE_URL}`);
}
