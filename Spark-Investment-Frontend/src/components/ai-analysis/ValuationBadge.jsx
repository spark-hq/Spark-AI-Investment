// src/components/ai-analysis/ValuationBadge.jsx

import React from 'react';
import { DollarSign, TrendingDown, TrendingUp, Minus } from 'lucide-react';

const ValuationBadge = ({ valuation, valuationScore }) => {
  // Get valuation style
  const getValuationStyle = () => {
    switch (valuation) {
      case 'Undervalued':
        return {
          bg: 'from-green-600 to-emerald-600',
          lightBg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-600',
          icon: TrendingDown,
          emoji: '💎',
          description: 'Trading below intrinsic value - potential buying opportunity',
        };
      case 'Fair':
        return {
          bg: 'from-blue-600 to-indigo-600',
          lightBg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-600',
          icon: Minus,
          emoji: '⚖️',
          description: 'Trading at fair value - reasonably priced',
        };
      case 'Overvalued':
        return {
          bg: 'from-red-600 to-pink-600',
          lightBg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-600',
          icon: TrendingUp,
          emoji: '⚠️',
          description: 'Trading above intrinsic value - exercise caution',
        };
      default:
        return {
          bg: 'from-gray-600 to-gray-700',
          lightBg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-600',
          icon: DollarSign,
          emoji: '❓',
          description: 'Valuation analysis in progress',
        };
    }
  };

  const style = getValuationStyle();
  const ValuationIcon = style.icon;

  return (
    <div className={`${style.lightBg} rounded-xl p-6 border-2 ${style.border} hover-lift`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Valuation Analysis</h3>
        <div className={`bg-gradient-to-r ${style.bg} p-2 rounded-lg`}>
          <DollarSign className="text-white" size={20} />
        </div>
      </div>

      {/* Valuation Badge */}
      <div className="flex items-center justify-center mb-6">
        <div className={`bg-gradient-to-r ${style.bg} text-white px-8 py-4 rounded-2xl shadow-xl`}>
          <div className="text-center">
            <div className="text-4xl mb-2">{style.emoji}</div>
            <div className="text-2xl font-bold mb-1">{valuation}</div>
            <div className="flex items-center justify-center space-x-2 text-sm opacity-90">
              <ValuationIcon size={16} />
              <span>Score: {valuationScore}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Valuation Bar */}
      <div className="mb-6">
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
          {/* Gradient bar */}
          <div
            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${style.bg} transition-all duration-1000`}
            style={{ width: `${valuationScore}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
          </div>
        </div>
        
        {/* Scale markers */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>0</span>
          <span>Undervalued</span>
          <span>Fair</span>
          <span>Overvalued</span>
          <span>100</span>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-700 leading-relaxed text-center">
          {style.description}
        </p>
      </div>

      {/* Interpretation Guide */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Undervalued (0-40): Good entry point</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Fair (40-70): Reasonably priced</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Overvalued (70-100): Exercise caution</span>
        </div>
      </div>
    </div>
  );
};

export default ValuationBadge;