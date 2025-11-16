// ===================================
// useTrading Hook
// ===================================
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tradingAPI, transactionsAPI } from '../services/api';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

// ===================================
// Trade History
// ===================================
export const useTradeHistory = (limit = 50) => {
  const setTradeHistory = useStore((state) => state.setTradeHistory);

  return useQuery({
    queryKey: ['trading', 'history', limit],
    queryFn: async () => {
      const response = await tradingAPI.getTradeHistory(limit);
      setTradeHistory(response.data);
      return response.data;
    },
    staleTime: 60000, // 1 minute
  });
};

// ===================================
// Pending Orders
// ===================================
export const usePendingOrders = () => {
  const setPendingOrders = useStore((state) => state.setPendingOrders);

  return useQuery({
    queryKey: ['trading', 'pending'],
    queryFn: async () => {
      const response = await tradingAPI.getPendingOrders();
      setPendingOrders(response.data);
      return response.data;
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};

// ===================================
// Execute Trade Mutation
// ===================================
export const useExecuteTrade = () => {
  const queryClient = useQueryClient();
  const settings = useStore((state) => state.settings);
  const addPendingOrder = useStore((state) => state.addPendingOrder);

  return useMutation({
    mutationFn: async (tradeData) => {
      // Safety checks
      if (settings.trading.confirmBeforeTrade) {
        const confirmed = window.confirm(
          `Confirm ${tradeData.type.toUpperCase()} order for ${tradeData.symbol}?`
        );
        if (!confirmed) {
          throw new Error('Trade cancelled by user');
        }
      }

      // Check max trade amount
      if (tradeData.amount > settings.trading.maxTradeAmount) {
        throw new Error(
          `Trade amount exceeds maximum limit of ₹${settings.trading.maxTradeAmount}`
        );
      }

      // Check paper trading mode
      if (settings.trading.paperTradingMode) {
        toast.info('📝 Paper Trading Mode: This is a simulated trade');
      }

      return await tradingAPI.executeTrade({
        ...tradeData,
        paperTrade: settings.trading.paperTradingMode,
      });
    },
    onSuccess: (data) => {
      // Add to pending orders
      addPendingOrder({
        id: data.data.orderId,
        status: data.data.status,
        timestamp: new Date().toISOString(),
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['trading', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['trading', 'history'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });

      toast.success('✅ Trade executed successfully!');
    },
    onError: (error) => {
      if (error.message !== 'Trade cancelled by user') {
        toast.error(`❌ Trade failed: ${error.message}`);
      }
    },
  });
};

// ===================================
// Cancel Order Mutation
// ===================================
export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  const removePendingOrder = useStore((state) => state.removePendingOrder);

  return useMutation({
    mutationFn: (orderId) => tradingAPI.cancelOrder(orderId),
    onSuccess: (data, orderId) => {
      removePendingOrder(orderId);
      queryClient.invalidateQueries({ queryKey: ['trading', 'pending'] });
      toast.success('Order cancelled');
    },
    onError: (error) => {
      toast.error(`Failed to cancel order: ${error.message}`);
    },
  });
};

// ===================================
// Transactions
// ===================================
export const useTransactions = (filters = {}) => {
  const setTransactions = useStore((state) => state.setTransactions);

  return useQuery({
    queryKey: ['transactions', 'all', filters],
    queryFn: async () => {
      const response = await transactionsAPI.getAll(filters);
      setTransactions(response.data);
      return response.data;
    },
    staleTime: 60000, // 1 minute
  });
};

// ===================================
// Transaction Summary
// ===================================
export const useTransactionSummary = (period = '1M') => {
  const setTransactionSummary = useStore((state) => state.setTransactionSummary);

  return useQuery({
    queryKey: ['transactions', 'summary', period],
    queryFn: async () => {
      const response = await transactionsAPI.getSummary(period);
      setTransactionSummary(response.data);
      return response.data;
    },
    staleTime: 120000, // 2 minutes
  });
};

// ===================================
// Export Transactions Mutation
// ===================================
export const useExportTransactions = () => {
  return useMutation({
    mutationFn: ({ format, filters }) => transactionsAPI.export(format, filters),
    onSuccess: (data) => {
      toast.success('Export ready! Starting download...');
      // In a real app, you would trigger the download here
      if (data.data.downloadUrl && data.data.downloadUrl !== '#') {
        window.open(data.data.downloadUrl, '_blank');
      }
    },
    onError: (error) => {
      toast.error(`Export failed: ${error.message}`);
    },
  });
};

// ===================================
// Trading Safety Check
// ===================================
export const useTradingSafetyCheck = () => {
  const settings = useStore((state) => state.settings);

  return {
    canTrade: (amount) => {
      if (amount > settings.trading.maxTradeAmount) {
        return {
          allowed: false,
          reason: `Amount exceeds maximum limit of ₹${settings.trading.maxTradeAmount}`,
        };
      }
      return { allowed: true };
    },
    isPaperTrading: settings.trading.paperTradingMode,
    requiresConfirmation: settings.trading.confirmBeforeTrade,
    maxAmount: settings.trading.maxTradeAmount,
  };
};
