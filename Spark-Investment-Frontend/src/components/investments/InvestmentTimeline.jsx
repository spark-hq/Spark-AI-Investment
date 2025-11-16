// src/components/investments/InvestmentTimeline.jsx

import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Package } from 'lucide-react';
import InvestmentCard from './InvestmentCard';

const InvestmentTimeline = ({ investments, onInvestmentClick }) => {
  const [expandedPeriods, setExpandedPeriods] = useState({});

  // Group investments by time period
  const groupInvestmentsByPeriod = (investments) => {
    const now = new Date();
    const groups = {
      'This Week': [],
      'This Month': [],
      'Last 3 Months': [],
      'Last 6 Months': [],
      'This Year': [],
      'Last Year': [],
      'Older': [],
    };

    investments.forEach((investment) => {
      const investmentDate = new Date(investment.purchaseDate);
      const daysDiff = Math.floor((now - investmentDate) / (1000 * 60 * 60 * 24));
      const monthsDiff = Math.floor(daysDiff / 30);
      const yearsDiff = Math.floor(daysDiff / 365);

      if (daysDiff <= 7) {
        groups['This Week'].push(investment);
      } else if (daysDiff <= 30) {
        groups['This Month'].push(investment);
      } else if (monthsDiff <= 3) {
        groups['Last 3 Months'].push(investment);
      } else if (monthsDiff <= 6) {
        groups['Last 6 Months'].push(investment);
      } else if (yearsDiff === 0) {
        groups['This Year'].push(investment);
      } else if (yearsDiff === 1) {
        groups['Last Year'].push(investment);
      } else {
        groups['Older'].push(investment);
      }
    });

    // Remove empty groups and return
    return Object.entries(groups).filter(([, invs]) => invs.length > 0);
  };

  const groupedInvestments = groupInvestmentsByPeriod(investments);

  // Toggle period expansion
  const togglePeriod = (period) => {
    setExpandedPeriods((prev) => ({
      ...prev,
      [period]: !prev[period],
    }));
  };

  // Calculate period statistics
  const getPeriodStats = (periodInvestments) => {
    const totalInvested = periodInvestments.reduce((sum, inv) => sum + inv.investedAmount, 0);
    const totalCurrent = periodInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalReturns = totalCurrent - totalInvested;
    const profitCount = periodInvestments.filter((inv) => inv.status === 'profit').length;
    const lossCount = periodInvestments.filter((inv) => inv.status === 'loss').length;

    return {
      count: periodInvestments.length,
      totalInvested,
      totalCurrent,
      totalReturns,
      returnsPercentage: totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(2) : 0,
      profitCount,
      lossCount,
    };
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get period icon
  const getPeriodIcon = (period) => {
    if (period.includes('Week') || period.includes('Month')) return '🔥';
    if (period.includes('3 Months') || period.includes('6 Months')) return '📅';
    if (period.includes('Year')) return '📊';
    return '🏛️';
  };

  // Empty state
  if (groupedInvestments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No Investments Found</h3>
        <p className="text-gray-600">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groupedInvestments.map(([period, periodInvestments], index) => {
        const stats = getPeriodStats(periodInvestments);
        const isExpanded = expandedPeriods[period] !== false; // Default to expanded
        const isProfitable = stats.totalReturns >= 0;

        return (
          <div key={period} className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Period Header */}
            <div
              onClick={() => togglePeriod(period)}
              className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 cursor-pointer hover:from-indigo-100 hover:to-purple-100 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                {/* Left Side - Period Info */}
                <div className="flex items-center space-x-4">
                  {/* Timeline Connector */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-md">
                      {getPeriodIcon(period)}
                    </div>
                    {index < groupedInvestments.length - 1 && (
                      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-indigo-200"></div>
                    )}
                  </div>

                  {/* Period Name & Stats */}
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-xl font-bold text-gray-800">{period}</h3>
                      <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {stats.count} {stats.count === 1 ? 'Investment' : 'Investments'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <TrendingUp size={16} className="text-green-600" />
                        <span>{stats.profitCount} Profitable</span>
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="flex items-center space-x-1">
                        <TrendingDown size={16} className="text-red-600" />
                        <span>{stats.lossCount} Loss</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side - Financial Stats */}
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Total Invested</p>
                    <p className="text-sm font-bold text-gray-800">{formatCurrency(stats.totalInvested)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Current Value</p>
                    <p className="text-sm font-bold text-gray-800">{formatCurrency(stats.totalCurrent)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Returns</p>
                    <p
                      className={`text-sm font-bold ${
                        isProfitable ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {isProfitable ? '+' : ''}
                      {formatCurrency(stats.totalReturns)}
                    </p>
                    <p
                      className={`text-xs font-semibold ${
                        isProfitable ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      ({isProfitable ? '+' : ''}
                      {stats.returnsPercentage}%)
                    </p>
                  </div>

                  {/* Expand/Collapse Button */}
                  <button className="ml-4 p-2 hover:bg-white rounded-full transition-colors">
                    {isExpanded ? (
                      <ChevronUp className="text-indigo-600" size={24} />
                    ) : (
                      <ChevronDown className="text-indigo-600" size={24} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Investments Grid (Collapsible) */}
            {isExpanded && (
              <div className="p-6 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {periodInvestments.map((investment) => (
                    <InvestmentCard
                      key={investment.id}
                      investment={investment}
                      onClick={onInvestmentClick}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Timeline End Marker */}
      <div className="flex justify-center py-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg flex items-center space-x-2">
          <Calendar size={20} />
          <span>Timeline: {investments.length} Total Investments</span>
        </div>
      </div>
    </div>
  );
};

export default InvestmentTimeline;