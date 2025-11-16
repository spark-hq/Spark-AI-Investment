// src/components/investments/InvestmentFilters.jsx

import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { investmentFilters } from '../../data/investmentData';

const InvestmentFilters = ({ filters, onFilterChange, onSearchChange, totalResults }) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    onFilterChange('sector', 'All');
    onFilterChange('timeRange', 'all');
    onFilterChange('sortBy', 'date-desc');
    setSearchQuery('');
    onSearchChange('');
  };

  // Check if any filter is active
  const hasActiveFilters =
    filters.platform !== 'All' ||
    filters.type !== 'All' ||
    filters.status !== 'All' ||
    filters.sector !== 'All' ||
    filters.timeRange !== 'all' ||
    searchQuery !== '';

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="text-indigo-600" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Filters</h2>
          {totalResults !== undefined && (
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
              {totalResults} {totalResults === 1 ? 'Result' : 'Results'}
            </span>
          )}
        </div>

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
        >
          <SlidersHorizontal size={18} />
          <span className="text-sm">{showAdvancedFilters ? 'Hide' : 'Show'} Advanced</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, symbol, or sector..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
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
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            {investmentFilters.platforms.map((platform) => (
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
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            {investmentFilters.types.map((type) => (
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
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            {investmentFilters.status.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            {investmentFilters.sortBy.map((sort) => (
              <option key={sort.value} value={sort.value}>
                {sort.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters (Collapsible) */}
      {showAdvancedFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t-2 border-gray-100 animate-fadeIn">
          {/* Sector Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
            <select
              value={filters.sector}
              onChange={(e) => handleFilterChange('sector', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
              {investmentFilters.sectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </div>

          {/* Time Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
            <select
              value={filters.timeRange}
              onChange={(e) => handleFilterChange('timeRange', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
              {investmentFilters.timeRange.map((range) => (
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

export default InvestmentFilters;