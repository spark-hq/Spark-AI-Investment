// src/components/ai-analysis/RiskMeter.jsx

import React from 'react';
import { AlertTriangle, Shield, TrendingUp } from 'lucide-react';

const RiskMeter = ({ riskLevel, riskScore, volatility }) => {
  // Get color based on risk level
  const getRiskColor = () => {
    switch (riskLevel) {
      case 'Low':
        return {
          bg: 'from-green-500 to-emerald-500',
          text: 'text-green-600',
          lightBg: 'bg-green-50',
          border: 'border-green-200',
          icon: Shield,
        };
      case 'Medium':
        return {
          bg: 'from-yellow-500 to-orange-500',
          text: 'text-yellow-600',
          lightBg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: TrendingUp,
        };
      case 'High':
        return {
          bg: 'from-red-500 to-pink-500',
          text: 'text-red-600',
          lightBg: 'bg-red-50',
          border: 'border-red-200',
          icon: AlertTriangle,
        };
      default:
        return {
          bg: 'from-gray-500 to-gray-600',
          text: 'text-gray-600',
          lightBg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: Shield,
        };
    }
  };

  const riskColors = getRiskColor();
  const RiskIcon = riskColors.icon;
  
  // Calculate percentage for gauge (0-100)
  const percentage = (riskScore / 10) * 100;

  return (
    <div className={`${riskColors.lightBg} rounded-xl p-6 border-2 ${riskColors.border}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Risk Assessment</h3>
        <div className={`bg-gradient-to-r ${riskColors.bg} p-2 rounded-lg`}>
          <RiskIcon className="text-white" size={20} />
        </div>
      </div>

      {/* Risk Level Badge */}
      <div className="flex items-center justify-center mb-6">
        <div className={`bg-gradient-to-r ${riskColors.bg} text-white px-6 py-3 rounded-full shadow-lg`}>
          <span className="text-2xl font-bold">{riskLevel} Risk</span>
        </div>
      </div>

      {/* Risk Score Gauge */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Risk Score</span>
          <span className={`text-2xl font-bold ${riskColors.text}`}>
            {riskScore}/10
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${riskColors.bg} transition-all duration-1000 ease-out`}
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
          </div>
        </div>

        {/* Scale Labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>0 (Safe)</span>
          <span>5 (Moderate)</span>
          <span>10 (High)</span>
        </div>
      </div>

      {/* Volatility Info */}
      <div className={`bg-white rounded-lg p-4 border ${riskColors.border}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Volatility</p>
            <p className={`font-bold ${riskColors.text}`}>{volatility}</p>
          </div>
          <div className={`${riskColors.lightBg} px-3 py-1 rounded-full`}>
            <span className={`text-xs font-semibold ${riskColors.text}`}>
              {riskScore < 4 ? '●●○○○' : riskScore < 7 ? '●●●○○' : '●●●●●'}
            </span>
          </div>
        </div>
      </div>

      {/* Risk Description */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {riskLevel === 'Low' && 'Stable investment with minimal volatility'}
          {riskLevel === 'Medium' && 'Balanced risk-reward profile'}
          {riskLevel === 'High' && 'Significant price fluctuations expected'}
        </p>
      </div>
    </div>
  );
};

export default RiskMeter;