// src/components/ai-analysis/PredictionChart.jsx

import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';
import { TrendingUp, Brain } from 'lucide-react';
//  investmentName to be addded in future for dynamic titles
const PredictionChart = ({ historicalData, predictions, formatCurrency }) => {
  // Combine historical and prediction data - Memoized to prevent recalculation
  const combinedData = useMemo(() => [
    ...historicalData.map(item => ({
      year: item.year === 0 ? 'Now' : `${Math.abs(item.year)}Y ago`,
      yearNum: item.year,
      value: item.value,
      type: 'historical',
      confidence: 100,
    })),
    ...predictions.slice(1).map(item => ({
      year: `+${item.year}Y`,
      yearNum: item.year,
      predicted: item.value,
      type: 'prediction',
      confidence: item.confidence,
    }))
  ], [historicalData, predictions]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border-2 border-indigo-200">
          <p className="font-bold text-gray-900 mb-2">{data.year}</p>
          {data.type === 'historical' ? (
            <>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Value: </span>
                {formatCurrency(data.value)}
              </p>
              <p className="text-xs text-green-600 mt-1">
                ✓ Historical Data
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Predicted: </span>
                {formatCurrency(data.predicted)}
              </p>
              <p className="text-xs text-purple-600 mt-1">
                AI Confidence: {data.confidence}%
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border-2 border-purple-100 shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 sm:p-3 rounded-xl flex-shrink-0">
            <Brain className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-xl font-bold text-gray-900">AI Price Prediction</h3>
            <p className="text-xs sm:text-sm text-gray-600">Historical + 5-year forecast</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-purple-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
          <TrendingUp className="text-purple-600" size={14} />
          <span className="text-xs sm:text-sm font-semibold text-purple-600">±5 Years</span>
        </div>
      </div>

      {/* Chart - Mobile */}
      <div className="sm:hidden">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={combinedData}>
            <defs>
              <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 9, fill: '#6b7280' }}
              angle={0}
            />
            <YAxis
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
              tick={{ fontSize: 9, fill: '#6b7280' }}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              x="Now"
              stroke="#10b981"
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#colorHistorical)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="predicted"
              stroke="#a855f7"
              strokeWidth={2}
              fill="url(#colorPrediction)"
              strokeDasharray="3 3"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart - Desktop */}
      <div className="hidden sm:block">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={combinedData}>
            <defs>
              <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1}/>
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
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <ReferenceLine
              x="Now"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{ value: 'Now', position: 'top', fill: '#10b981', fontWeight: 'bold' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={3}
              fill="url(#colorHistorical)"
              name="Historical Price"
              dot={{ r: 4, fill: '#6366f1' }}
              activeDot={{ r: 6 }}
            />
            <Area
              type="monotone"
              dataKey="predicted"
              stroke="#a855f7"
              strokeWidth={3}
              fill="url(#colorPrediction)"
              strokeDasharray="5 5"
              name="AI Prediction"
              dot={{ r: 4, fill: '#a855f7' }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
        <div className="bg-indigo-50 rounded-lg p-2.5 sm:p-3 border border-indigo-200">
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-indigo-600 rounded-full flex-shrink-0"></div>
            <span className="text-xs sm:text-sm font-semibold text-gray-900">Historical Data</span>
          </div>
          <p className="text-xs text-gray-600">Past 5 years actual performance</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-2.5 sm:p-3 border border-purple-200">
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-purple-600 rounded-full flex-shrink-0"></div>
            <span className="text-xs sm:text-sm font-semibold text-gray-900">AI Prediction</span>
          </div>
          <p className="text-xs text-gray-600">Next 5 years forecasted trend</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-3 sm:mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-2.5 sm:p-3">
        <p className="text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-yellow-700">⚠️ Disclaimer:</span> AI predictions are based on historical patterns and current market conditions. Actual results may vary significantly. Always conduct your own research before making investment decisions.
        </p>
      </div>
    </div>
  );
};

export default PredictionChart;