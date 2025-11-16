// src/components/ai-analysis/AnalysisCard.jsx

import React from 'react';
import { Target, Shield, TrendingUp, TrendingDown, Brain, Sparkles, BarChart3 } from 'lucide-react';

const AnalysisCard = ({ analysis, formatCurrency }) => {
  // Get recommendation color
  const getRecommendationStyle = (recommendation) => {
    const styles = {
      'Strong Buy': {
        bg: 'from-green-600 to-emerald-600',
        text: 'text-green-600',
        lightBg: 'bg-green-50',
        border: 'border-green-200',
        icon: '🚀',
      },
      'Buy': {
        bg: 'from-green-500 to-green-600',
        text: 'text-green-600',
        lightBg: 'bg-green-50',
        border: 'border-green-200',
        icon: '📈',
      },
      'Hold': {
        bg: 'from-yellow-500 to-orange-500',
        text: 'text-yellow-600',
        lightBg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: '⏸️',
      },
      'Sell': {
        bg: 'from-red-500 to-red-600',
        text: 'text-red-600',
        lightBg: 'bg-red-50',
        border: 'border-red-200',
        icon: '📉',
      },
      'Strong Sell': {
        bg: 'from-red-600 to-pink-600',
        text: 'text-red-600',
        lightBg: 'bg-red-50',
        border: 'border-red-200',
        icon: '⚠️',
      },
    };
    return styles[recommendation] || styles['Hold'];
  };

  const recStyle = getRecommendationStyle(analysis.recommendation);

  return (
    <div className="space-y-6 z-0">
      {/* Recommendation Card */}
      <div className={`bg-gradient-to-r ${recStyle.bg} text-white rounded-xl p-6 shadow-xl hover-lift overflow-hidden relative`}>
        <div className="absolute inset-0 bg-white opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
                <Brain className="text-white" size={32} />
              </div>
              <div>
                <p className="text-white opacity-90 text-sm">AI Recommendation</p>
                <h3 className="text-3xl font-bold flex items-center space-x-2">
                  <span>{recStyle.icon}</span>
                  <span>{analysis.recommendation}</span>
                </h3>
              </div>
            </div>
            
            {/* Confidence Badge */}
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full backdrop-blur-sm">
              <div className="text-center">
                <p className="text-xs opacity-90">Confidence</p>
                <p className="text-2xl font-bold">{analysis.confidence}%</p>
              </div>
            </div>
          </div>

          {/* Target & Stop Loss */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white bg-opacity-10 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-1">
                <Target size={16} />
                <p className="text-sm opacity-90">Target Price</p>
              </div>
              <p className="text-xl font-bold">{formatCurrency(analysis.targetPrice)}</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-1">
                <Shield size={16} />
                <p className="text-sm opacity-90">Stop Loss</p>
              </div>
              <p className="text-xl font-bold">{formatCurrency(analysis.stopLoss)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      {analysis.keyMetrics && (
        <div className="bg-white rounded-xl p-6 border-2 border-indigo-100 shadow-md">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="text-indigo-600" size={24} />
            <h3 className="text-lg font-bold text-gray-900">Key Financial Metrics</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {analysis.keyMetrics.pe_ratio && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">P/E Ratio</p>
                <p className="text-lg font-bold text-indigo-600">{analysis.keyMetrics.pe_ratio}</p>
              </div>
            )}
            {analysis.keyMetrics.pb_ratio && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">P/B Ratio</p>
                <p className="text-lg font-bold text-purple-600">{analysis.keyMetrics.pb_ratio}</p>
              </div>
            )}
            {analysis.keyMetrics.roe && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">ROE</p>
                <p className="text-lg font-bold text-green-600">{analysis.keyMetrics.roe}%</p>
              </div>
            )}
            {analysis.keyMetrics.debtToEquity !== null && (
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">Debt/Equity</p>
                <p className="text-lg font-bold text-orange-600">{analysis.keyMetrics.debtToEquity}</p>
              </div>
            )}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-600 mb-1">Dividend Yield</p>
              <p className="text-lg font-bold text-yellow-600">{analysis.keyMetrics.dividendYield}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Sector Analysis */}
      <div className="bg-white rounded-xl p-6 border-2 border-blue-100 shadow-md">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Sector Analysis</h3>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
            <span className="text-sm text-gray-600">Sector</span>
            <span className="font-bold text-gray-900">{analysis.sectorAnalysis.sector}</span>
          </div>
          <div className="flex items-center justify-between bg-green-50 rounded-lg p-3">
            <span className="text-sm text-gray-600">Growth</span>
            <span className="font-bold text-green-600">{analysis.sectorAnalysis.sectorGrowth}</span>
          </div>
          <div className="flex items-center justify-between bg-purple-50 rounded-lg p-3">
            <span className="text-sm text-gray-600">Market Share</span>
            <span className="font-bold text-purple-600">{analysis.sectorAnalysis.marketShare}</span>
          </div>
          <div className="flex items-center justify-between bg-indigo-50 rounded-lg p-3">
            <span className="text-sm text-gray-600">Position</span>
            <span className="font-bold text-indigo-600">{analysis.sectorAnalysis.competitivePosition}</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-700 leading-relaxed">{analysis.sectorAnalysis.insights}</p>
        </div>
      </div>

      {/* Diversification Score */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Portfolio Diversification</h3>
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full">
            <span className="text-2xl font-bold">{analysis.diversificationScore}/10</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="relative h-3 bg-white rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-1000"
              style={{ width: `${analysis.diversificationScore * 10}%` }}
            ></div>
          </div>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed">{analysis.diversificationInsight}</p>
      </div>

      {/* Benchmark Comparison */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-100 shadow-md">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Benchmark Comparison</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(analysis.benchmarks).map(([key, benchmark]) => (
            <div key={key} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-900">{benchmark.name}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  benchmark.comparison.includes('Outperforming') 
                    ? 'bg-green-100 text-green-700' 
                    : benchmark.comparison.includes('Underperforming')
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {benchmark.comparison}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Index Performance:</span>
                  <span className="font-semibold text-gray-900">{benchmark.performance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Differential:</span>
                  <span className={`font-bold ${
                    benchmark.differential.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {benchmark.differential}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6 shadow-xl">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="animate-pulse" size={24} />
          <h3 className="text-xl font-bold">AI-Generated Insights</h3>
        </div>
        
        <div className="space-y-3">
          {analysis.aiInsights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3 bg-white bg-opacity-10 rounded-lg p-3 backdrop-blur-sm">
              <span className="text-white font-bold flex-shrink-0">{index + 1}.</span>
              <p className="text-white text-sm leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisCard;