// ===================================
// useAI Hook
// ===================================
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiAPI } from '../services/api';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

// ===================================
// Portfolio Insights
// ===================================
export const usePortfolioInsights = () => {
  const setAIInsights = useStore((state) => state.setAIInsights);

  return useQuery({
    queryKey: ['ai', 'insights'],
    queryFn: async () => {
      const response = await aiAPI.getPortfolioInsights();
      setAIInsights(response.data);
      return response.data;
    },
    staleTime: 300000, // 5 minutes
    refetchInterval: 600000, // Refetch every 10 minutes
  });
};

// ===================================
// AI Recommendations
// ===================================
export const useAIRecommendations = () => {
  const setAIRecommendations = useStore((state) => state.setAIRecommendations);

  return useQuery({
    queryKey: ['ai', 'recommendations'],
    queryFn: async () => {
      const response = await aiAPI.getRecommendations();
      setAIRecommendations(response.data);
      return response.data;
    },
    staleTime: 300000, // 5 minutes
    refetchInterval: 600000, // Refetch every 10 minutes
  });
};

// ===================================
// Risk Analysis
// ===================================
export const useRiskAnalysis = () => {
  const setRiskAnalysis = useStore((state) => state.setRiskAnalysis);

  return useQuery({
    queryKey: ['ai', 'risk-analysis'],
    queryFn: async () => {
      const response = await aiAPI.getRiskAnalysis();
      setRiskAnalysis(response.data);
      return response.data;
    },
    staleTime: 300000, // 5 minutes
  });
};

// ===================================
// Market Sentiment
// ===================================
export const useMarketSentiment = () => {
  return useQuery({
    queryKey: ['ai', 'market-sentiment'],
    queryFn: async () => {
      const response = await aiAPI.getMarketSentiment();
      return response.data;
    },
    staleTime: 120000, // 2 minutes
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

// ===================================
// Quick Insights
// ===================================
export const useQuickInsights = () => {
  return useQuery({
    queryKey: ['ai', 'quick-insights'],
    queryFn: async () => {
      const response = await aiAPI.getQuickInsights();
      return response.data;
    },
    staleTime: 60000, // 1 minute
  });
};

// ===================================
// AI Chat Mutation
// ===================================
export const useAIChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (message) => aiAPI.chat(message),
    onSuccess: (data) => {
      // Optionally invalidate queries if chat response affects recommendations
      // queryClient.invalidateQueries({ queryKey: ['ai'] });
      return data;
    },
    onError: (error) => {
      toast.error(`AI Chat Error: ${error.message}`);
    },
  });
};

// ===================================
// Investment-Specific AI Analysis
// ===================================
export const useInvestmentAnalysis = (investmentId) => {
  return useQuery({
    queryKey: ['ai', 'investment-analysis', investmentId],
    queryFn: async () => {
      if (!investmentId) return null;
      const response = await aiAPI.getInvestmentAnalysis(investmentId);
      return response.data;
    },
    enabled: !!investmentId, // Only run query if investmentId exists
    staleTime: 300000, // 5 minutes
    refetchInterval: 600000, // Refetch every 10 minutes
  });
};

// ===================================
// Complete AI Analysis (for AI Analysis page)
// ===================================
export const useCompleteAIAnalysis = () => {
  const insightsQuery = usePortfolioInsights();
  const recommendationsQuery = useAIRecommendations();
  const riskQuery = useRiskAnalysis();
  const sentimentQuery = useMarketSentiment();

  return {
    insights: insightsQuery.data,
    recommendations: recommendationsQuery.data,
    riskAnalysis: riskQuery.data,
    marketSentiment: sentimentQuery.data,
    isLoading:
      insightsQuery.isLoading ||
      recommendationsQuery.isLoading ||
      riskQuery.isLoading ||
      sentimentQuery.isLoading,
    isError:
      insightsQuery.isError ||
      recommendationsQuery.isError ||
      riskQuery.isError ||
      sentimentQuery.isError,
    refetch: () => {
      insightsQuery.refetch();
      recommendationsQuery.refetch();
      riskQuery.refetch();
      sentimentQuery.refetch();
    },
  };
};

// ===================================
// Prefetch AI Data
// ===================================
export const usePrefetchAIData = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: ['ai', 'insights'],
      queryFn: () => aiAPI.getPortfolioInsights(),
    });

    queryClient.prefetchQuery({
      queryKey: ['ai', 'recommendations'],
      queryFn: () => aiAPI.getRecommendations(),
    });
  };
};
