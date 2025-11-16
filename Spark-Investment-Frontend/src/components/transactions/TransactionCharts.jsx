// src/components/transactions/TransactionCharts.jsx

import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';
import {
  getMonthlyTransactionData,
  getCategoryWiseData,
  getPlatformWiseData,
  getTypeWiseData,
} from '../../data/transactionData';

const TransactionCharts = () => {
  const monthlyData = getMonthlyTransactionData();
  const categoryData = getCategoryWiseData();
  const platformData = getPlatformWiseData();
  const typeData = getTypeWiseData();

  // Colors for category chart
  const CATEGORY_COLORS = {
    Stocks: '#6366f1',
    'Mutual Funds': '#10b981',
    ETF: '#f59e0b',
    Cryptocurrency: '#8b5cf6',
  };

  // Colors for platform chart
  const PLATFORM_COLORS = {
    Zerodha: '#0066ff',
    Groww: '#00d09c',
    Upstox: '#6f42c1',
    Binance: '#f0b90b',
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border-2 border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-2">{payload[0].name}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom pie tooltip
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border-2 border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-1">{data.name}</p>
          <p className="text-sm text-gray-700">Amount: {formatCurrency(data.value)}</p>
          <p className="text-sm text-gray-700">Count: {data.payload.count} transactions</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Monthly Spending Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
            <BarChart3 className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Monthly Transaction Volume</h3>
            <p className="text-sm text-gray-600">Transaction amounts by month</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={monthlyData}>
            <defs>
              <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="colorSell" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="colorDividend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="colorSip" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis
              tickFormatter={(value) => `¹${(value / 1000).toFixed(0)}K`}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="buy" fill="url(#colorBuy)" name="Buy" stackId="a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="sell" fill="url(#colorSell)" name="Sell" stackId="a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="dividend" fill="url(#colorDividend)" name="Dividend" stackId="a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="sip" fill="url(#colorSip)" name="SIP" stackId="a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Row with 3 charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category-wise Breakdown */}
        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
          <div className="flex items-center space-x-2 mb-6">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg">
              <PieChartIcon className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">By Category</h3>
              <p className="text-xs text-gray-600">Asset distribution</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#6b7280'} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[item.name] || '#6b7280' }}
                  ></div>
                  <span className="text-gray-700 font-medium">{item.name}</span>
                </div>
                <span className="text-gray-900 font-semibold">{item.count} txns</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform-wise Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
          <div className="flex items-center space-x-2 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <PieChartIcon className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">By Platform</h3>
              <p className="text-xs text-gray-600">Platform usage</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={platformData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {platformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[entry.name] || '#6b7280'} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {platformData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: PLATFORM_COLORS[item.name] || '#6b7280' }}
                  ></div>
                  <span className="text-gray-700 font-medium">{item.name}</span>
                </div>
                <span className="text-gray-900 font-semibold">{item.count} txns</span>
              </div>
            ))}
          </div>
        </div>

        {/* Type-wise Breakdown */}
        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
          <div className="flex items-center space-x-2 mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
              <TrendingUp className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">By Type</h3>
              <p className="text-xs text-gray-600">Transaction types</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {typeData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-700 font-medium">{item.name}</span>
                </div>
                <span className="text-gray-900 font-semibold">{item.count} txns</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCharts;
