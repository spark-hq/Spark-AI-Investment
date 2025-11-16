// src/pages/Transactions.jsx

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, TrendingUp, DollarSign, AlertCircle, BarChart3, Sparkles, ArrowLeft } from 'lucide-react';
import Card from '../components/ui/Card';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionModal from '../components/transactions/TransactionModal';
import TransactionCharts from '../components/transactions/TransactionCharts';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ErrorDisplay } from '../components/ui/ErrorBoundary';
import { formatCurrency } from '../utils/calculations';
import {
  useTransactions,
  useTransactionSummary,
  useTransactionExport,
  useFilteredTransactions,
} from '../hooks/useTransactions';

const Transactions = () => {
  const navigate = useNavigate();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    platform: 'All',
    type: 'All',
    status: 'All',
    category: 'All',
    paymentMode: 'All',
    dateRange: 'all',
    amountRange: 'all',
    startDate: '',
    endDate: '',
  });

  // Fetch transactions and summary from API
  const { data: transactions, isLoading: transactionsLoading, isError: transactionsError } = useTransactions();
  const { data: transactionSummary, isLoading: summaryLoading } = useTransactionSummary('1M');
  const exportMutation = useTransactionExport();

  // Filter transactions using the custom hook
  const filteredTransactions = useMemo(() => {
    return useFilteredTransactions(transactions || [], filters, searchQuery);
  }, [transactions, searchQuery, filters]);

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Handle search change
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  // Handle transaction click
  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  // Close modal
  const closeModal = () => {
    setSelectedTransaction(null);
  };

  // Export to CSV - Use API mutation
  const handleExportCSV = () => {
    // If API export is available, use it
    if (exportMutation) {
      exportMutation.mutate({
        format: 'csv',
        filters: filters,
      });
      return;
    }

    // Fallback to client-side export (for mock mode or API failure)
    const headers = [
      'Date',
      'Type',
      'Asset',
      'Symbol',
      'Platform',
      'Quantity',
      'Price',
      'Amount',
      'Fees',
      'Tax',
      'Total Amount',
      'Status',
      'Order ID',
      'Payment Mode',
    ];

    const csvData = filteredTransactions.map((t) => [
      new Date(t.date).toLocaleString('en-IN'),
      t.type,
      t.asset,
      t.symbol,
      t.platform,
      t.quantity,
      t.price,
      t.amount,
      t.fees,
      t.tax,
      t.totalAmount,
      t.status,
      t.orderId,
      t.paymentMode,
    ]);

    const csvContent = [headers, ...csvData].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Export to PDF - Use API mutation
  const handleExportPDF = () => {
    exportMutation.mutate({
      format: 'pdf',
      filters: filters,
    });
  };

  // Show loading state
  if (transactionsLoading || summaryLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner message="Loading transactions..." />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (transactionsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorDisplay
            title="Failed to load transactions"
            message="There was an error loading your transaction history. Please try again."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-medium mb-4 flex items-center space-x-2 transition-colors px-4 py-3 rounded-lg min-h-[44px]"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg">
              <Receipt className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">Transaction History</h1>
              <p className="text-xl text-gray-600">Complete record of all your investments</p>
            </div>
            <Sparkles className="text-purple-600 animate-pulse" size={32} />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fadeIn">
          {/* Total Transactions */}
          <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white hover-lift shadow-xl border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
            <div className="relative z-10">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm w-12 h-12 flex items-center justify-center mb-3">
                <Receipt size={24} />
              </div>
              <p className="text-indigo-100 text-sm mb-2 font-medium">Total Transactions</p>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{transactionSummary?.totalTransactions || 0}</h3>
              <p className="text-indigo-100 text-sm">
                {transactionSummary?.completedTransactions || 0} completed
              </p>
            </div>
          </Card>

          {/* Total Buy Amount */}
          <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white hover-lift shadow-xl border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
            <div className="relative z-10">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm w-12 h-12 flex items-center justify-center mb-3">
                <TrendingUp size={24} />
              </div>
              <p className="text-green-100 text-sm mb-2 font-medium">Total Buy Amount</p>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                {formatCurrency(transactionSummary?.totalBuyAmount || 0)}
              </h3>
              <p className="text-green-100 text-sm">Including fees & taxes</p>
            </div>
          </Card>

          {/* Total Sell Amount */}
          <Card className="bg-gradient-to-br from-orange-600 to-red-600 text-white hover-lift shadow-xl border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
            <div className="relative z-10">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm w-12 h-12 flex items-center justify-center mb-3">
                <DollarSign size={24} />
              </div>
              <p className="text-orange-100 text-sm mb-2 font-medium">Total Sell Amount</p>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                {formatCurrency(transactionSummary?.totalSellAmount || 0)}
              </h3>
              <p className="text-orange-100 text-sm">After deductions</p>
            </div>
          </Card>

          {/* Pending/Failed */}
          <Card className="bg-gradient-to-br from-yellow-600 to-amber-600 text-white hover-lift shadow-xl border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
            <div className="relative z-10">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm w-12 h-12 flex items-center justify-center mb-3">
                <AlertCircle size={24} />
              </div>
              <p className="text-yellow-100 text-sm mb-2 font-medium">Pending/Failed</p>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                {(transactionSummary?.pendingTransactions || 0) + (transactionSummary?.failedTransactions || 0)}
              </h3>
              <p className="text-yellow-100 text-sm">
                {transactionSummary?.pendingTransactions || 0}P / {transactionSummary?.failedTransactions || 0}F
              </p>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="text-indigo-600" size={24} />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Analytics & Insights</h2>
          </div>
          <TransactionCharts />
        </div>

        {/* Filters */}
        <div className="animate-fadeIn">
          <TransactionFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearchChange={handleSearchChange}
            totalResults={filteredTransactions.length}
            onExportCSV={handleExportCSV}
            onExportPDF={handleExportPDF}
          />
        </div>

        {/* Transaction Table */}
        <div className="animate-fadeIn">
          <TransactionTable
            transactions={filteredTransactions}
            onTransactionClick={handleTransactionClick}
          />
        </div>

        {/* Modal */}
        {selectedTransaction && (
          <TransactionModal transaction={selectedTransaction} onClose={closeModal} />
        )}
      </div>
    </div>
  );
};

export default Transactions;
