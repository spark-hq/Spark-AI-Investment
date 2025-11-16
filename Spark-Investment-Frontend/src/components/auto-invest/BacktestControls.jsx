// src/components/auto-invest/BacktestControls.jsx

import React, { useState, useCallback } from 'react';
import { Settings, Calendar, DollarSign, RefreshCw, Play, RotateCcw, TrendingUp, Percent, Clock } from 'lucide-react';
import Card from '../ui/StockCard';
import { formatCurrency } from '../../utils/calculations';

const BacktestControls = ({ onRunBacktest, isLoading = false }) => {
  const today = new Date().toISOString().split('T')[0];
  const fiveYearsAgo = new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [parameters, setParameters] = useState({
    startDate: fiveYearsAgo,
    endDate: today,
    initialCapital: 100000,
    rebalanceFrequency: 'monthly', // monthly, quarterly, yearly
    transactionCost: 0.1, // percentage
    slippage: 0.05, // percentage
    maxPositionSize: 20, // percentage of portfolio
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Handle parameter changes
  const handleChange = useCallback((field, value) => {
    setParameters((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Reset to defaults
  const handleReset = useCallback(() => {
    setParameters({
      startDate: fiveYearsAgo,
      endDate: today,
      initialCapital: 100000,
      rebalanceFrequency: 'monthly',
      transactionCost: 0.1,
      slippage: 0.05,
      maxPositionSize: 20,
    });
  }, [today, fiveYearsAgo]);

  // Run backtest with current parameters
  const handleRunBacktest = useCallback(() => {
    if (onRunBacktest) {
      onRunBacktest(parameters);
    }
  }, [parameters, onRunBacktest]);

  // Calculate backtest duration in years
  const duration = ((new Date(parameters.endDate) - new Date(parameters.startDate)) / (365 * 24 * 60 * 60 * 1000)).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Main Controls Card */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Settings className="text-indigo-600" size={24} />
            <h3 className="text-xl font-bold text-gray-900">Backtest Parameters</h3>
          </div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </button>
        </div>

        {/* Basic Parameters */}
        <div className="space-y-4">
          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="text-indigo-600" size={16} />
                <span>Start Date</span>
              </label>
              <input
                type="date"
                value={parameters.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                max={parameters.endDate}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="text-indigo-600" size={16} />
                <span>End Date</span>
              </label>
              <input
                type="date"
                value={parameters.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                min={parameters.startDate}
                max={today}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              />
            </div>
          </div>

          {/* Duration Display */}
          <div className="bg-white rounded-lg p-3 border border-indigo-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 font-medium">Backtest Duration:</span>
              <span className="text-lg font-bold text-indigo-600">{duration} years</span>
            </div>
          </div>

          {/* Initial Capital */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
              <DollarSign className="text-green-600" size={16} />
              <span>Initial Capital</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">₹</span>
              <input
                type="number"
                value={parameters.initialCapital}
                onChange={(e) => handleChange('initialCapital', Number(e.target.value))}
                min="10000"
                step="10000"
                className="w-full pl-8 pr-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {[50000, 100000, 500000, 1000000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleChange('initialCapital', amount)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    parameters.initialCapital === amount
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {formatCurrency(amount)}
                </button>
              ))}
            </div>
          </div>

          {/* Rebalance Frequency */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
              <RefreshCw className="text-purple-600" size={16} />
              <span>Rebalance Frequency</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['monthly', 'quarterly', 'yearly'].map((freq) => (
                <button
                  key={freq}
                  onClick={() => handleChange('rebalanceFrequency', freq)}
                  className={`px-4 py-2.5 rounded-lg font-semibold capitalize transition-all ${
                    parameters.rebalanceFrequency === freq
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-purple-400'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Parameters */}
        {showAdvanced && (
          <div className="mt-6 pt-6 border-t-2 border-indigo-200 space-y-4">
            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center space-x-2">
              <Settings className="text-indigo-600" size={18} />
              <span>Advanced Settings</span>
            </h4>

            {/* Transaction Cost */}
            <div>
              <label className="flex items-center justify-between text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Percent className="text-orange-600" size={16} />
                  <span>Transaction Cost</span>
                </div>
                <span className="text-orange-600">{parameters.transactionCost}%</span>
              </label>
              <input
                type="range"
                value={parameters.transactionCost}
                onChange={(e) => handleChange('transactionCost', Number(e.target.value))}
                min="0"
                max="1"
                step="0.05"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>0%</span>
                <span>0.5%</span>
                <span>1%</span>
              </div>
            </div>

            {/* Slippage */}
            <div>
              <label className="flex items-center justify-between text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="text-blue-600" size={16} />
                  <span>Slippage</span>
                </div>
                <span className="text-blue-600">{parameters.slippage}%</span>
              </label>
              <input
                type="range"
                value={parameters.slippage}
                onChange={(e) => handleChange('slippage', Number(e.target.value))}
                min="0"
                max="0.5"
                step="0.05"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>0%</span>
                <span>0.25%</span>
                <span>0.5%</span>
              </div>
            </div>

            {/* Max Position Size */}
            <div>
              <label className="flex items-center justify-between text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Clock className="text-teal-600" size={16} />
                  <span>Max Position Size</span>
                </div>
                <span className="text-teal-600">{parameters.maxPositionSize}%</span>
              </label>
              <input
                type="range"
                value={parameters.maxPositionSize}
                onChange={(e) => handleChange('maxPositionSize', Number(e.target.value))}
                min="5"
                max="50"
                step="5"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>5%</span>
                <span>25%</span>
                <span>50%</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleRunBacktest}
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-bold text-white transition-all ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl active:scale-95'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="animate-spin" size={20} />
                <span>Running Backtest...</span>
              </>
            ) : (
              <>
                <Play size={20} />
                <span>Run Backtest</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            disabled={isLoading}
            className="px-6 py-3 rounded-lg font-bold text-gray-700 bg-white border-2 border-gray-300 hover:border-gray-400 transition-all flex items-center justify-center space-x-2 active:scale-95"
          >
            <RotateCcw size={20} />
            <span>Reset</span>
          </button>
        </div>
      </Card>

      {/* Parameter Summary Card */}
      <Card className="bg-white border-2 border-gray-200">
        <h4 className="text-sm font-bold text-gray-900 mb-3">Current Configuration</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-600 mb-1">Duration</p>
            <p className="text-lg font-bold text-blue-600">{duration}y</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <p className="text-xs text-gray-600 mb-1">Capital</p>
            <p className="text-base font-bold text-green-600">{formatCurrency(parameters.initialCapital)}</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <p className="text-xs text-gray-600 mb-1">Rebalance</p>
            <p className="text-sm font-bold text-purple-600 capitalize">{parameters.rebalanceFrequency}</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
            <p className="text-xs text-gray-600 mb-1">Costs</p>
            <p className="text-sm font-bold text-orange-600">{parameters.transactionCost}%</p>
          </div>
        </div>
      </Card>

      {/* Info Card */}
      <Card className="bg-yellow-50 border-2 border-yellow-200">
        <div className="flex items-start space-x-2">
          <Settings className="text-yellow-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-semibold text-yellow-800 mb-1">About Backtest Parameters</p>
            <p className="text-xs text-yellow-700 leading-relaxed">
              Adjust these parameters to test how the strategy would have performed under different conditions.
              Transaction costs and slippage simulate real-world trading friction.
              Longer backtests provide more data but may not reflect current market conditions.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default React.memo(BacktestControls);
