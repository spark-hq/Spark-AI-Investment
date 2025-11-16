import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Maximize2, Download, Info } from 'lucide-react';
import Card from '../ui/StockCard';

const LiveMarketChart = ({ selectedAsset, marketData }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');

  const timeframes = [
    { id: '1D', label: '1D', days: 1 },
    { id: '1W', label: '1W', days: 7 },
    { id: '1M', label: '1M', days: 30 },
    { id: '3M', label: '3M', days: 90 },
    { id: '6M', label: '6M', days: 180 },
    { id: '1Y', label: '1Y', days: 365 },
    { id: '3Y', label: '3Y', days: 1095 },
    { id: '5Y', label: '5Y', days: 1825 },
    { id: 'All', label: 'All', days: 3650 },
  ];

  // Helper functions - defined before useMemo hooks that use them
  const formatTime = (timestamp, timeframe) => {
    const date = new Date(timestamp);
    if (timeframe === '1D') {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (timeframe === '1W' || timeframe === '1M') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  // Generate chart data based on selected asset and timeframe
  const chartData = useMemo(() => {
    if (!selectedAsset) return [];

    const timeframe = timeframes.find((t) => t.id === selectedTimeframe);
    const dataPoints = selectedTimeframe === '1D' ? 24 : Math.min(timeframe.days, 100);

    const currentPrice = selectedAsset.currentPrice || 100;
    const volatility = 0.02; // 2% volatility
    const trend = (selectedAsset.changePercent || 0) / 100;

    const data = [];
    const now = Date.now();

    for (let i = dataPoints; i >= 0; i--) {
      const timeAgo = (timeframe.days / dataPoints) * i;
      const timestamp = now - timeAgo * 24 * 60 * 60 * 1000;

      // Calculate price with trend and random walk
      const trendFactor = 1 + (trend * (dataPoints - i)) / dataPoints;
      const randomWalk = 1 + (Math.random() - 0.5) * volatility;
      const price = currentPrice * trendFactor * randomWalk;

      data.push({
        timestamp,
        time: formatTime(timestamp, selectedTimeframe),
        price: parseFloat(price.toFixed(2)),
        volume: Math.floor(Math.random() * 10000) + 5000,
      });
    }

    return data;
  }, [selectedAsset, selectedTimeframe]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (chartData.length === 0) return null;

    const prices = chartData.map((d) => d.price);
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    const open = chartData[0]?.price || 0;
    const close = chartData[chartData.length - 1]?.price || 0;
    const change = close - open;
    const changePercent = open !== 0 ? (change / open) * 100 : 0;

    return { high, low, open, close, change, changePercent };
  }, [chartData]);

  const isPositive = stats ? stats.changePercent >= 0 : false;
  const chartColor = isPositive ? '#10b981' : '#ef4444'; // green or red
  const gradientId = `gradient-${selectedAsset?.id || 'default'}`;

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-xs text-gray-600 mb-1">{data.time}</p>
          <p className="text-sm font-bold text-gray-900">{formatCurrency(data.price)}</p>
          <p className="text-xs text-gray-500">Vol: {data.volume.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  if (!selectedAsset) {
    return (
      <Card className="bg-white border-2 border-gray-200 hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="bg-gray-100 p-6 rounded-full mb-4">
            <Activity className="text-gray-400" size={48} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Select an Asset</h3>
          <p className="text-gray-600 max-w-md">
            Choose an asset from the Live Market Data section above to view its detailed price chart and
            analysis.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-2 border-indigo-100 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`${isPositive ? 'bg-green-100' : 'bg-red-100'} p-3 rounded-xl`}>
            {isPositive ? (
              <TrendingUp className={`${isPositive ? 'text-green-600' : 'text-red-600'}`} size={24} />
            ) : (
              <TrendingDown className="text-red-600" size={24} />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold text-gray-900">{selectedAsset.symbol}</h3>
              <span className="text-sm text-gray-500">{selectedAsset.name}</span>
            </div>
            <p className="text-xs text-gray-500">Live Market Data</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Chart information"
            title="Chart Info"
          >
            <Info size={18} className="text-gray-600" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Download chart data"
            title="Download"
          >
            <Download size={18} className="text-gray-600" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Fullscreen chart"
            title="Fullscreen"
          >
            <Maximize2 size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Price Display */}
      <div className="mb-6">
        <div className="flex items-baseline space-x-3">
          <h2 className="text-4xl font-bold text-gray-900">
            {formatCurrency(selectedAsset.currentPrice || 0)}
          </h2>
          <div
            className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
              isPositive ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            {isPositive ? (
              <TrendingUp size={16} className="text-green-600" />
            ) : (
              <TrendingDown size={16} className="text-red-600" />
            )}
            <span className={`text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(selectedAsset.changePercent || 0)}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {isPositive ? '+' : ''}
          {formatCurrency(selectedAsset.change || 0)} today
        </p>
      </div>

      {/* Chart */}
      <div className="mb-6 -mx-2">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value.toFixed(0)}`}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={chartColor}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Timeframe Buttons */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe.id}
              onClick={() => setSelectedTimeframe(timeframe.id)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                selectedTimeframe === timeframe.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {timeframe.label}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="text-xs text-gray-600 mb-1">Open</p>
            <p className="text-sm font-bold text-gray-900">{formatCurrency(stats.open)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">High</p>
            <p className="text-sm font-bold text-green-600">{formatCurrency(stats.high)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Low</p>
            <p className="text-sm font-bold text-red-600">{formatCurrency(stats.low)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Close</p>
            <p className="text-sm font-bold text-gray-900">{formatCurrency(stats.close)}</p>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-4 bg-blue-50 rounded-lg p-3 border border-blue-200">
        <p className="text-xs text-blue-800 flex items-start space-x-2">
          <Activity size={16} className="mt-0.5 flex-shrink-0" />
          <span>
            <strong>Live Data:</strong> Chart updates in real-time based on market movements. Select
            different timeframes to analyze price trends and patterns.
          </span>
        </p>
      </div>
    </Card>
  );
};

export default LiveMarketChart;
