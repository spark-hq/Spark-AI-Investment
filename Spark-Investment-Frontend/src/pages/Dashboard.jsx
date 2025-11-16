import { useState, useEffect } from 'react';
import PortfolioSummary from '../components/dashboard/PortfolioSummary';
import PlatformCards from '../components/dashboard/PlatformCards';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import Disclaimer from '../components/legal/Disclaimer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ErrorDisplay } from '../components/ui/ErrorBoundary';
// Import custom hooks for data fetching
import {
  usePortfolioSummary,
  useConnectedPlatforms,
  usePortfolioPerformance,
  useAssetAllocation,
  useTopPerformers,
  useRecentActivity
} from '../hooks/usePortfolio';
import { formatCurrency } from '../utils/calculations';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  Activity,
  Sparkles,
  Brain,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';

const Dashboard = () => {
  const [greeting, setGreeting] = useState('');

  // Fetch all dashboard data using custom hooks
  const { data: portfolioSummary, isLoading: summaryLoading, error: summaryError } = usePortfolioSummary();
  const { data: connectedPlatforms, isLoading: platformsLoading } = useConnectedPlatforms();
  const { data: performanceData, isLoading: performanceLoading } = usePortfolioPerformance('1Y');
  const { data: assetAllocation, isLoading: allocationLoading } = useAssetAllocation();
  const { data: topPerformers, isLoading: performersLoading } = useTopPerformers();
  const { data: recentActivity, isLoading: activityLoading } = useRecentActivity(5);

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const getActivityIcon = (type) => {
    switch(type) {
      case 'buy': return <ArrowDownRight className="text-green-600" size={20} />;
      case 'sell': return <ArrowUpRight className="text-red-600" size={20} />;
      case 'sip': return <RefreshCw className="text-blue-600" size={20} />;
      default: return <Activity className="text-gray-600" size={20} />;
    }
  };

  const getActivityColor = (type) => {
    switch(type) {
      case 'buy': return 'bg-green-100';
      case 'sell': return 'bg-red-100';
      case 'sip': return 'bg-blue-100';
      default: return 'bg-gray-100';
    }
  };

  // Show loading spinner while critical data is loading
  if (summaryLoading) {
    return <LoadingSpinner fullScreen message="Loading your dashboard..." />;
  }

  // Show error if critical data fails to load
  if (summaryError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 flex items-center justify-center">
        <div className="max-w-md">
          <ErrorDisplay error={summaryError} retry={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-6 sm:py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Disclaimer Section - Legal Compliance */}
        <div className="animate-fadeIn">
          <Disclaimer fullVersion />
        </div>

        {/* Header */}
        <div className="animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  {greeting}! 👋
                </h1>
                <Sparkles className="text-indigo-600 animate-pulse" size={28} />
              </div>
              <p className="text-base sm:text-lg md:text-xl text-gray-600">
                Here's your AI-powered investment portfolio overview
              </p>
            </div>
          </div>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="animate-fadeIn">
          <PortfolioSummary summary={portfolioSummary} />
        </div>

        {/* Quick Actions */}
        <Card className="animate-fadeIn border-2 border-indigo-100 shadow-lg">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3.5 rounded-2xl shadow-lg">
                <Zap className="text-white" size={26} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1">Quick Actions</h3>
                <p className="text-gray-600 text-sm md:text-base">Manage your investments efficiently</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Link to="/investments" className="w-full sm:flex-1 lg:w-auto">
                <Button variant="primary" className="w-full hover-lift flex items-center justify-center space-x-2 bg-gradient-to-r from-violet-700 via-blue-700 to-green-500 animate-gradient bg-[length:200%_200%] shadow-md hover:shadow-lg transition-all">
                  <TrendingUp size={18} />
                  <span>Investments</span>
                </Button>
              </Link>
              <Link to="/live-trading" className="w-full sm:flex-1 lg:w-auto">
                <Button variant="success" className="w-full hover-lift flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 via-blue-600 to-violet-700 animate-gradient bg-[length:200%_200%] shadow-md hover:shadow-lg transition-all">
                  <Activity size={18} />
                  <span>Live Trading</span>
                </Button>
              </Link>
              <Link to="/ai-analysis" className="w-full sm:flex-1 lg:w-auto">
                <Button variant="outline" className="w-full hover-lift flex items-center justify-center space-x-2 border-2 shadow-sm hover:shadow-md transition-all">
                  <Brain size={18} />
                  <span>AI Analysis</span>
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Platform Cards */}
        <div className="animate-fadeIn">
          {platformsLoading ? (
            <Card><LoadingSpinner message="Loading connected platforms..." /></Card>
          ) : (
            <PlatformCards platforms={connectedPlatforms || []} />
          )}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
          {/* Performance Chart */}
          <Card title="Portfolio Performance" subtitle="Last 12 months" className="animate-fadeIn hover-lift border-2 border-gray-100">
            {performanceLoading ? (
              <LoadingSpinner message="Loading performance data..." />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData || []}>
                <defs>
                  <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 14, fill: '#6b7280' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                  tick={{ fontSize: 14, fill: '#6b7280' }}
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="invested" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  name="Invested"
                  dot={{ r: 4, fill: '#6366f1' }}
                  fill="url(#colorInvested)"
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Current Value"
                  dot={{ r: 4, fill: '#10b981' }}
                  fill="url(#colorValue)"
                />
              </LineChart>
            </ResponsiveContainer>
            )}
          </Card>

          {/* Asset Allocation */}
          <Card title="Asset Allocation" subtitle="Investment distribution" className="animate-fadeIn hover-lift border-2 border-gray-100">
            {allocationLoading ? (
              <LoadingSpinner message="Loading asset allocation..." />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={assetAllocation || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(assetAllocation || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            )}
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {/* Top Performers - Takes 2 columns */}
          <Card
            title="Top Performers"
            subtitle="Best performing investments"
            className="lg:col-span-2 animate-fadeIn hover-lift border-2 border-green-100 shadow-lg"
          >
            {performersLoading ? (
              <LoadingSpinner message="Loading top performers..." />
            ) : (
              <div className="space-y-3">
                {(topPerformers || []).map((investment, index) => (
                <div 
                  key={investment.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-all border border-green-100"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-green-600 shadow-sm">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">{investment.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-600">{investment.platform}</span>
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full font-semibold">
                          {investment.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {formatCurrency(investment.current)}
                    </p>
                    <p className="text-sm text-green-600 font-semibold flex items-center justify-end space-x-1">
                      <TrendingUp size={14} />
                      <span>+{formatCurrency(investment.returns)} (+{investment.returnPercentage}%)</span>
                    </p>
                  </div>
                </div>
              ))}
              </div>
            )}
            <div className="mt-6 text-center">
              <Link to="/investments">
                <Button variant="outline" size="lg" className="hover-lift">
                  View All Investments →
                </Button>
              </Link>
            </div>
          </Card>

          {/* Recent Activity - Takes 1 column */}
          <Card
            title="Recent Activity"
            subtitle="Latest transactions"
            className="lg:col-span-1 animate-fadeIn hover-lift border-2 border-blue-100 shadow-lg"
          >
            {activityLoading ? (
              <LoadingSpinner message="Loading recent activity..." />
            ) : (
              <div className="space-y-3">
                {(recentActivity || []).slice(0, 5).map((activity) => (
                <div 
                  key={activity.id}
                  className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all border border-gray-200"
                >
                  <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900 truncate">
                      {activity.asset}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {activity.platform}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {formatCurrency(activity.amount)}
                    </p>
                  </div>
                </div>
              ))}
              </div>
            )}
            <div className="mt-6 text-center">
              <Link to="/transactions">
                <Button variant="outline" size="lg" fullWidth className="hover-lift">
                  View All Transactions →
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* AI Insights Teaser */}
        <Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white animate-fadeIn hover-lift shadow-2xl border-0 overflow-hidden relative transform hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute inset-0 bg-white opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1">
              <div className="bg-white bg-opacity-20 p-4 sm:p-5 rounded-2xl backdrop-blur-sm shadow-lg">
                <Brain className="text-white" size={48} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 flex flex-col sm:flex-row sm:items-center gap-2">
                  <span>AI-Powered Investment Insights</span>
                  <Sparkles className="animate-pulse inline" size={24} />
                </h3>
                <p className="text-indigo-100 text-sm sm:text-base">
                  Get personalized analysis, predictions, and recommendations for your portfolio
                </p>
              </div>
            </div>
            <Link to="/ai-analysis" className="w-full sm:w-auto">
              <Button
                variant='view_ai_insights'
                size="lg"
                className="w-full bg-white text-indigo-800 hover:bg-gray-100 hover-lift whitespace-nowrap shadow-lg font-bold"
              >
                View AI Insights →
              </Button>
            </Link>
          </div>
        </Card>

        {/* Smart Trading Teaser */}
        <Card className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white animate-fadeIn hover-lift shadow-2xl border-0 overflow-hidden relative transform hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute inset-0 bg-white opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1">
              <div className="bg-white bg-opacity-20 p-4 sm:p-5 rounded-2xl backdrop-blur-sm shadow-lg">
                <Activity className="text-white" size={48} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 flex flex-col sm:flex-row sm:items-center gap-2">
                  <span>Live Smart Trading</span>
                  <Zap className="animate-pulse inline" size={24} />
                </h3>
                <p className="text-green-100 text-sm sm:text-base">
                  Trade with AI assistance - Get real-time insights, recommendations, and automated trading
                </p>
              </div>
            </div>
            <Link to="/live-trading" className="w-full sm:w-auto">
              <Button
                variant='start_trading'
                size="lg"
                className="w-full bg-white text-green-900 hover:bg-gray-100 hover-lift whitespace-nowrap shadow-lg font-bold"
              >
                Start Trading →
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;