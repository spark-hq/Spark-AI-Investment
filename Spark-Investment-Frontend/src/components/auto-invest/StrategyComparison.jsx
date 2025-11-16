// src/components/auto-invest/StrategyComparison.jsx

import React, { useState, useMemo } from 'react';
import { GitCompare, TrendingUp, TrendingDown, Shield, AlertTriangle, Award, Target, BarChart3, CheckCircle } from 'lucide-react';
import Card from '../ui/StockCard';
import { formatCurrency } from '../../utils/calculations';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const StrategyComparison = ({ strategies = [], backtestResults = {} }) => {
  const [selectedStrategies, setSelectedStrategies] = useState([]);

  // Toggle strategy selection (max 3 strategies)
  const toggleStrategy = (strategyId) => {
    setSelectedStrategies((prev) => {
      if (prev.includes(strategyId)) {
        return prev.filter((id) => id !== strategyId);
      } else if (prev.length < 3) {
        return [...prev, strategyId];
      } else {
        // Replace the first selected strategy if already at max
        return [...prev.slice(1), strategyId];
      }
    });
  };

  // Get comparison data for selected strategies
  const comparisonData = useMemo(() => {
    return selectedStrategies.map((strategyId) => {
      const strategy = strategies.find((s) => s.id === strategyId);
      const backtest = backtestResults[strategyId];

      if (!strategy || !backtest) return null;

      // Calculate additional metrics
      const years = 5;
      const totalReturn = (backtest.finalValue - backtest.initialInvestment) / backtest.initialInvestment;
      const cagr = (Math.pow(1 + totalReturn, 1 / years) - 1) * 100;
      const riskFreeRate = 6;
      const excessReturn = backtest.annualizedReturn - riskFreeRate;
      const volatility = backtest.maxDrawdown / 2;
      const sharpeRatio = excessReturn / volatility;

      return {
        id: strategyId,
        name: strategy.name,
        icon: strategy.icon,
        riskProfile: strategy.riskProfile,
        initialInvestment: backtest.initialInvestment,
        finalValue: backtest.finalValue,
        totalReturn: backtest.totalReturn,
        annualizedReturn: backtest.annualizedReturn,
        cagr: cagr,
        sharpeRatio: sharpeRatio,
        maxDrawdown: backtest.maxDrawdown,
        winRate: backtest.winRate,
        totalTrades: backtest.totalTransactions,
        profitLoss: backtest.finalValue - backtest.initialInvestment,
      };
    }).filter(Boolean);
  }, [selectedStrategies, strategies, backtestResults]);

  // Prepare radar chart data for risk/return profile
  const radarChartData = useMemo(() => {
    if (comparisonData.length === 0) return [];

    const metrics = ['Return', 'Risk Adj.', 'Win Rate', 'Consistency', 'Safety'];

    return metrics.map((metric) => {
      const dataPoint = { metric };

      comparisonData.forEach((strategy) => {
        let value;
        switch (metric) {
          case 'Return':
            value = Math.min(100, (strategy.annualizedReturn / 30) * 100);
            break;
          case 'Risk Adj.':
            value = Math.min(100, (strategy.sharpeRatio / 3) * 100);
            break;
          case 'Win Rate':
            value = strategy.winRate;
            break;
          case 'Consistency':
            value = Math.max(0, 100 - strategy.maxDrawdown * 2);
            break;
          case 'Safety':
            value = Math.max(0, 100 - strategy.maxDrawdown);
            break;
          default:
            value = 50;
        }
        dataPoint[strategy.name] = Math.max(0, Math.min(100, value));
      });

      return dataPoint;
    });
  }, [comparisonData]);

  // Prepare bar chart data for returns comparison
  const returnsChartData = useMemo(() => {
    return comparisonData.map((strategy) => ({
      name: strategy.name,
      return: strategy.totalReturn,
      cagr: strategy.cagr,
    }));
  }, [comparisonData]);

  // Find best and worst performers
  const bestWorst = useMemo(() => {
    if (comparisonData.length === 0) return null;

    const sortedByReturn = [...comparisonData].sort((a, b) => b.totalReturn - a.totalReturn);
    const sortedBySharpe = [...comparisonData].sort((a, b) => b.sharpeRatio - a.sharpeRatio);
    const sortedByDrawdown = [...comparisonData].sort((a, b) => a.maxDrawdown - b.maxDrawdown);

    return {
      bestReturn: sortedByReturn[0],
      worstReturn: sortedByReturn[sortedByReturn.length - 1],
      bestSharpe: sortedBySharpe[0],
      bestRisk: sortedByDrawdown[0],
    };
  }, [comparisonData]);

  const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b'];

  const ComparisonCard = ({ strategy, index }) => {
    const isProfitable = strategy.profitLoss > 0;

    return (
      <Card className={`border-2 ${index === 0 ? 'border-indigo-300' : index === 1 ? 'border-pink-300' : 'border-green-300'} hover-lift`}>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{strategy.icon}</span>
              <h3 className="text-lg font-bold text-gray-900">{strategy.name}</h3>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              strategy.riskProfile === 'Low' ? 'bg-green-100 text-green-700' :
              strategy.riskProfile === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {strategy.riskProfile} Risk
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Returns Section */}
          <div className={`bg-gradient-to-br ${isProfitable ? 'from-green-50 to-emerald-50' : 'from-red-50 to-rose-50'} p-3 rounded-lg border ${isProfitable ? 'border-green-200' : 'border-red-200'}`}>
            <p className="text-xs text-gray-600 mb-1 font-medium">Total Return</p>
            <p className={`text-2xl font-bold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
              {isProfitable ? '+' : ''}{strategy.totalReturn.toFixed(2)}%
            </p>
            <p className={`text-xs font-semibold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
              {isProfitable ? '+' : ''}{formatCurrency(strategy.profitLoss)}
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 p-2 rounded border border-blue-200">
              <p className="text-xs text-gray-600">CAGR</p>
              <p className="text-lg font-bold text-blue-600">{strategy.cagr.toFixed(1)}%</p>
            </div>
            <div className="bg-purple-50 p-2 rounded border border-purple-200">
              <p className="text-xs text-gray-600">Sharpe</p>
              <p className="text-lg font-bold text-purple-600">{strategy.sharpeRatio.toFixed(2)}</p>
            </div>
            <div className="bg-red-50 p-2 rounded border border-red-200">
              <p className="text-xs text-gray-600">Max DD</p>
              <p className="text-lg font-bold text-red-600">{strategy.maxDrawdown}%</p>
            </div>
            <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
              <p className="text-xs text-gray-600">Win Rate</p>
              <p className="text-lg font-bold text-yellow-600">{strategy.winRate.toFixed(1)}%</p>
            </div>
          </div>

          {/* Investment Details */}
          <div className="bg-gray-50 p-2 rounded text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Initial:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(strategy.initialInvestment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Final:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(strategy.finalValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Trades:</span>
              <span className="font-semibold text-gray-900">{strategy.totalTrades}</span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  if (strategies.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200">
        <div className="text-center py-8">
          <GitCompare className="mx-auto text-gray-400 mb-3" size={48} />
          <h3 className="text-lg font-bold text-gray-700 mb-2">No Strategies Available</h3>
          <p className="text-sm text-gray-600">Add investment strategies to compare them</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GitCompare size={28} />
            <div>
              <h3 className="text-2xl font-bold">Strategy Comparison</h3>
              <p className="text-indigo-100 text-sm">Select up to 3 strategies to compare side-by-side</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm">
            <span className="text-sm font-semibold">{selectedStrategies.length}/3 Selected</span>
          </div>
        </div>
      </Card>

      {/* Strategy Selector */}
      <div className="bg-white rounded-xl shadow-md p-4 border-2 border-gray-100">
        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center space-x-2">
          <Target className="text-indigo-600" size={18} />
          <span>Select Strategies to Compare</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {strategies.map((strategy) => (
            <button
              key={strategy.id}
              onClick={() => toggleStrategy(strategy.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                selectedStrategies.includes(strategy.id)
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{strategy.icon}</span>
              <span>{strategy.name}</span>
              {selectedStrategies.includes(strategy.id) && <CheckCircle size={16} />}
            </button>
          ))}
        </div>
      </div>

      {comparisonData.length === 0 ? (
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
          <div className="text-center py-12">
            <GitCompare className="mx-auto text-indigo-400 mb-3" size={64} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Select Strategies to Compare</h3>
            <p className="text-gray-600">Choose 2-3 strategies from above to see detailed comparison</p>
          </div>
        </Card>
      ) : (
        <>
          {/* Side-by-Side Comparison Cards */}
          <div className={`grid grid-cols-1 ${comparisonData.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6`}>
            {comparisonData.map((strategy, index) => (
              <ComparisonCard key={strategy.id} strategy={strategy} index={index} />
            ))}
          </div>

          {/* Best Performers */}
          {bestWorst && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="text-green-600" size={20} />
                  <h4 className="text-sm font-bold text-gray-900">Highest Returns</h4>
                </div>
                <p className="text-xl font-bold text-green-600">{bestWorst.bestReturn.name}</p>
                <p className="text-sm text-gray-600 mt-1">
                  +{bestWorst.bestReturn.totalReturn.toFixed(2)}% total return
                </p>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="text-indigo-600" size={20} />
                  <h4 className="text-sm font-bold text-gray-900">Best Risk-Adjusted</h4>
                </div>
                <p className="text-xl font-bold text-indigo-600">{bestWorst.bestSharpe.name}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Sharpe Ratio: {bestWorst.bestSharpe.sharpeRatio.toFixed(2)}
                </p>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="text-blue-600" size={20} />
                  <h4 className="text-sm font-bold text-gray-900">Lowest Risk</h4>
                </div>
                <p className="text-xl font-bold text-blue-600">{bestWorst.bestRisk.name}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Max Drawdown: {bestWorst.bestRisk.maxDrawdown}%
                </p>
              </Card>
            </div>
          )}

          {/* Radar Chart - Risk/Return Profile */}
          {comparisonData.length >= 2 && (
            <Card className="border-2 border-indigo-100">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <BarChart3 className="text-indigo-600" size={20} />
                <span>Risk/Return Profile Comparison</span>
              </h4>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarChartData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  {comparisonData.map((strategy, index) => (
                    <Radar
                      key={strategy.id}
                      name={strategy.name}
                      dataKey={strategy.name}
                      stroke={colors[index]}
                      fill={colors[index]}
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  ))}
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-600 text-center mt-3">
                Higher values indicate better performance in each category (scale: 0-100)
              </p>
            </Card>
          )}

          {/* Returns Comparison Bar Chart */}
          {comparisonData.length >= 2 && (
            <Card className="border-2 border-purple-100">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <TrendingUp className="text-purple-600" size={20} />
                <span>Returns Comparison</span>
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={returnsChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    formatter={(value) => `${value.toFixed(2)}%`}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="return" name="Total Return" radius={[8, 8, 0, 0]}>
                    {returnsChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index]} />
                    ))}
                  </Bar>
                  <Bar dataKey="cagr" name="CAGR" radius={[8, 8, 0, 0]}>
                    {returnsChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index]} opacity={0.6} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default React.memo(StrategyComparison);
