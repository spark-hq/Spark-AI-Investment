// src/components/transactions/TransactionFilters.jsx

import { useState } from 'react';
import { Search, Filter, SlidersHorizontal, X, Calendar, Download } from 'lucide-react';
import { transactionFilters } from '../../data/transactionData';

const TransactionFilters = ({
  filters,
  onFilterChange,
  onSearchChange,
  totalResults,
  onExportCSV,
  onExportPDF,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange(value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    onSearchChange('');
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    onFilterChange(filterType, value);
  };

  // Reset all filters
  const resetFilters = () => {
    onFilterChange('platform', 'All');
    onFilterChange('type', 'All');
    onFilterChange('status', 'All');
    onFilterChange('category', 'All');
    onFilterChange('paymentMode', 'All');
    onFilterChange('dateRange', 'all');
    onFilterChange('amountRange', 'all');
    onFilterChange('startDate', '');
    onFilterChange('endDate', '');
    setSearchQuery('');
    onSearchChange('');
  };

  // Check if any filter is active
  const hasActiveFilters =
    filters.platform !== 'All' ||
    filters.type !== 'All' ||
    filters.status !== 'All' ||
    filters.category !== 'All' ||
    filters.paymentMode !== 'All' ||
    filters.dateRange !== 'all' ||
    filters.amountRange !== 'all' ||
    searchQuery !== '';

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Filter className="text-indigo-600" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Filters & Search</h2>
          {totalResults !== undefined && (
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
              {totalResults} {totalResults === 1 ? 'Transaction' : 'Transactions'}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            <SlidersHorizontal size={18} />
            <span className="text-sm">{showAdvancedFilters ? 'Hide' : 'Show'} Advanced</span>
          </button>

          {/* Export Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onExportCSV}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
            >
              <Download size={16} />
              <span className="text-sm">CSV</span>
            </button>
            <button
              onClick={onExportPDF}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
            >
              <Download size={16} />
              <span className="text-sm">PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by asset name, symbol, order ID, or platform..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors text-gray-900"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Basic Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Platform Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
          <select
            value={filters.platform}
            onChange={(e) => handleFilterChange('platform', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer text-gray-900"
          >
            {transactionFilters.platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer text-gray-900"
          >
            {transactionFilters.types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer text-gray-900"
          >
            {transactionFilters.status.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <select
            value={filters.dateRange}
            onChange={(e) => {
              handleFilterChange('dateRange', e.target.value);
              if (e.target.value === 'custom') {
                setShowDatePicker(true);
              } else {
                setShowDatePicker(false);
              }
            }}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer text-gray-900"
          >
            {transactionFilters.dateRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Custom Date Picker (Conditional) */}
      {showDatePicker && filters.dateRange === 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-indigo-50 rounded-lg border-2 border-indigo-100 animate-fadeIn">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
              <Calendar size={16} />
              <span>Start Date</span>
            </label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
              <Calendar size={16} />
              <span>End Date</span>
            </label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors text-gray-900"
            />
          </div>
        </div>
      )}

      {/* Advanced Filters (Collapsible) */}
      {showAdvancedFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t-2 border-gray-100 animate-fadeIn">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer text-gray-900"
            >
              {transactionFilters.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Mode Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode</label>
            <select
              value={filters.paymentMode}
              onChange={(e) => handleFilterChange('paymentMode', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer text-gray-900"
            >
              {transactionFilters.paymentModes.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount Range</label>
            <select
              value={filters.amountRange}
              onChange={(e) => handleFilterChange('amountRange', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer text-gray-900"
            >
              {transactionFilters.amountRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Active Filters Display & Reset */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t-2 border-gray-100">
          <div className="flex flex-wrap gap-2">
            {filters.platform !== 'All' && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <span>Platform: {filters.platform}</span>
                <button
                  onClick={() => handleFilterChange('platform', 'All')}
                  className="hover:text-blue-900 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {filters.type !== 'All' && (
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <span>Type: {filters.type}</span>
                <button
                  onClick={() => handleFilterChange('type', 'All')}
                  className="hover:text-purple-900 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {filters.status !== 'All' && (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <span>Status: {filters.status}</span>
                <button
                  onClick={() => handleFilterChange('status', 'All')}
                  className="hover:text-green-900 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {filters.category !== 'All' && (
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <span>Category: {filters.category}</span>
                <button
                  onClick={() => handleFilterChange('category', 'All')}
                  className="hover:text-orange-900 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <span>Search: "{searchQuery}"</span>
                <button onClick={clearSearch} className="hover:text-gray-900 transition-colors">
                  <X size={14} />
                </button>
              </span>
            )}
          </div>

          {/* Reset All Button */}
          <button
            onClick={resetFilters}
            className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <X size={16} />
            <span>Reset All</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;
