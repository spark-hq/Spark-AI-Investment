// ===================================
// Investment Hooks - React Query hooks for investment data
// ===================================
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { investmentsAPI } from '../services/api';
import useStore from '../store/useStore';

// ===================================
// Query Hooks
// ===================================

// Get all investments
export const useInvestments = () => {
  const setInvestments = useStore((state) => state.setInvestments);

  return useQuery({
    queryKey: ['investments'],
    queryFn: async () => {
      const response = await investmentsAPI.getAll();

      // Use holdings array which contains all investments
      // If holdings doesn't exist, combine the separated arrays
      const allInvestments = response.data.holdings || [
        ...(response.data.stocks || []),
        ...(response.data.mutualFunds || []),
        ...(response.data.crypto || []),
      ];

      setInvestments(allInvestments);
      return allInvestments;
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};

// Get investment by ID
export const useInvestment = (id) => {
  return useQuery({
    queryKey: ['investment', id],
    queryFn: async () => {
      const response = await investmentsAPI.getById(id);
      return response.data;
    },
    enabled: !!id, // Only run if ID exists
    staleTime: 30000,
  });
};

// Get stocks only
export const useStocks = () => {
  return useQuery({
    queryKey: ['investments', 'stocks'],
    queryFn: async () => {
      const response = await investmentsAPI.getStocks();
      return response.data;
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
};

// Get mutual funds only
export const useMutualFunds = () => {
  return useQuery({
    queryKey: ['investments', 'mutualFunds'],
    queryFn: async () => {
      const response = await investmentsAPI.getMutualFunds();
      return response.data;
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
};

// Get crypto only
export const useCrypto = () => {
  return useQuery({
    queryKey: ['investments', 'crypto'],
    queryFn: async () => {
      const response = await investmentsAPI.getCrypto();
      return response.data;
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
};

// ===================================
// Mutation Hooks
// ===================================

// Add new investment
export const useAddInvestment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (investment) => investmentsAPI.add(investment),
    onSuccess: () => {
      // Invalidate and refetch investments
      queryClient.invalidateQueries(['investments']);
    },
  });
};

// Update investment
export const useUpdateInvestment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }) => investmentsAPI.update(id, updates),
    onSuccess: (data, variables) => {
      // Invalidate specific investment and list
      queryClient.invalidateQueries(['investment', variables.id]);
      queryClient.invalidateQueries(['investments']);
    },
  });
};

// Delete investment
export const useDeleteInvestment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => investmentsAPI.delete(id),
    onSuccess: () => {
      // Invalidate investments list
      queryClient.invalidateQueries(['investments']);
    },
  });
};

// ===================================
// Helper hook for investment summary
// ===================================
export const useInvestmentSummary = (investments = []) => {
  // Memoize expensive calculations to prevent recalculation on every render
  return useMemo(() => {
    if (!investments || investments.length === 0) {
      return {
        totalInvested: 0,
        totalCurrentValue: 0,
        totalReturns: 0,
        overallReturnsPercentage: 0,
        profitableInvestments: 0,
        lossInvestments: 0,
      };
    }

    const totalInvested = investments.reduce((sum, inv) => sum + (inv.investedAmount || inv.invested || 0), 0);
    const totalCurrentValue = investments.reduce((sum, inv) => sum + (inv.currentValue || 0), 0);
    const totalReturns = totalCurrentValue - totalInvested;
    const overallReturnsPercentage = totalInvested > 0
      ? ((totalReturns / totalInvested) * 100).toFixed(2)
      : 0;

    const profitableInvestments = investments.filter(inv => {
      const returns = (inv.currentValue || 0) - (inv.investedAmount || inv.invested || 0);
      return returns > 0;
    }).length;

    const lossInvestments = investments.filter(inv => {
      const returns = (inv.currentValue || 0) - (inv.investedAmount || inv.invested || 0);
      return returns < 0;
    }).length;

    return {
      totalInvested,
      totalCurrentValue,
      totalReturns,
      overallReturnsPercentage,
      profitableInvestments,
      lossInvestments,
    };
  }, [investments]); // Only recalculate when investments array changes
};
