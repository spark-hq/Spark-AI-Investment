// ===================================
// useMarketData Hook
// ===================================
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { marketDataAPI } from '../services/api';
import useStore from '../store/useStore';
import websocketService from '../services/websocket';

// ===================================
// Market Indices
// ===================================
export const useMarketIndices = () => {
  const setMarketData = useStore((state) => state.setMarketData);
  const updateMarketIndex = useStore((state) => state.updateMarketIndex);

  const query = useQuery({
    queryKey: ['market', 'indices'],
    queryFn: async () => {
      const response = await marketDataAPI.getIndices();
      return response.data;
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });

  // Subscribe to real-time market updates via WebSocket
  useEffect(() => {
    const unsubscribe = websocketService.subscribe('market:update', (data) => {
      // Update specific index in store
      updateMarketIndex(data.symbol, {
        price: data.price,
        change: data.change,
        changePercent: data.changePercent,
      });
    });

    return () => unsubscribe();
  }, [updateMarketIndex]);

  return query;
};

// ===================================
// Top Gainers
// ===================================
export const useTopGainers = (limit = 10) => {
  return useQuery({
    queryKey: ['market', 'gainers', limit],
    queryFn: async () => {
      const response = await marketDataAPI.getTopGainers(limit);
      return response.data;
    },
    staleTime: 60000, // 1 minute
    refetchInterval: 120000, // Refetch every 2 minutes
  });
};

// ===================================
// Top Losers
// ===================================
export const useTopLosers = (limit = 10) => {
  return useQuery({
    queryKey: ['market', 'losers', limit],
    queryFn: async () => {
      const response = await marketDataAPI.getTopLosers(limit);
      return response.data;
    },
    staleTime: 60000,
    refetchInterval: 120000,
  });
};

// ===================================
// Sector Performance
// ===================================
export const useSectorPerformance = () => {
  return useQuery({
    queryKey: ['market', 'sectors'],
    queryFn: async () => {
      const response = await marketDataAPI.getSectorPerformance();
      return response.data;
    },
    staleTime: 120000, // 2 minutes
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

// ===================================
// Stock Quote
// ===================================
export const useStockQuote = (symbol) => {
  return useQuery({
    queryKey: ['market', 'quote', symbol],
    queryFn: async () => {
      const response = await marketDataAPI.getQuote(symbol);
      return response.data;
    },
    enabled: !!symbol, // Only run if symbol is provided
    staleTime: 10000, // 10 seconds
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// ===================================
// Crypto Market
// ===================================
export const useCryptoMarket = () => {
  return useQuery({
    queryKey: ['market', 'crypto'],
    queryFn: async () => {
      const response = await marketDataAPI.getCryptoMarket();
      return response.data;
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
};

// ===================================
// Forex Rates
// ===================================
export const useForexRates = () => {
  return useQuery({
    queryKey: ['market', 'forex'],
    queryFn: async () => {
      const response = await marketDataAPI.getForexRates();
      return response.data;
    },
    staleTime: 60000,
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

// ===================================
// All Market Data (for dashboard)
// ===================================
export const useAllMarketData = () => {
  const indicesQuery = useMarketIndices();
  const gainersQuery = useTopGainers(5);
  const losersQuery = useTopLosers(5);
  const sectorsQuery = useSectorPerformance();

  return {
    indices: indicesQuery.data,
    gainers: gainersQuery.data,
    losers: losersQuery.data,
    sectors: sectorsQuery.data,
    isLoading:
      indicesQuery.isLoading ||
      gainersQuery.isLoading ||
      losersQuery.isLoading ||
      sectorsQuery.isLoading,
    isError:
      indicesQuery.isError ||
      gainersQuery.isError ||
      losersQuery.isError ||
      sectorsQuery.isError,
  };
};
