// ===================================
// useTransactions Hook
// ===================================
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsAPI } from '../services/api';
import toast from 'react-hot-toast';

// ===================================
// Get All Transactions
// ===================================
export const useTransactions = (filters = {}) => {
  return useQuery({
    queryKey: ['transactions', 'list', filters],
    queryFn: async () => {
      const response = await transactionsAPI.getAll(filters);
      return response.data;
    },
    staleTime: 300000, // 5 minutes
    // Keep previous data while fetching new filtered data
    placeholderData: (previousData) => previousData,
  });
};

// ===================================
// Get Transaction Summary
// ===================================
export const useTransactionSummary = (period = '1M') => {
  return useQuery({
    queryKey: ['transactions', 'summary', period],
    queryFn: async () => {
      const response = await transactionsAPI.getSummary(period);
      return response.data;
    },
    staleTime: 600000, // 10 minutes
  });
};

// ===================================
// Export Transactions
// ===================================
export const useTransactionExport = () => {
  return useMutation({
    mutationFn: async ({ format, filters }) => {
      const response = await transactionsAPI.export(format, filters);
      return response.data;
    },
    onSuccess: (data, variables) => {
      const format = variables.format.toUpperCase();
      toast.success(`${format} export successful! 📊`, {
        duration: 3000,
      });

      // If backend returns downloadUrl, trigger download
      if (data.downloadUrl && data.downloadUrl !== '#') {
        window.open(data.downloadUrl, '_blank');
      }
    },
    onError: (error) => {
      toast.error('Failed to export transactions: ' + error.message);
    },
  });
};

// ===================================
// Client-Side Filtering Helper
// ===================================
// For advanced filtering that backend might not support
export const useFilteredTransactions = (transactions, filters, searchQuery) => {
  if (!transactions) return [];

  return transactions.filter((transaction) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        transaction.asset.toLowerCase().includes(query) ||
        transaction.symbol.toLowerCase().includes(query) ||
        transaction.orderId.toLowerCase().includes(query) ||
        transaction.platform.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Platform filter
    if (filters.platform && filters.platform !== 'All' && transaction.platform !== filters.platform) {
      return false;
    }

    // Type filter
    if (filters.type && filters.type !== 'All' && transaction.type !== filters.type) {
      return false;
    }

    // Status filter
    if (filters.status && filters.status !== 'All' && transaction.status !== filters.status) {
      return false;
    }

    // Category filter
    if (filters.category && filters.category !== 'All' && transaction.category !== filters.category) {
      return false;
    }

    // Payment Mode filter
    if (filters.paymentMode && filters.paymentMode !== 'All' && transaction.paymentMode !== filters.paymentMode) {
      return false;
    }

    // Date Range filter
    if (filters.dateRange && filters.dateRange !== 'all') {
      const transactionDate = new Date(transaction.date);
      const now = new Date();

      if (filters.dateRange === 'custom') {
        if (filters.startDate) {
          const startDate = new Date(filters.startDate);
          if (transactionDate < startDate) return false;
        }
        if (filters.endDate) {
          const endDate = new Date(filters.endDate);
          endDate.setHours(23, 59, 59, 999);
          if (transactionDate > endDate) return false;
        }
      } else {
        const daysMap = {
          '1d': 1,
          '7d': 7,
          '30d': 30,
          '3m': 90,
          '6m': 180,
          '1y': 365,
        };
        const days = daysMap[filters.dateRange];
        if (days) {
          const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
          if (transactionDate < cutoffDate) return false;
        }
      }
    }

    // Amount Range filter
    if (filters.amountRange && filters.amountRange !== 'all') {
      const amount = transaction.totalAmount;
      const ranges = {
        '0-10000': [0, 10000],
        '10000-50000': [10000, 50000],
        '50000-100000': [50000, 100000],
        '100000+': [100000, Infinity],
      };
      const range = ranges[filters.amountRange];
      if (range && (amount < range[0] || amount >= range[1])) {
        return false;
      }
    }

    return true;
  });
};
