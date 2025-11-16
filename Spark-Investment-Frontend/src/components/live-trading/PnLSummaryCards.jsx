// src/components/live-trading/PnLSummaryCards.jsx

import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Calendar, DollarSign, BarChart3, Activity } from 'lucide-react';
import Card from '../ui/StockCard';

const PnLSummaryCards = ({ positions = [], executionLog = [] }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  // Calculate P&L for different time periods
  const pnlData = useMemo(() => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Calculate unrealized P&L from open positions
    const unrealizedPnL = positions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0);

    // Calculate realized P&L from execution log
    const calculateRealizedPnL = (fromDate) => {
      return executionLog
        .filter(log => new Date(log.timestamp) >= fromDate && log.status === 'filled')
        .reduce((sum, log) => {
          // Simplified P&L calculation based on action
          if (log.action === 'sell') {
            return sum + (log.executedPrice - log.avgCost) * log.quantity;
          }
          return sum;
        }, 0);
    };

    const dailyRealized = calculateRealizedPnL(oneDayAgo);
    const weeklyRealized = calculateRealizedPnL(oneWeekAgo);
    const monthlyRealized = calculateRealizedPnL(oneMonthAgo);

    // Total P&L = Unrealized + Realized
    const dailyTotal = dailyRealized + unrealizedPnL;
    const weeklyTotal = weeklyRealized + unrealizedPnL;
    const monthlyTotal = monthlyRealized + unrealizedPnL;

    // Calculate total invested
    const totalInvested = positions.reduce((sum, pos) => sum + pos.investedAmount, 0);

    // Calculate percentages
    const dailyPercent = totalInvested > 0 ? (dailyTotal / totalInvested) * 100 : 0;
    const weeklyPercent = totalInvested > 0 ? (weeklyTotal / totalInvested) * 100 : 0;
    const monthlyPercent = totalInvested > 0 ? (monthlyTotal / totalInvested) * 100 : 0;

    // Win rate calculation
    const filledOrders = executionLog.filter(log => log.status === 'filled');
    const profitableTrades = filledOrders.filter(log =>
      log.action === 'sell' && (log.executedPrice - log.avgCost) > 0
    ).length;
    const winRate = filledOrders.length > 0
      ? (profitableTrades / filledOrders.length) * 100
      : 0;

    return {
      daily: {
        total: dailyTotal,
        realized: dailyRealized,
        unrealized: unrealizedPnL,
        percent: dailyPercent,
      },
      weekly: {
        total: weeklyTotal,
        realized: weeklyRealized,
        unrealized: unrealizedPnL,
        percent: weeklyPercent,
      },
      monthly: {
        total: monthlyTotal,
        realized: monthlyRealized,
        unrealized: unrealizedPnL,
        percent: monthlyPercent,
      },
      winRate,
      totalTrades: filledOrders.length,
    };
  }, [positions, executionLog]);

  const PnLCard = ({ period, icon: Icon, data, color }) => {
    const isProfit = data.total >= 0;
    const gradientClass = isProfit
      ? `from-${color}-600 to-${color.replace('green', 'emerald').replace('blue', 'indigo').replace('purple', 'pink')}-600`
      : `from-red-600 to-rose-600`;

    return (
      <Card className={`bg-gradient-to-br ${gradientClass} text-white hover-lift shadow-xl border-0 overflow-hidden relative`}>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
              <Icon size={24} />
            </div>
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${isProfit ? 'bg-white bg-opacity-20' : 'bg-black bg-opacity-20'}`}>
              {isProfit ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="text-sm font-bold">{formatPercent(data.percent)}</span>
            </div>
          </div>

          <p className="text-sm opacity-90 mb-2 font-medium">{period} P&L</p>
          <h3 className="text-2xl sm:text-3xl font-bold mb-3">
            {isProfit ? '+' : ''}{formatCurrency(data.total)}
          </h3>

          <div className="bg-white bg-opacity-10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex justify-between text-xs mb-1">
              <span className="opacity-90">Realized:</span>
              <span className="font-semibold">{formatCurrency(data.realized)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="opacity-90">Unrealized:</span>
              <span className="font-semibold">{formatCurrency(data.unrealized)}</span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Period-wise P&L Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PnLCard
          period="Daily"
          icon={Calendar}
          data={pnlData.daily}
          color="green"
        />
        <PnLCard
          period="Weekly"
          icon={BarChart3}
          data={pnlData.weekly}
          color="blue"
        />
        <PnLCard
          period="Monthly"
          icon={Activity}
          data={pnlData.monthly}
          color="purple"
        />
      </div>

      {/* Trading Stats Card */}
      <Card className="bg-white border-2 border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <BarChart3 className="text-indigo-600" size={20} />
          <span>Trading Statistics</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="text-blue-600" size={16} />
              <p className="text-xs text-gray-600 font-medium">Total Trades</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{pnlData.totalTrades}</p>
          </div>

          <div className={`rounded-xl p-4 border-2 ${pnlData.winRate >= 50 ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'}`}>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className={pnlData.winRate >= 50 ? 'text-green-600' : 'text-red-600'} size={16} />
              <p className="text-xs text-gray-600 font-medium">Win Rate</p>
            </div>
            <p className={`text-2xl font-bold ${pnlData.winRate >= 50 ? 'text-green-600' : 'text-red-600'}`}>
              {pnlData.winRate.toFixed(1)}%
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="text-purple-600" size={16} />
              <p className="text-xs text-gray-600 font-medium">Open Positions</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{positions.length}</p>
          </div>

          <div className={`rounded-xl p-4 border-2 ${pnlData.daily.total >= 0 ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'}`}>
            <div className="flex items-center space-x-2 mb-2">
              {pnlData.daily.total >= 0 ? (
                <TrendingUp className="text-green-600" size={16} />
              ) : (
                <TrendingDown className="text-red-600" size={16} />
              )}
              <p className="text-xs text-gray-600 font-medium">Today's Trend</p>
            </div>
            <p className={`text-xl font-bold ${pnlData.daily.total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {pnlData.daily.total >= 0 ? 'Bullish' : 'Bearish'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PnLSummaryCards;
