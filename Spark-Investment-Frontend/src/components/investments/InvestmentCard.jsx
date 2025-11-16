// src/components/investments/InvestmentCard.jsx

import React from 'react';
import { TrendingUp, TrendingDown, Calendar, Package, DollarSign } from 'lucide-react';

const InvestmentCard = React.memo(({ investment, onClick }) => {
  const isProfit = investment.status === 'profit';
  const statusColor = isProfit ? 'text-green-600' : 'text-red-600';
  const statusBgColor = isProfit ? 'bg-green-50' : 'bg-red-50';
  const statusBorderColor = isProfit ? 'border-green-200' : 'border-red-200';

  // Format currency in Indian format
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Get platform color
  const getPlatformColor = (platform) => {
    const colors = {
      Zerodha: 'bg-blue-100 text-blue-700',
      Groww: 'bg-green-100 text-green-700',
      Upstox: 'bg-purple-100 text-purple-700',
      Binance: 'bg-yellow-100 text-yellow-700',
    };
    return colors[platform] || 'bg-gray-100 text-gray-700';
  };

  // Get type badge color
  const getTypeColor = (type) => {
    const colors = {
      Stock: 'bg-indigo-100 text-indigo-700',
      'Mutual Fund': 'bg-pink-100 text-pink-700',
      ETF: 'bg-orange-100 text-orange-700',
      Crypto: 'bg-amber-100 text-amber-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div
      onClick={() => onClick && onClick(investment)}
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${statusBorderColor} overflow-hidden group`}
    >
      {/* Top Color Strip */}
      <div className={`h-1.5 ${isProfit ? 'bg-green-500' : 'bg-red-500'}`}></div>

      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            {/* Logo/Icon */}
            <div className="text-4xl">{investment.logo}</div>

            {/* Name & Symbol */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                {investment.name}
              </h3>
              <p className="text-sm text-gray-500 font-mono">{investment.symbol}</p>
            </div>
          </div>

          {/* Returns Badge */}
          <div className={`${statusBgColor} ${statusColor} px-3 py-1 rounded-full flex items-center space-x-1`}>
            {isProfit ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="font-bold text-sm">{investment.returnsPercentage}%</span>
          </div>
        </div>

        {/* Badges Section */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPlatformColor(investment.platform)}`}>
            {investment.platform}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(investment.type)}`}>
            {investment.type}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {investment.sector}
          </span>
        </div>

        {/* Investment Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Invested Amount */}
          <div className="space-y-1">
            <p className="text-xs text-gray-500 font-medium">Invested</p>
            <p className="text-sm font-bold text-gray-800">{formatCurrency(investment.investedAmount)}</p>
          </div>

          {/* Current Value */}
          <div className="space-y-1">
            <p className="text-xs text-gray-500 font-medium">Current Value</p>
            <p className="text-sm font-bold text-gray-800">{formatCurrency(investment.currentValue)}</p>
          </div>

          {/* Returns */}
          <div className="space-y-1">
            <p className="text-xs text-gray-500 font-medium">Returns</p>
            <p className={`text-sm font-bold ${statusColor}`}>
              {isProfit ? '+' : ''}
              {formatCurrency(investment.returns)}
            </p>
          </div>

          {/* Quantity */}
          <div className="space-y-1">
            <p className="text-xs text-gray-500 font-medium">Quantity</p>
            <p className="text-sm font-bold text-gray-800">{investment.quantity}</p>
          </div>
        </div>

        {/* Price Information */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Avg. Price</p>
              <p className="text-sm font-semibold text-gray-700">{formatCurrency(investment.avgPrice)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Current Price</p>
              <p className="text-sm font-semibold text-gray-700">{formatCurrency(investment.currentPrice)}</p>
            </div>
          </div>
        </div>

        {/* Footer - Purchase Date */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-gray-500">
            <Calendar size={14} />
            <span className="text-xs">Purchased: {formatDate(investment.purchaseDate)}</span>
          </div>

          {/* View Details Arrow */}
          <div className="text-indigo-600 group-hover:translate-x-1 transition-transform">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
});

InvestmentCard.displayName = 'InvestmentCard';

export default InvestmentCard;