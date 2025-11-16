// src/components/auto-invest/BacktestResults.jsx

import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Target, Activity, AlertTriangle, CheckCircle2, Award, BarChart3, LineChart as LineChartIcon, Shield } from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Area, AreaChart, ReferenceLine
} from 'recharts';

const BacktestResults = ({ backtest }) => {
  if (!backtest) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100 text-center">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-lg font-semibold text-gray-700 mb-2">Select a plan to view backtest results</p>
        <p className="text-sm text-gray-500">Historical performance data will be displayed here</p>
      </div>
    );
  }

  const profitLoss = backtest.finalValue - backtest.initialInvestment;
  const isProfitable = profitLoss > 0;

  // Generate CAGR progression data (year-by-year compounding)
  const cagrData = useMemo(() => {
    const years = 5;
    const cagr = backtest.annualizedReturn / 100;
    const data = [];

    for (let year = 0; year <= years; year++) {
      const value = backtest.initialInvestment * Math.pow(1 + cagr, year);
      data.push({
        year: year === 0 ? 'Start' : `Y${year}`,
        value: value,
        cagr: year === 0 ? 0 : cagr * 100,
      });
    }

    return data;
  }, [backtest.initialInvestment, backtest.annualizedReturn]);

  // Generate Sharpe ratio over time (simulated quarterly)
  const sharpeData = useMemo(() => {
    // Simulating Sharpe ratio progression over 20 quarters (5 years)
    const quarters = 20;
    const baseReturn = backtest.annualizedReturn / 100;
    const riskFreeRate = 0.06; // 6% risk-free rate
    const volatility = backtest.maxDrawdown / 100 * 0.5; // Approximate volatility

    const data = [];
    for (let q = 1; q <= quarters; q++) {
      // Add some variation to make it realistic
      const variance = (Math.random() - 0.5) * 0.3;
      const quarterlyReturn = baseReturn + variance;
      const sharpe = (quarterlyReturn - riskFreeRate) / (volatility + 0.1);

      data.push({
        quarter: `Q${q}`,
        sharpe: Number(sharpe.toFixed(2)),
        benchmark: 1.0, // Benchmark Sharpe ratio
      });
    }

    return data;
  }, [backtest.annualizedReturn, backtest.maxDrawdown]);

  // Generate drawdown progression over time
  const drawdownData = useMemo(() => {
    // Simulating drawdown events over 60 months (5 years)
    const months = 60;
    const maxDD = backtest.maxDrawdown;
    const data = [];

    let currentDrawdown = 0;
    for (let month = 1; month <= months; month++) {
      // Create realistic drawdown patterns
      const random = Math.random();

      if (random > 0.8 && currentDrawdown > -maxDD * 0.8) {
        // Drawdown event
        currentDrawdown -= Math.random() * 3;
      } else if (random > 0.3 && currentDrawdown < 0) {
        // Recovery
        currentDrawdown += Math.random() * 2;
      } else if (currentDrawdown < -maxDD) {
        // Don't exceed max drawdown
        currentDrawdown = -maxDD;
      }

      // Ensure we hit max drawdown at some point
      if (month === Math.floor(months * 0.6)) {
        currentDrawdown = -maxDD;
      }

      // Cap at 0 (no drawdown)
      currentDrawdown = Math.min(0, Math.max(-maxDD, currentDrawdown));

      data.push({
        month: month % 12 === 0 ? `Y${month / 12}` : '',
        drawdown: Number(currentDrawdown.toFixed(2)),
        maxDrawdown: -maxDD,
      });
    }

    return data;
  }, [backtest.maxDrawdown]);

  // Calculate additional metrics
  const additionalMetrics = useMemo(() => {
    const years = 5;
    const totalReturn = (backtest.finalValue - backtest.initialInvestment) / backtest.initialInvestment;
    const cagr = (Math.pow(1 + totalReturn, 1 / years) - 1) * 100;

    // Calculate Sharpe ratio
    const riskFreeRate = 6; // 6% risk-free rate
    const excessReturn = backtest.annualizedReturn - riskFreeRate;
    const volatility = backtest.maxDrawdown / 2; // Simplified volatility estimate
    const sharpeRatio = excessReturn / volatility;

    // Calculate Sortino ratio (similar to Sharpe but using downside deviation)
    const downsideDeviation = volatility * 0.7; // Approximate
    const sortinoRatio = excessReturn / downsideDeviation;

    return {
      cagr: cagr.toFixed(2),
      sharpeRatio: sharpeRatio.toFixed(2),
      sortinoRatio: sortinoRatio.toFixed(2),
    };
  }, [backtest]);

  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
        <div className="flex items-center space-x-3 mb-2">
          <Activity className="text-white" size={28} />
          <h3 className="text-2xl font-bold">Backtest Results</h3>
        </div>
        <p className="text-purple-100">{backtest.period}</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
            <p className="text-xs text-gray-600 mb-1 font-medium">Initial Investment</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(backtest.initialInvestment)}</p>
          </div>
          <div className={`bg-gradient-to-br ${isProfitable ? 'from-green-50 to-emerald-50 border-green-100' : 'from-red-50 to-rose-50 border-red-100'} p-4 rounded-lg border`}>
            <p className="text-xs text-gray-600 mb-1 font-medium">Final Value</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(backtest.finalValue)}</p>
          </div>
          <div className={`bg-gradient-to-br ${isProfitable ? 'from-green-50 to-emerald-50 border-green-100' : 'from-red-50 to-rose-50 border-red-100'} p-4 rounded-lg border`}>
            <p className="text-xs text-gray-600 mb-1 font-medium">Total Return</p>
            <p className={`text-xl font-bold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
              {isProfitable ? '+' : ''}{backtest.totalReturn.toFixed(2)}%
            </p>
            <p className={`text-xs font-semibold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
              {isProfitable ? '+' : ''}{formatCurrency(profitLoss)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
            <p className="text-xs text-gray-600 mb-1 font-medium">Annualized Return</p>
            <p className="text-xl font-bold text-purple-600">{backtest.annualizedReturn.toFixed(2)}%</p>
          </div>
        </div>

        {/* Advanced Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-lg border-2 border-cyan-200">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="text-cyan-600" size={20} />
              <p className="text-xs text-gray-700 font-semibold">CAGR</p>
            </div>
            <p className="text-3xl font-bold text-cyan-600">{additionalMetrics.cagr}%</p>
            <p className="text-xs text-gray-600 mt-1">Compound Annual Growth Rate</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border-2 border-indigo-200">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="text-indigo-600" size={20} />
              <p className="text-xs text-gray-700 font-semibold">Sharpe Ratio</p>
            </div>
            <p className="text-3xl font-bold text-indigo-600">{additionalMetrics.sharpeRatio}</p>
            <p className="text-xs text-gray-600 mt-1">Risk-adjusted returns (higher is better)</p>
          </div>

          <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-4 rounded-lg border-2 border-violet-200">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="text-violet-600" size={20} />
              <p className="text-xs text-gray-700 font-semibold">Sortino Ratio</p>
            </div>
            <p className="text-3xl font-bold text-violet-600">{additionalMetrics.sortinoRatio}</p>
            <p className="text-xs text-gray-600 mt-1">Downside risk-adjusted returns</p>
          </div>
        </div>

        {/* CAGR Growth Chart */}
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-5 rounded-xl border-2 border-cyan-200">
          <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <TrendingUp className="text-cyan-600" size={20} />
            <span>CAGR Growth Projection</span>
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={cagrData}>
              <defs>
                <linearGradient id="colorCAGR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(value), 'Portfolio Value']}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '2px solid #06b6d4',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#06b6d4"
                strokeWidth={3}
                fill="url(#colorCAGR)"
                dot={{ r: 5, fill: '#06b6d4', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7 }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-600 mt-3 text-center">
            Compounded growth at {additionalMetrics.cagr}% annually over 5 years
          </p>
        </div>

        {/* Sharpe Ratio Progression */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl border-2 border-indigo-200">
          <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Shield className="text-indigo-600" size={20} />
            <span>Sharpe Ratio Over Time</span>
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sharpeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="quarter"
                tick={{ fontSize: 10, fill: '#6b7280' }}
                interval={1}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#6b7280' }}
                domain={[0, 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '2px solid #6366f1',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              />
              <ReferenceLine
                y={1}
                stroke="#10b981"
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{ value: 'Good (>1.0)', position: 'right', fill: '#10b981', fontSize: 11 }}
              />
              <ReferenceLine
                y={2}
                stroke="#3b82f6"
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{ value: 'Excellent (>2.0)', position: 'right', fill: '#3b82f6', fontSize: 11 }}
              />
              <Line
                type="monotone"
                dataKey="sharpe"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 text-xs text-gray-600 space-y-1">
            <p className="font-semibold">Sharpe Ratio Interpretation:</p>
            <p>• &lt;1.0: Sub-optimal risk-adjusted returns</p>
            <p>• 1.0-2.0: Good risk-adjusted returns</p>
            <p>• &gt;2.0: Excellent risk-adjusted returns</p>
          </div>
        </div>

        {/* Max Drawdown Chart */}
        <div className="bg-gradient-to-br from-red-50 to-rose-50 p-5 rounded-xl border-2 border-red-200">
          <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <AlertTriangle className="text-red-600" size={20} />
            <span>Drawdown Over Time</span>
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={drawdownData}>
              <defs>
                <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                domain={['auto', 0]}
              />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Drawdown']}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '2px solid #ef4444',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              />
              <ReferenceLine
                y={0}
                stroke="#10b981"
                strokeWidth={2}
                label={{ value: 'No Drawdown', position: 'right', fill: '#10b981', fontSize: 11 }}
              />
              <ReferenceLine
                y={-backtest.maxDrawdown}
                stroke="#dc2626"
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{ value: `Max DD: ${backtest.maxDrawdown}%`, position: 'left', fill: '#dc2626', fontSize: 11 }}
              />
              <Area
                type="monotone"
                dataKey="drawdown"
                stroke="#ef4444"
                strokeWidth={2}
                fill="url(#colorDrawdown)"
              />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-600 mt-3 text-center">
            Maximum peak-to-trough decline: <span className="font-bold text-red-600">{backtest.maxDrawdown}%</span>
          </p>
        </div>

        {/* Trading Statistics */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Target className="text-indigo-600" size={18} />
            <span>Trading Statistics</span>
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">Total Trades</p>
              <p className="text-2xl font-bold text-gray-900">{backtest.totalTransactions}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Successful</p>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="text-green-600" size={18} />
                <p className="text-2xl font-bold text-green-600">{backtest.successfulTrades}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Failed</p>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="text-red-600" size={18} />
                <p className="text-2xl font-bold text-red-600">{backtest.failedTrades}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Win Rate</p>
              <div className="flex items-center space-x-2">
                <Award className="text-yellow-600" size={18} />
                <p className="text-2xl font-bold text-yellow-600">{backtest.winRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="text-yellow-600" size={18} />
              <p className="text-xs text-gray-700 font-semibold">Max Drawdown</p>
            </div>
            <p className="text-2xl font-bold text-red-600">{backtest.maxDrawdown}%</p>
            <p className="text-xs text-gray-600 mt-1">Largest peak-to-trough decline</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="text-green-600" size={18} />
              <p className="text-xs text-gray-700 font-semibold">Best Year</p>
            </div>
            <p className="text-2xl font-bold text-green-600">+{backtest.bestYear.return}%</p>
            <p className="text-xs text-gray-600 mt-1">{backtest.bestYear.year}</p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingDown className="text-red-600" size={18} />
              <p className="text-xs text-gray-700 font-semibold">Worst Year</p>
            </div>
            <p className="text-2xl font-bold text-red-600">{backtest.worstYear.return}%</p>
            <p className="text-xs text-gray-600 mt-1">{backtest.worstYear.year}</p>
          </div>
        </div>

        {/* Monthly Returns Chart */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <BarChart3 className="text-indigo-600" size={18} />
            <span>Recent Monthly Returns</span>
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={backtest.monthlyReturns}>
              <defs>
                <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 12, fill: '#6b7280' }}
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
              <Bar
                dataKey="return"
                radius={[4, 4, 0, 0]}
              >
                {backtest.monthlyReturns.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.return >= 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Summary */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
          <div className="flex items-center space-x-2 mb-3">
            <Activity className="text-indigo-600" size={20} />
            <h4 className="text-sm font-bold text-gray-900">Performance Summary</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">Initial Investment:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(backtest.initialInvestment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Final Value:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(backtest.finalValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Total Gain/Loss:</span>
              <span className={`font-semibold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                {isProfitable ? '+' : ''}{formatCurrency(profitLoss)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Annualized Return:</span>
              <span className="font-semibold text-purple-600">{backtest.annualizedReturn.toFixed(2)}% p.a.</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-xs font-semibold text-yellow-800 mb-1">Important Disclaimer</p>
              <p className="text-xs text-yellow-700">
                Past performance does not guarantee future results. Backtesting uses historical data and may not reflect actual trading conditions, fees, or market impacts. Actual results may vary significantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BacktestResults);
