// ===================================
// useLiveTrading Hook
// ===================================
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tradingAPI, marketDataAPI } from '../services/api';
import toast from 'react-hot-toast';

// ===================================
// Market Data Hooks (with real-time updates)
// ===================================

// Get live market quotes (with auto-refresh every 3 seconds)
export const useLiveMarketData = (symbols, options = {}) => {
  const { refetchInterval = 3000, enabled = true } = options;

  return useQuery({
    queryKey: ['market', 'live', symbols],
    queryFn: async () => {
      // Fetch quotes for multiple symbols
      const promises = symbols.map(symbol => marketDataAPI.getQuote(symbol));
      const results = await Promise.all(promises);
      return results.map(r => r.data);
    },
    enabled: enabled && symbols && symbols.length > 0,
    refetchInterval, // Auto-refresh every 3 seconds
    staleTime: 2000, // Consider data stale after 2 seconds
  });
};

// Get single stock quote (real-time)
export const useStockQuote = (symbol, options = {}) => {
  const { refetchInterval = 3000, enabled = true } = options;

  return useQuery({
    queryKey: ['market', 'quote', symbol],
    queryFn: async () => {
      const response = await marketDataAPI.getQuote(symbol);
      return response.data;
    },
    enabled: enabled && !!symbol,
    refetchInterval,
    staleTime: 2000,
  });
};

// Get market indices (real-time)
export const useMarketIndices = (options = {}) => {
  const { refetchInterval = 5000 } = options;

  return useQuery({
    queryKey: ['market', 'indices'],
    queryFn: async () => {
      const response = await marketDataAPI.getIndices();
      return response.data;
    },
    refetchInterval,
    staleTime: 4000,
  });
};

// Get top gainers
export const useTopGainers = (limit = 10) => {
  return useQuery({
    queryKey: ['market', 'gainers', limit],
    queryFn: async () => {
      const response = await marketDataAPI.getTopGainers(limit);
      return response.data;
    },
    refetchInterval: 10000, // Refresh every 10 seconds
    staleTime: 8000,
  });
};

// Get top losers
export const useTopLosers = (limit = 10) => {
  return useQuery({
    queryKey: ['market', 'losers', limit],
    queryFn: async () => {
      const response = await marketDataAPI.getTopLosers(limit);
      return response.data;
    },
    refetchInterval: 10000,
    staleTime: 8000,
  });
};

// ===================================
// Trading Hooks
// ===================================

// Execute trade
export const useExecuteTrade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tradeData) => {
      const response = await tradingAPI.executeTrade(tradeData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['trading', 'history'] });
      queryClient.invalidateQueries({ queryKey: ['trading', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['investments'] });

      const action = variables.action || 'Trade';
      toast.success(`${action} order placed successfully! 🎯`, {
        duration: 4000,
      });
    },
    onError: (error, variables) => {
      const action = variables.action || 'Trade';
      toast.error(`Failed to execute ${action}: ${error.message}`);
    },
  });
};

// Get trade history
export const useTradeHistory = (limit = 50) => {
  return useQuery({
    queryKey: ['trading', 'history', limit],
    queryFn: async () => {
      const response = await tradingAPI.getTradeHistory(limit);
      return response.data;
    },
    staleTime: 30000, // 30 seconds
  });
};

// Get pending orders
export const usePendingOrders = () => {
  return useQuery({
    queryKey: ['trading', 'pending'],
    queryFn: async () => {
      const response = await tradingAPI.getPendingOrders();
      return response.data;
    },
    refetchInterval: 5000, // Refresh every 5 seconds
    staleTime: 4000,
  });
};

// Cancel order
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId) => {
      const response = await tradingAPI.cancelOrder(orderId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['trading', 'history'] });
      toast.success('Order cancelled successfully! 🚫', {
        duration: 3000,
      });
    },
    onError: (error) => {
      toast.error('Failed to cancel order: ' + error.message);
    },
  });
};

// ===================================
// Convenience Hooks
// ===================================

// Quick buy order
export const useQuickBuy = () => {
  const executeTrade = useExecuteTrade();

  return {
    mutate: ({ symbol, quantity, price }) => {
      executeTrade.mutate({
        action: 'Buy',
        symbol,
        quantity,
        price,
        orderType: 'market',
        timestamp: new Date().toISOString(),
      });
    },
    ...executeTrade,
  };
};

// Quick sell order
export const useQuickSell = () => {
  const executeTrade = useExecuteTrade();

  return {
    mutate: ({ symbol, quantity, price }) => {
      executeTrade.mutate({
        action: 'Sell',
        symbol,
        quantity,
        price,
        orderType: 'market',
        timestamp: new Date().toISOString(),
      });
    },
    ...executeTrade,
  };
};

// Custom hook to manage execution log (client-side tracking)
export const useExecutionLog = () => {
  const { data: tradeHistory, isLoading } = useTradeHistory(50);

  // Transform trade history into execution log format
  const executionLog = (tradeHistory || []).map(trade => ({
    id: trade.orderId || trade.id,
    time: trade.date || trade.timestamp,
    action: trade.type || trade.action,
    asset: trade.asset || trade.symbol,
    quantity: trade.quantity,
    price: trade.price,
    amount: trade.totalAmount || (trade.price * trade.quantity),
    status: trade.status || 'executed',
    type: trade.autoTraded ? 'auto' : 'manual',
    reason: trade.reason || 'Manual trade',
  }));

  return {
    executionLog,
    isLoading,
  };
};
