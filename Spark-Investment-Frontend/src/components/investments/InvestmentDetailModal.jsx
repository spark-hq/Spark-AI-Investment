// src/components/investments/InvestmentDetailModal.jsx

import React, { useState, useMemo } from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  Calendar,
  Package,
  DollarSign,
  Activity,
  ShoppingCart,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Info,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const InvestmentDetailModal = ({ investment, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, transactions, analysis

  if (!investment) return null;

  const isProfit = investment.status === 'profit';
  const statusColor = isProfit ? 'text-green-600' : 'text-red-600';
  const statusBgColor = isProfit ? 'bg-green-50' : 'bg-red-50';

  // Format currency
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

  // Generate dummy performance data (last 6 months) - Memoized
  const performanceData = useMemo(() => {
    const data = [];
    const months = ['6mo ago', '5mo ago', '4mo ago', '3mo ago', '2mo ago', '1mo ago', 'Now'];
    const startValue = investment.investedAmount;
    const endValue = investment.currentValue;
    const diff = endValue - startValue;
    const step = diff / 6;

    for (let i = 0; i < 7; i++) {
      data.push({
        month: months[i],
        value: Math.round(startValue + step * i + (Math.random() - 0.5) * (step * 0.3)),
      });
    }
    return data;
  }, [investment.investedAmount, investment.currentValue]);

  // Generate dummy transaction history - Memoized
  const transactions = useMemo(() => {
    const txns = [
      {
        id: 'TXN001',
        type: 'Buy',
        date: investment.purchaseDate,
        quantity: investment.quantity,
        price: investment.avgPrice,
        amount: investment.investedAmount,
        status: 'Completed',
      },
    ];

    // Add some random transactions
    if (investment.quantity > 10) {
      txns.push({
        id: 'TXN002',
        type: 'Buy',
        date: new Date(new Date(investment.purchaseDate).getTime() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        quantity: Math.floor(investment.quantity * 0.3),
        price: investment.avgPrice * 1.05,
        amount: Math.floor(investment.quantity * 0.3 * investment.avgPrice * 1.05),
        status: 'Completed',
      });
    }

    return txns;
  }, [investment.purchaseDate, investment.quantity, investment.avgPrice, investment.investedAmount]);

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Drag Handle - Mobile Swipe Indicator */}
        <div className="sticky top-0 bg-white pt-3 pb-0 rounded-t-2xl z-20 flex justify-center">
          <div
            className="w-12 h-1 bg-gray-300 rounded-full"
            role="separator"
            aria-label="Swipe down to close"
          ></div>
        </div>

        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              {/* Logo */}
              <div className="text-5xl bg-white rounded-xl p-3">{investment.logo}</div>
                <p className={`p-4 rounded-xl ${statusBgColor}`}></p>
              {/* Title & Info */}
              <div>
                <h2 className="text-2xl font-bold mb-1">{investment.name}</h2>
                <p className="text-indigo-100 font-mono text-sm mb-3">{investment.symbol}</p>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPlatformColor(investment.platform)} bg-opacity-90`}>
                    {investment.platform}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white bg-opacity-20">
                    {investment.type}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white bg-opacity-20">
                    {investment.sector}
                  </span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50">
          {/* Invested Amount */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 font-medium">Invested</p>
              <DollarSign size={16} className="text-blue-600" />
            </div>
            <p className="text-lg font-bold text-gray-800">{formatCurrency(investment.investedAmount)}</p>
          </div>

          {/* Current Value */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 font-medium">Current Value</p>
              <Wallet size={16} className="text-purple-600" />
            </div>
            <p className="text-lg font-bold text-gray-800">{formatCurrency(investment.currentValue)}</p>
          </div>

          {/* Returns */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 font-medium">Returns</p>
              {isProfit ? (
                <TrendingUp size={16} className="text-green-600" />
              ) : (
                <TrendingDown size={16} className="text-red-600" />
              )}
            </div>
            <p className={`text-lg font-bold ${statusColor}`}>
              {isProfit ? '+' : ''}
              {formatCurrency(investment.returns)}
            </p>
            <p className={`text-xs font-semibold ${statusColor}`}>
              ({isProfit ? '+' : ''}
              {investment.returnsPercentage}%)
            </p>
          </div>

          {/* Quantity */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 font-medium">Quantity</p>
              <Package size={16} className="text-orange-600" />
            </div>
            <p className="text-lg font-bold text-gray-800">{investment.quantity}</p>
            <p className="text-xs text-gray-500">units</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex space-x-4 sm:space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-3 sm:px-4 font-medium transition-all relative min-h-[44px] active:scale-95 ${
                activeTab === 'overview' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700 active:text-gray-900'
              }`}
            >
              Overview
              {activeTab === 'overview' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-3 px-3 sm:px-4 font-medium transition-all relative min-h-[44px] active:scale-95 ${
                activeTab === 'transactions' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700 active:text-gray-900'
              }`}
            >
              Transactions
              {activeTab === 'transactions' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`py-3 px-3 sm:px-4 font-medium transition-all relative min-h-[44px] active:scale-95 ${
                activeTab === 'analysis' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700 active:text-gray-900'
              }`}
            >
              Analysis
              {activeTab === 'analysis' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t"></div>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Performance Chart */}
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Activity className="mr-2 text-indigo-600" size={20} />
                  Performance (Last 6 Months)
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isProfit ? '#10b981' : '#ef4444'} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={isProfit ? '#10b981' : '#ef4444'} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '2px solid #e5e7eb', borderRadius: '8px' }}
                      formatter={(value) => formatCurrency(value)}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={isProfit ? '#10b981' : '#ef4444'}
                      strokeWidth={3}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Price Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-100">
                  <h4 className="text-sm font-medium text-gray-600 mb-3">Average Purchase Price</h4>
                  <p className="text-3xl font-bold text-gray-800">{formatCurrency(investment.avgPrice)}</p>
                  <p className="text-sm text-gray-600 mt-2">per unit</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-100">
                  <h4 className="text-sm font-medium text-gray-600 mb-3">Current Market Price</h4>
                  <p className="text-3xl font-bold text-gray-800">{formatCurrency(investment.currentPrice)}</p>
                  <p className="text-sm text-gray-600 mt-2">per unit</p>
                </div>
              </div>

              {/* Purchase Details */}
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <h4 className="text-sm font-medium text-gray-600 mb-4 flex items-center">
                  <Calendar className="mr-2 text-indigo-600" size={18} />
                  Purchase Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Purchase Date</p>
                    <p className="text-sm font-semibold text-gray-800">{formatDate(investment.purchaseDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Holding Period</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {Math.floor((new Date() - new Date(investment.purchaseDate)) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TRANSACTIONS TAB */}
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Transaction History</h3>
              {transactions.map((txn) => (
                <div key={txn.id} className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-indigo-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`${
                          txn.type === 'Buy' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        } p-3 rounded-lg`}
                      >
                        {txn.type === 'Buy' ? <ArrowDownRight size={24} /> : <ArrowUpRight size={24} />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{txn.type}</p>
                        <p className="text-sm text-gray-500">{formatDate(txn.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">{formatCurrency(txn.amount)}</p>
                      <p className="text-sm text-gray-500">
                        {txn.quantity} units @ {formatCurrency(txn.price)}
                      </p>
                      <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                        {txn.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ANALYSIS TAB */}
          {activeTab === 'analysis' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                <div className="flex items-start space-x-3">
                  <Info className="text-indigo-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">AI Analysis Coming Soon!</h4>
                    <p className="text-sm text-gray-600">
                      Our AI will provide detailed analysis including pros & cons, risk assessment, predictions (±5 years),
                      sector analysis, and personalized recommendations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Annualized Return</p>
                  <p className={`text-2xl font-bold ${statusColor}`}>
                    {(
                      (investment.returnsPercentage /
                        Math.max(1, Math.floor((new Date() - new Date(investment.purchaseDate)) / (1000 * 60 * 60 * 24 * 365)))) *
                      1
                    ).toFixed(2)}
                    %
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Risk Level</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {investment.type === 'Crypto' ? 'High' : investment.type === 'Stock' ? 'Medium' : 'Low'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t-2 border-gray-200 p-6 rounded-b-2xl">
          <div className="flex space-x-4">
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2">
              <ShoppingCart size={20} />
              <span>Buy More</span>
            </button>
            <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2">
              <ArrowUpRight size={20} />
              <span>Sell</span>
            </button>
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDetailModal;