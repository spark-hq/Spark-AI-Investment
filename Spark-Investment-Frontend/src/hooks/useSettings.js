// ===================================
// useSettings Hook
// ===================================
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsAPI } from '../services/api';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

// ===================================
// User Profile
// ===================================
export const useProfile = () => {
  return useQuery({
    queryKey: ['settings', 'profile'],
    queryFn: async () => {
      const response = await settingsAPI.getProfile();
      return response.data;
    },
    staleTime: 600000, // 10 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates) => {
      const response = await settingsAPI.updateProfile(updates);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'profile'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update profile: ' + error.message);
    },
  });
};

// ===================================
// Preferences
// ===================================
export const usePreferences = () => {
  return useQuery({
    queryKey: ['settings', 'preferences'],
    queryFn: async () => {
      const response = await settingsAPI.getPreferences();
      return response.data;
    },
    staleTime: 600000, // 10 minutes
  });
};

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates) => {
      const response = await settingsAPI.updatePreferences(updates);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'preferences'] });
      toast.success('Preferences updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update preferences: ' + error.message);
    },
  });
};

// ===================================
// Connected Accounts/Platforms
// ===================================
export const useConnectedAccounts = () => {
  return useQuery({
    queryKey: ['settings', 'connected-accounts'],
    queryFn: async () => {
      const response = await settingsAPI.getConnectedAccounts();
      return response.data;
    },
    staleTime: 300000, // 5 minutes
  });
};

// ===================================
// Notification Settings
// ===================================
export const useNotificationSettings = () => {
  return useQuery({
    queryKey: ['settings', 'notifications'],
    queryFn: async () => {
      const response = await settingsAPI.getNotifications();
      return response.data;
    },
    staleTime: 600000, // 10 minutes
  });
};

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates) => {
      const response = await settingsAPI.updateNotifications(updates);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'notifications'] });
      toast.success('Notification settings updated!');
    },
    onError: (error) => {
      toast.error('Failed to update notifications: ' + error.message);
    },
  });
};

// ===================================
// Safety Settings (Auto-Trading)
// ===================================
export const useSafetySettings = () => {
  return useQuery({
    queryKey: ['settings', 'safety'],
    queryFn: async () => {
      const response = await settingsAPI.getPreferences();
      // Extract safety settings from preferences
      return response.data?.safetySettings || {
        autoTradingEnabled: false,
        dailyLimit: 10000,
        perTradeLimit: 2000,
        minConfidenceThreshold: 75,
        emergencyStopActive: false,
        requireApproval: true,
        allowAfterHours: false,
        maxDailyTrades: 5,
      };
    },
    staleTime: 300000, // 5 minutes
  });
};

export const useUpdateSafetySettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates) => {
      // Update safety settings within preferences
      const response = await settingsAPI.updatePreferences({
        safetySettings: updates,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'safety'] });
      queryClient.invalidateQueries({ queryKey: ['settings', 'preferences'] });
      toast.success('Safety settings updated! 🛡️');
    },
    onError: (error) => {
      toast.error('Failed to update safety settings: ' + error.message);
    },
  });
};

export const useEmergencyStop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await settingsAPI.updatePreferences({
        safetySettings: {
          emergencyStopActive: true,
          autoTradingEnabled: false,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'safety'] });
      queryClient.invalidateQueries({ queryKey: ['settings', 'preferences'] });
      toast.success('🚨 EMERGENCY STOP ACTIVATED - All auto-trading disabled!', {
        duration: 5000,
        icon: '🛑',
      });
    },
    onError: (error) => {
      toast.error('Failed to activate emergency stop: ' + error.message);
    },
  });
};

// ===================================
// Complete Settings (All at once)
// ===================================
export const useCompleteSettings = () => {
  const profileQuery = useProfile();
  const preferencesQuery = usePreferences();
  const notificationsQuery = useNotificationSettings();
  const connectedAccountsQuery = useConnectedAccounts();
  const safetyQuery = useSafetySettings();

  return {
    profile: profileQuery.data,
    preferences: preferencesQuery.data,
    notifications: notificationsQuery.data,
    connectedAccounts: connectedAccountsQuery.data,
    safetySettings: safetyQuery.data,
    isLoading:
      profileQuery.isLoading ||
      preferencesQuery.isLoading ||
      notificationsQuery.isLoading ||
      connectedAccountsQuery.isLoading ||
      safetyQuery.isLoading,
    isError:
      profileQuery.isError ||
      preferencesQuery.isError ||
      notificationsQuery.isError ||
      connectedAccountsQuery.isError ||
      safetyQuery.isError,
    refetch: () => {
      profileQuery.refetch();
      preferencesQuery.refetch();
      notificationsQuery.refetch();
      connectedAccountsQuery.refetch();
      safetyQuery.refetch();
    },
  };
};
