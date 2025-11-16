// src/components/auto-invest/InvestmentPlanCard.jsx

import React, { useState } from 'react';
import {
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
  PieChart,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Star,
  AlertTriangle,
} from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const InvestmentPlanCard = React.memo(({ plan, onActivate, isActive }) => {
  const [expanded, setExpanded] = useState(false);

  // Risk level colors
  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'High':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Very High':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  // Status badge
  const getStatusBadge = (status) => {
    const badges = {
      'Recommended': 'bg-blue-500 text-white',
      'Most Popular': 'bg-purple-500 text-white',
      'Trending': 'bg-pink-500 text-white',
      'Best for Beginners': 'bg-green-500 text-white',
    };
    return badges[status] || 'bg-gray-500 text-white';
  };

  // Allocation pie chart data
  const allocationData = Object.entries(plan.allocation).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: value,
  }));

  const COLORS = {
    Stocks: '#6366f1',
    'Mutual funds': '#10b981',
    Crypto: '#f59e0b',
    Etf: '#8b5cf6',
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 transition-all ${isActive ? 'border-indigo-500 shadow-xl' : 'border-gray-200 hover:border-indigo-300'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          ></div>
        </div>

        <div className="relative z-10">
          {/* Status Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(plan.status)}`}>
              {plan.status}
            </span>
            <div className="flex items-center space-x-1 bg-white bg-opacity-20 px-3 py-1 rounded-full backdrop-blur-sm">
              <Star className="text-yellow-300" size={14} />
              <span className="text-sm font-bold">{plan.aiConfidence}% AI Match</span>
            </div>
          </div>

          {/* Plan Name */}
          <div className="flex items-center space-x-3 mb-2">
            <div className="text-5xl">{plan.icon}</div>
            <div>
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="text-indigo-100 text-sm">{plan.description}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur-sm">
              <p className="text-xs text-indigo-100 mb-1">Expected Return</p>
              <p className="text-lg font-bold">{plan.expectedReturn}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur-sm">
              <p className="text-xs text-indigo-100 mb-1">Risk Level</p>
              <p className="text-lg font-bold">{plan.riskLevel}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur-sm">
              <p className="text-xs text-indigo-100 mb-1">Time Horizon</p>
              <p className="text-lg font-bold">{plan.timeHorizon}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Investment Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <DollarSign className="text-indigo-600" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Min Investment</p>
              <p className="text-sm font-bold text-gray-900">{formatCurrency(plan.minInvestment)}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Recommended</p>
              <p className="text-sm font-bold text-gray-900">{formatCurrency(plan.recommendedInvestment)}</p>
            </div>
          </div>
        </div>

        {/* Asset Allocation Pie Chart */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center space-x-2">
            <PieChart size={16} className="text-indigo-600" />
            <span>Asset Allocation</span>
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <ResponsiveContainer width="100%" height={120}>
              <RechartsPie>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ value }) => `${value}%`}
                  labelLine={false}
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
            <div className="space-y-2">
              {allocationData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[item.name] || '#6b7280' }}></div>
                    <span className="text-gray-700 font-medium">{item.name}</span>
                  </div>
                  <span className="text-gray-900 font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="text-sm font-bold text-gray-900 mb-3">Historical Performance</h4>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-gray-600 mb-1">1 Year</p>
              <p className="text-lg font-bold text-green-600">+{plan.performance.pastYear}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">3 Years</p>
              <p className="text-lg font-bold text-green-600">+{plan.performance.past3Years}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">5 Years</p>
              <p className="text-lg font-bold text-green-600">+{plan.performance.past5Years}%</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-600 mb-1">Sharpe Ratio</p>
              <p className="text-sm font-semibold text-gray-900">{plan.performance.sharpeRatio}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Volatility</p>
              <p className="text-sm font-semibold text-gray-900">{plan.performance.volatility}%</p>
            </div>
          </div>
        </div>

        {/* Expandable Section */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-indigo-600 hover:text-indigo-700 font-semibold text-sm mb-4 transition-colors"
        >
          <span>{expanded ? 'Show Less' : 'Show More Details'}</span>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {expanded && (
          <div className="space-y-4 animate-fadeIn">
            {/* Investment Rules */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center space-x-2">
                <CheckCircle className="text-green-600" size={16} />
                <span>Investment Rules</span>
              </h4>
              <ul className="space-y-2">
                {plan.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-gray-700">
                    <span className="text-indigo-600 font-bold">"</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suitable For */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center space-x-2">
                <Shield className="text-blue-600" size={16} />
                <span>Suitable For</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {plan.suitableFor.map((item, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Detailed Asset Breakdown */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2">Asset Breakdown</h4>
              <div className="space-y-2">
                {plan.assets.map((asset, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-900">{asset.name}</p>
                      <p className="text-xs text-gray-600">{asset.examples}</p>
                    </div>
                    <span className="text-sm font-bold text-indigo-600">{asset.allocation}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => onActivate(plan)}
          disabled={isActive}
          className={`w-full mt-6 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg ${
            isActive
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
          }`}
        >
          {isActive ? 'Plan Activated ' : `Activate ${plan.name}`}
        </button>
      </div>
    </div>
  );
});

InvestmentPlanCard.displayName = 'InvestmentPlanCard';

export default InvestmentPlanCard;
