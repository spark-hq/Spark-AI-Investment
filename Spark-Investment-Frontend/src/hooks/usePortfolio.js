// ===================================
// usePortfolio Hook
// ===================================
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioAPI } from '../services/api';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

// ===================================
// Portfolio Summary
// ===================================
export const usePortfolioSummary = () => {
  const setPortfolioSummary = useStore((state) => state.setPortfolioSummary);

  return useQuery({
    queryKey: ['portfolio', 'summary'],
    queryFn: async () => {
      const response = await portfolioAPI.getSummary();
      setPortfolioSummary(response.data);
      return response.data;
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};

// ===================================
// Connected Platforms
// ===================================
export const useConnectedPlatforms = () => {
  const setConnectedPlatforms = useStore((state) => state.setConnectedPlatforms);

  return useQuery({
    queryKey: ['portfolio', 'platforms'],
    queryFn: async () => {
      const response = await portfolioAPI.getPlatforms();
      setConnectedPlatforms(response.data);
      return response.data;
    },
    staleTime: 60000, // 1 minute
  });
};

// ===================================
// Portfolio Performance
// ===================================
export const usePortfolioPerformance = (period = '1M') => {
  return useQuery({
    queryKey: ['portfolio', 'performance', period],
    queryFn: async () => {
      const response = await portfolioAPI.getPerformance(period);
      return response.data;
    },
    staleTime: 60000,
  });
};

// ===================================
// Asset Allocation
// ===================================
export const useAssetAllocation = () => {
  return useQuery({
    queryKey: ['portfolio', 'allocation'],
    queryFn: async () => {
      const response = await portfolioAPI.getAllocation();
      return response.data;
    },
    staleTime: 120000, // 2 minutes
  });
};

// ===================================
// Top Performers
// ===================================
export const useTopPerformers = () => {
  return useQuery({
    queryKey: ['portfolio', 'top-performers'],
    queryFn: async () => {
      const response = await portfolioAPI.getTopPerformers();
      return response.data;
    },
    staleTime: 60000,
  });
};

// ===================================
// Recent Activity
// ===================================
export const useRecentActivity = (limit = 10) => {
  return useQuery({
    queryKey: ['portfolio', 'activity', limit],
    queryFn: async () => {
      const response = await portfolioAPI.getRecentActivity(limit);
      return response.data;
    },
    staleTime: 30000,
  });
};

// ===================================
// Connect Platform Mutation
// ===================================
export const useConnectPlatform = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ platform, credentials }) =>
      portfolioAPI.connectPlatform(platform, credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', 'platforms'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio', 'summary'] });
      toast.success('Platform connected successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to connect platform: ${error.message}`);
    },
  });
};

// ===================================
// Disconnect Platform Mutation
// ===================================
export const useDisconnectPlatform = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (platformId) => portfolioAPI.disconnectPlatform(platformId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', 'platforms'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio', 'summary'] });
      toast.success('Platform disconnected');
    },
    onError: (error) => {
      toast.error(`Failed to disconnect: ${error.message}`);
    },
  });
};

// ===================================
// Prefetch Portfolio Data (for optimization)
// ===================================
export const usePrefetchPortfolio = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: ['portfolio', 'summary'],
      queryFn: () => portfolioAPI.getSummary(),
    });

    queryClient.prefetchQuery({
      queryKey: ['portfolio', 'platforms'],
      queryFn: () => portfolioAPI.getPlatforms(),
    });
  };
};
