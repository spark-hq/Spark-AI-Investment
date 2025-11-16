// ===================================
// Zustand Global State Store
// ===================================
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// ===================================
// Main Store
// ===================================
const useStore = create(
  devtools(
    persist(
      (set, get) => ({
        // ===================================
        // User State
        // ===================================
        user: null,
        isAuthenticated: false,

        setUser: (user) => set({ user, isAuthenticated: !!user }),
        logout: () => set({ user: null, isAuthenticated: false }),

        // ===================================
        // Portfolio State
        // ===================================
        portfolio: null,
        portfolioSummary: null,
        connectedPlatforms: [],

        setPortfolio: (portfolio) => set({ portfolio }),
        setPortfolioSummary: (summary) => set({ portfolioSummary: summary }),
        setConnectedPlatforms: (platforms) => set({ connectedPlatforms: platforms }),

        updatePortfolio: (updates) => set((state) => ({
          portfolio: { ...state.portfolio, ...updates }
        })),

        // ===================================
        // Market Data State
        // ===================================
        marketData: {
          indices: [],
          topGainers: [],
          topLosers: [],
          sectorPerformance: [],
        },

        setMarketData: (data) => set({ marketData: data }),

        updateMarketIndex: (symbol, updates) => set((state) => ({
          marketData: {
            ...state.marketData,
            indices: state.marketData.indices.map((index) =>
              index.symbol === symbol ? { ...index, ...updates } : index
            ),
          },
        })),

        // ===================================
        // Investments State
        // ===================================
        investments: {
          mutualFunds: [],
          stocks: [],
          crypto: [],
        },

        setInvestments: (investments) => set({ investments }),

        addInvestment: (type, investment) => set((state) => ({
          investments: {
            ...state.investments,
            [type]: [...state.investments[type], investment],
          },
        })),

        updateInvestment: (type, id, updates) => set((state) => ({
          investments: {
            ...state.investments,
            [type]: state.investments[type].map((inv) =>
              inv.id === id ? { ...inv, ...updates } : inv
            ),
          },
        })),

        removeInvestment: (type, id) => set((state) => ({
          investments: {
            ...state.investments,
            [type]: state.investments[type].filter((inv) => inv.id !== id),
          },
        })),

        // ===================================
        // AI Analysis State
        // ===================================
        aiInsights: null,
        aiRecommendations: [],
        riskAnalysis: null,

        setAIInsights: (insights) => set({ aiInsights: insights }),
        setAIRecommendations: (recommendations) => set({ aiRecommendations: recommendations }),
        setRiskAnalysis: (analysis) => set({ riskAnalysis: analysis }),

        // ===================================
        // Trading State
        // ===================================
        pendingOrders: [],
        tradeHistory: [],

        setPendingOrders: (orders) => set({ pendingOrders: orders }),
        setTradeHistory: (history) => set({ tradeHistory: history }),

        addPendingOrder: (order) => set((state) => ({
          pendingOrders: [...state.pendingOrders, order],
        })),

        removePendingOrder: (orderId) => set((state) => ({
          pendingOrders: state.pendingOrders.filter((order) => order.id !== orderId),
        })),

        // ===================================
        // Transactions State
        // ===================================
        transactions: [],
        transactionSummary: null,

        setTransactions: (transactions) => set({ transactions }),
        setTransactionSummary: (summary) => set({ transactionSummary: summary }),

        addTransaction: (transaction) => set((state) => ({
          transactions: [transaction, ...state.transactions],
        })),

        // ===================================
        // Auto-Invest State
        // ===================================
        autoInvestStrategies: [],
        activeStrategies: [],

        setAutoInvestStrategies: (strategies) => set({ autoInvestStrategies: strategies }),

        addStrategy: (strategy) => set((state) => ({
          autoInvestStrategies: [...state.autoInvestStrategies, strategy],
        })),

        updateStrategy: (id, updates) => set((state) => ({
          autoInvestStrategies: state.autoInvestStrategies.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

        removeStrategy: (id) => set((state) => ({
          autoInvestStrategies: state.autoInvestStrategies.filter((s) => s.id !== id),
        })),

        toggleStrategy: (id) => set((state) => ({
          autoInvestStrategies: state.autoInvestStrategies.map((s) =>
            s.id === id ? { ...s, isActive: !s.isActive } : s
          ),
        })),

        // ===================================
        // Settings State
        // ===================================
        settings: {
          theme: 'light',
          currency: 'INR',
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
          trading: {
            confirmBeforeTrade: true,
            maxTradeAmount: 100000,
            paperTradingMode: true,
          },
        },

        setSettings: (settings) => set({ settings }),

        updateSettings: (updates) => set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

        updateNotificationSettings: (updates) => set((state) => ({
          settings: {
            ...state.settings,
            notifications: { ...state.settings.notifications, ...updates },
          },
        })),

        updateTradingSettings: (updates) => set((state) => ({
          settings: {
            ...state.settings,
            trading: { ...state.settings.trading, ...updates },
          },
        })),

        // ===================================
        // UI State
        // ===================================
        ui: {
          isLoading: false,
          isSidebarOpen: true,
          activeModal: null,
          notifications: [],
        },

        setLoading: (isLoading) => set((state) => ({
          ui: { ...state.ui, isLoading },
        })),

        toggleSidebar: () => set((state) => ({
          ui: { ...state.ui, isSidebarOpen: !state.ui.isSidebarOpen },
        })),

        openModal: (modalName) => set((state) => ({
          ui: { ...state.ui, activeModal: modalName },
        })),

        closeModal: () => set((state) => ({
          ui: { ...state.ui, activeModal: null },
        })),

        addNotification: (notification) => set((state) => ({
          ui: {
            ...state.ui,
            notifications: [
              ...state.ui.notifications,
              { ...notification, id: Date.now() },
            ],
          },
        })),

        removeNotification: (id) => set((state) => ({
          ui: {
            ...state.ui,
            notifications: state.ui.notifications.filter((n) => n.id !== id),
          },
        })),

        clearNotifications: () => set((state) => ({
          ui: { ...state.ui, notifications: [] },
        })),

        // ===================================
        // Real-time Updates
        // ===================================
        lastUpdate: null,

        setLastUpdate: () => set({ lastUpdate: new Date().toISOString() }),

        // ===================================
        // Reset Store
        // ===================================
        resetStore: () => set({
          user: null,
          isAuthenticated: false,
          portfolio: null,
          portfolioSummary: null,
          connectedPlatforms: [],
          marketData: {
            indices: [],
            topGainers: [],
            topLosers: [],
            sectorPerformance: [],
          },
          investments: {
            mutualFunds: [],
            stocks: [],
            crypto: [],
          },
          aiInsights: null,
          aiRecommendations: [],
          riskAnalysis: null,
          pendingOrders: [],
          tradeHistory: [],
          transactions: [],
          transactionSummary: null,
          autoInvestStrategies: [],
          lastUpdate: null,
        }),
      }),
      {
        name: 'spark-investment-store',
        partialize: (state) => ({
          // Only persist these fields
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          settings: state.settings,
        }),
      }
    )
  )
);

export default useStore;
