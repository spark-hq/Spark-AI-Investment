// src/components/auto-invest/PerformanceTracker.jsx

import { TrendingUp, TrendingDown, Activity, DollarSign, Calendar, BarChart3, Play, Pause } from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PerformanceTracker = ({ activePlans, performanceMetrics, onTogglePlan }) => {
  // Mock performance chart data
  const performanceChartData = [
    { month: 'Oct', value: 93000 },
    { month: 'Nov', value: 94800 },
    { month: 'Dec', value: 96500 },
    { month: 'Jan', value: 97200 },
    { month: 'Feb', value: 99100 },
    { month: 'Mar', value: 100400 },
  ];

  return (
    <div className="space-y-6">
      {/* Overall Performance Summary */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg">
            <BarChart3 className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Portfolio Performance</h3>
            <p className="text-sm text-gray-600">Overall auto-invest performance</p>
          </div>
        </div>

        {/* Summary Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="text-indigo-600" size={18} />
              <p className="text-xs text-gray-600 font-medium">Total Invested</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(performanceMetrics.totalInvested)}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="text-green-600" size={18} />
              <p className="text-xs text-gray-600 font-medium">Current Value</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(performanceMetrics.currentValue)}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="text-purple-600" size={18} />
              <p className="text-xs text-gray-600 font-medium">Total Returns</p>
            </div>
            <p className="text-2xl font-bold text-green-600">+{formatCurrency(performanceMetrics.totalReturns)}</p>
            <p className="text-xs text-green-600 font-semibold">+{performanceMetrics.overallReturnPercentage}%</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-100">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="text-orange-600" size={18} />
              <p className="text-xs text-gray-600 font-medium">Active Plans</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{performanceMetrics.totalPlansActive}</p>
            <p className="text-xs text-gray-600">{performanceMetrics.totalTransactions} transactions</p>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-bold text-gray-900 mb-4">Growth Over Time</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={performanceChartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis
                tickFormatter={(value) => `¹${(value / 1000).toFixed(0)}K`}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: '#10b981' }}
                fill="url(#colorValue)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Plans List */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Activity className="text-indigo-600" size={20} />
          <span>Active Auto-Invest Plans</span>
        </h3>

        {activePlans.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">=Ê</div>
            <p className="text-lg font-semibold text-gray-700 mb-2">No active plans yet</p>
            <p className="text-sm text-gray-500">Activate a plan from the AI recommendations below</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activePlans.map((plan) => (
              <div
                key={plan.id}
                className="border-2 border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${plan.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}
                    ></div>
                    <div>
                      <h4 className="font-bold text-gray-900">{plan.planName}</h4>
                      <p className="text-xs text-gray-600">
                        Started {new Date(plan.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onTogglePlan(plan.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                      plan.status === 'Active'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {plan.status === 'Active' ? (
                      <>
                        <Pause size={16} />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        <span>Resume</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Monthly SIP</p>
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(plan.monthlyInvestment)}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Total Invested</p>
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(plan.totalInvested)}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Current Value</p>
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(plan.currentValue)}</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Returns</p>
                    <p className="text-sm font-bold text-green-600">+{formatCurrency(plan.returns)}</p>
                    <p className="text-xs text-green-600 font-semibold">+{plan.returnsPercentage.toFixed(2)}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-gray-600" size={16} />
                    <span className="text-xs text-gray-700">
                      Next execution: <span className="font-semibold">{new Date(plan.nextExecution).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-semibold">{plan.executedTransactions}</span> / {plan.totalTransactions} transactions executed
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceTracker;
