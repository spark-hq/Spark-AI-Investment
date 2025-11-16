// src/components/live-trading/PositionTracker.jsx

import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, X, AlertCircle, Package, DollarSign, Target } from 'lucide-react';
import Card from '../ui/StockCard';

const PositionTracker = ({ positions = [], onClosePosition }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercent = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  // Calculate total P&L
  const totalPnL = useMemo(() => {
    return positions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0);
  }, [positions]);

  const totalValue = useMemo(() => {
    return positions.reduce((sum, pos) => sum + pos.currentValue, 0);
  }, [positions]);

  const totalInvested = useMemo(() => {
    return positions.reduce((sum, pos) => sum + pos.investedAmount, 0);
  }, [positions]);

  if (positions.length === 0) {
    return (
      <Card className="bg-white border-2 border-gray-200">
        <div className="text-center py-12">
          <div className="bg-gray-100 p-6 rounded-full inline-block mb-4">
            <Package className="text-gray-400" size={48} />
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">No Open Positions</h3>
          <p className="text-sm text-gray-500">
            Your open positions will appear here once you place trades
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-2 border-indigo-200">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Package className="text-indigo-600" size={24} />
            <span>Open Positions</span>
          </h3>
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
            {positions.length} {positions.length === 1 ? 'Position' : 'Positions'}
          </span>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <p className="text-xs text-gray-600 mb-1">Total Invested</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(totalInvested)}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <p className="text-xs text-gray-600 mb-1">Current Value</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(totalValue)}</p>
          </div>
          <div className={`rounded-lg p-4 border-2 ${totalPnL >= 0 ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'}`}>
            <p className="text-xs text-gray-600 mb-1">Total P&L</p>
            <p className={`text-lg font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
            </p>
          </div>
        </div>
      </div>

      {/* Positions List */}
      <div className="space-y-4">
        {positions.map((position) => {
          const isProfit = position.unrealizedPnL >= 0;
          const pnlPercent = (position.unrealizedPnL / position.investedAmount) * 100;
          const distanceToStopLoss = position.stopLoss
            ? ((position.currentPrice - position.stopLoss) / position.currentPrice) * 100
            : null;

          return (
            <div
              key={position.id}
              className={`bg-gradient-to-r ${isProfit ? 'from-green-50 to-emerald-50 border-green-200' : 'from-red-50 to-rose-50 border-red-200'} border-2 rounded-xl p-4 hover:shadow-lg transition-all`}
            >
              <div className="flex items-start justify-between mb-4">
                {/* Position Header */}
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`p-3 rounded-xl ${isProfit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {isProfit ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-lg font-bold text-gray-900">{position.symbol}</h4>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${position.side === 'long' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                        {position.side.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {position.quantity} shares @ {formatCurrency(position.avgPrice)}
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => onClosePosition(position.id)}
                  className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg transition-colors"
                  title="Close Position"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Position Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Entry Price</p>
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(position.avgPrice)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Current Price</p>
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(position.currentPrice)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Invested</p>
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(position.investedAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Current Value</p>
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(position.currentValue)}</p>
                </div>
              </div>

              {/* P&L Display */}
              <div className={`bg-white bg-opacity-50 rounded-lg p-3 mb-3 border ${isProfit ? 'border-green-200' : 'border-red-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Unrealized P&L</p>
                    <div className="flex items-center space-x-2">
                      <p className={`text-xl font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                        {isProfit ? '+' : ''}{formatCurrency(position.unrealizedPnL)}
                      </p>
                      <span className={`text-sm font-semibold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                        ({formatPercent(pnlPercent)})
                      </span>
                    </div>
                  </div>
                  {position.stopLoss && (
                    <div className="text-right">
                      <p className="text-xs text-gray-600 mb-1 flex items-center space-x-1">
                        <Target size={12} />
                        <span>Stop Loss</span>
                      </p>
                      <p className="text-sm font-bold text-red-600">{formatCurrency(position.stopLoss)}</p>
                      {distanceToStopLoss !== null && (
                        <p className="text-xs text-gray-600 mt-1">
                          {distanceToStopLoss > 0 ? `${distanceToStopLoss.toFixed(2)}% away` : 'Triggered!'}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Warning if near stop loss */}
              {position.stopLoss && distanceToStopLoss !== null && distanceToStopLoss <= 2 && distanceToStopLoss > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center space-x-2">
                  <AlertCircle className="text-yellow-600 flex-shrink-0" size={16} />
                  <p className="text-xs text-yellow-800 font-semibold">
                    ⚠️ Price is within 2% of stop loss!
                  </p>
                </div>
              )}

              {/* Entry Time */}
              <div className="text-xs text-gray-500 text-right mt-2">
                Opened: {new Date(position.entryTime).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default PositionTracker;
