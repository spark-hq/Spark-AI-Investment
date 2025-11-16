// import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';
import Card from '../ui/StockCard';

const TradingChart = ({ asset, chartData, timeframe, onTimeframeChange }) => {
  const timeframes = [
    { id: '1D', label: '1 Day' },
    { id: '1W', label: '1 Week' },
    { id: '1M', label: '1 Month' },
  ];

  const formatCurrency = (value) => {
    if (asset?.type === 'Crypto') {
      return `$${value.toLocaleString()}`;
    }
    return `₹${value.toLocaleString()}`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-xl border-2 border-indigo-200">
          <p className="text-sm font-semibold text-gray-900">{payload[0].payload.label}</p>
          <p className="text-lg font-bold text-indigo-600">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const isPositive = chartData && chartData.length > 1 && chartData[chartData.length - 1].price > chartData[0].price;

  return (
    <Card className="bg-white border-2 border-indigo-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 sm:p-3 rounded-xl flex-shrink-0">
            <BarChart3 className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Price Chart</h3>
            {asset && (
              <p className="text-xs sm:text-sm text-gray-600">
                {asset.name} ({asset.symbol})
              </p>
            )}
          </div>
        </div>
        {asset && (
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${
            isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <TrendingUp size={14} className={isPositive ? 'rotate-0' : 'rotate-180'} />
            <span className="text-xs sm:text-sm font-semibold">
              {isPositive ? 'Bullish' : 'Bearish'}
            </span>
          </div>
        )}
      </div>

      {/* Timeframe Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:space-x-2 mb-4">
        <span className="text-xs sm:text-sm font-semibold text-gray-700">Timeframe:</span>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {timeframes.map((tf) => (
            <button
              key={tf.id}
              onClick={() => onTimeframeChange?.(tf.id)}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all min-h-[44px] active:scale-95 ${
                timeframe === tf.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {chartData && chartData.length > 0 ? (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-2 sm:p-4 border-2 border-indigo-200">
          <ResponsiveContainer width="100%" height={250} className="sm:hidden">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="label"
                stroke="#6b7280"
                style={{ fontSize: '10px' }}
                angle={0}
                height={50}
                tick={{ dy: 10 }}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: '10px' }}
                tickFormatter={(value) => formatCurrency(value)}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "#10b981" : "#ef4444"}
                strokeWidth={2}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={300} className="hidden sm:block">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="label"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => formatCurrency(value)}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "#10b981" : "#ef4444"}
                strokeWidth={3}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Chart Info */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <div className="bg-white rounded-lg p-2 sm:p-3 border border-indigo-200">
              <p className="text-xs text-gray-600 mb-1">Open</p>
              <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                {asset && formatCurrency(asset.open)}
              </p>
            </div>
            <div className="bg-white rounded-lg p-2 sm:p-3 border border-indigo-200">
              <p className="text-xs text-gray-600 mb-1">High</p>
              <p className="text-xs sm:text-sm font-bold text-green-600 truncate">
                {asset && formatCurrency(asset.high)}
              </p>
            </div>
            <div className="bg-white rounded-lg p-2 sm:p-3 border border-indigo-200">
              <p className="text-xs text-gray-600 mb-1">Low</p>
              <p className="text-xs sm:text-sm font-bold text-red-600 truncate">
                {asset && formatCurrency(asset.low)}
              </p>
            </div>
            <div className="bg-white rounded-lg p-2 sm:p-3 border border-indigo-200">
              <p className="text-xs text-gray-600 mb-1">Volume</p>
              <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                {asset && asset.volume}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
          <div className="bg-gray-200 p-6 rounded-full inline-block mb-3">
            <BarChart3 className="text-gray-400" size={48} />
          </div>
          <p className="text-gray-600 font-medium mb-1">No Chart Data</p>
          <p className="text-sm text-gray-500">Select an asset to view price chart</p>
        </div>
      )}

      {/* Technical Indicators Info */}
      {asset && (
        <div className="mt-4 pt-4 border-t-2 border-gray-100">
          <p className="text-xs font-semibold text-gray-700 mb-2">💡 Quick Analysis</p>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-blue-900">
              {isPositive ? (
                <>
                  <strong>Bullish Trend:</strong> Price has increased by{' '}
                  <strong>{Math.abs(asset.changePercent).toFixed(2)}%</strong> in the selected
                  timeframe. Consider entry points near support levels.
                </>
              ) : (
                <>
                  <strong>Bearish Trend:</strong> Price has decreased by{' '}
                  <strong>{Math.abs(asset.changePercent).toFixed(2)}%</strong> in the selected
                  timeframe. Wait for reversal confirmation.
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TradingChart;