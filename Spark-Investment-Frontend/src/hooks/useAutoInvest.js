// ===================================
// useAutoInvest Hook
// ===================================
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { autoInvestAPI } from '../services/api';
import toast from 'react-hot-toast';

// ===================================
// Get All Strategies (AI Investment Plans)
// ===================================
export const useStrategies = () => {
  return useQuery({
    queryKey: ['autoInvest', 'strategies'],
    queryFn: async () => {
      const response = await autoInvestAPI.getStrategies();
      return response.data;
    },
    staleTime: 600000, // 10 minutes
  });
};

// ===================================
// Get Backtest Results
// ===================================
export const useBacktestResults = (strategyId) => {
  return useQuery({
    queryKey: ['autoInvest', 'backtest', strategyId],
    queryFn: async () => {
      const response = await autoInvestAPI.getBacktestResults(strategyId);
      return response.data;
    },
    enabled: !!strategyId, // Only fetch if strategyId is provided
    staleTime: 900000, // 15 minutes (backtest data changes rarely)
  });
};

// ===================================
// Get SIP Recommendations
// ===================================
export const useSIPRecommendations = () => {
  return useQuery({
    queryKey: ['autoInvest', 'sip-recommendations'],
    queryFn: async () => {
      const response = await autoInvestAPI.getSIPRecommendations();
      return response.data;
    },
    staleTime: 1800000, // 30 minutes
  });
};

// ===================================
// Create Strategy
// ===================================
export const useCreateStrategy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (strategyData) => {
      const response = await autoInvestAPI.createStrategy(strategyData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['autoInvest', 'strategies'] });
      toast.success(`Strategy created successfully! 🚀`, {
        duration: 3000,
      });
    },
    onError: (error) => {
      toast.error('Failed to create strategy: ' + error.message);
    },
  });
};

// ===================================
// Update Strategy (Activate/Pause/Modify)
// ===================================
export const useUpdateStrategy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const response = await autoInvestAPI.updateStrategy(id, updates);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['autoInvest', 'strategies'] });

      // Custom toast messages based on update type
      if (variables.updates.status === 'Active') {
        toast.success('Strategy activated! 🎯', { duration: 3000 });
      } else if (variables.updates.status === 'Paused') {
        toast.success('Strategy paused ⏸️', { duration: 3000 });
      } else {
        toast.success('Strategy updated successfully!', { duration: 3000 });
      }
    },
    onError: (error) => {
      toast.error('Failed to update strategy: ' + error.message);
    },
  });
};

// ===================================
// Delete Strategy
// ===================================
export const useDeleteStrategy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await autoInvestAPI.deleteStrategy(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['autoInvest', 'strategies'] });
      toast.success('Strategy deleted successfully! 🗑️', {
        duration: 3000,
      });
    },
    onError: (error) => {
      toast.error('Failed to delete strategy: ' + error.message);
    },
  });
};

// ===================================
// Activate Plan (convenience wrapper for updateStrategy)
// ===================================
export const useActivatePlan = () => {
  const updateStrategy = useUpdateStrategy();

  return {
    mutate: (plan) => {
      updateStrategy.mutate({
        id: plan.id,
        updates: {
          status: 'Active',
          activatedAt: new Date().toISOString(),
        },
      });
    },
    ...updateStrategy,
  };
};

// ===================================
// Toggle Plan Status (Active <-> Paused)
// ===================================
export const useTogglePlanStatus = () => {
  const updateStrategy = useUpdateStrategy();

  return {
    mutate: ({ planId, currentStatus }) => {
      const newStatus = currentStatus === 'Active' ? 'Paused' : 'Active';
      updateStrategy.mutate({
        id: planId,
        updates: { status: newStatus },
      });
    },
    ...updateStrategy,
  };
};
