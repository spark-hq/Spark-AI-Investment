// src/pages/AutoInvest.jsx

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, ArrowLeft, Sparkles, Zap, TrendingUp, Settings } from 'lucide-react';
import Card from '../components/ui/Card';
import InvestmentPlanCard from '../components/auto-invest/InvestmentPlanCard';
import PerformanceTracker from '../components/auto-invest/PerformanceTracker';
import BacktestResults from '../components/auto-invest/BacktestResults';
import RuleBuilder from '../components/auto-invest/RuleBuilder';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ErrorDisplay } from '../components/ui/ErrorBoundary';
import {
  useStrategies,
  useBacktestResults,
  useActivatePlan,
  useUpdateStrategy,
} from '../hooks/useAutoInvest';
import {
  autoInvestTransactions,
  performanceMetrics,
} from '../data/autoInvestData';
import { formatCurrency } from '../utils/calculations';

const AutoInvest = () => {
  const navigate = useNavigate();
  const [selectedPlanForBacktest, setSelectedPlanForBacktest] = useState('PLAN002');
  const [selectedPlanForRules, setSelectedPlanForRules] = useState(null);
  const [activeTab, setActiveTab] = useState('plans'); // plans, performance, backtest, rules

  // Fetch strategies and backtest results from API
  const { data: strategies, isLoading: strategiesLoading, isError: strategiesError } = useStrategies();
  const { data: backtestData, isLoading: backtestLoading } = useBacktestResults(selectedPlanForBacktest);
  const activatePlan = useActivatePlan();
  const updateStrategy = useUpdateStrategy();

  // Compute aiInvestmentPlans from strategies
  const aiInvestmentPlans = useMemo(() => {
    return strategies || [];
  }, [strategies]);

  // Compute activePlans (plans with status 'Active' or 'Paused')
  const activePlans = useMemo(() => {
    if (!strategies) return [];
    return strategies.filter(s => s.status === 'Active' || s.status === 'Paused');
  }, [strategies]);

  // Handle plan activation
  const handleActivatePlan = (plan) => {
    if (confirm(`Activate ${plan.name}?\n\nThis will:\n1. Set up automated investment rules\n2. Connect to your trading platforms\n3. Start executing trades based on AI recommendations`)) {
      activatePlan.mutate(plan);
    }
  };

  // Handle plan toggle (pause/resume)
  const handleTogglePlan = (planId) => {
    const plan = activePlans.find(p => p.id === planId);
    if (plan) {
      updateStrategy.mutate({
        id: planId,
        updates: { status: plan.status === 'Active' ? 'Paused' : 'Active' },
      });
    }
  };

  // Handle plan selection for backtest
  const handleSelectPlanForBacktest = (planId) => {
    setSelectedPlanForBacktest(planId);
  };

  // Handle plan selection for rules
  const handleSelectPlanForRules = (plan) => {
    setSelectedPlanForRules(plan);
    setActiveTab('rules');
  };

  // Show loading state
  if (strategiesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner message="Loading AI investment strategies..." />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (strategiesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorDisplay
            title="Failed to load strategies"
            message="There was an error loading AI investment strategies. Please try again."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-4 sm:py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-600 hover:text-indigo-700 font-medium mb-4 flex items-center space-x-2 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg">
              <Bot className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">Auto-Invest AI</h1>
              <p className="text-xl text-gray-600">Automated investing powered by artificial intelligence</p>
            </div>
            <Sparkles className="text-purple-600 animate-pulse" size={32} />
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fadeIn">
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white hover-lift shadow-xl border-0">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
                <Bot size={28} />
              </div>
              <div>
                <p className="text-blue-100 text-sm font-medium">AI Plans Available</p>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">{aiInvestmentPlans.length}</h3>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white hover-lift shadow-xl border-0">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
                <TrendingUp size={28} />
              </div>
              <div>
                <p className="text-green-100 text-sm font-medium">Total Returns</p>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">+{formatCurrency(performanceMetrics.totalReturns)}</h3>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white hover-lift shadow-xl border-0">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
                <Zap size={28} />
              </div>
              <div>
                <p className="text-purple-100 text-sm font-medium">Active Plans</p>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">{performanceMetrics.totalPlansActive}</h3>
              </div>
            </div>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-md p-2 mb-8 animate-fadeIn">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            <button
              onClick={() => setActiveTab('plans')}
              className={`py-3 px-3 sm:py-3 sm:px-4 rounded-lg font-semibold transition-all text-xs sm:text-sm min-h-[44px] active:scale-95 ${
                activeTab === 'plans'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
              }`}
            >
              AI Plans
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`py-3 px-3 sm:py-3 sm:px-4 rounded-lg font-semibold transition-all text-xs sm:text-sm min-h-[44px] active:scale-95 ${
                activeTab === 'performance'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
              }`}
            >
              Performance
            </button>
            <button
              onClick={() => setActiveTab('backtest')}
              className={`py-3 px-3 sm:py-3 sm:px-4 rounded-lg font-semibold transition-all text-xs sm:text-sm min-h-[44px] active:scale-95 ${
                activeTab === 'backtest'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
              }`}
            >
              Backtest
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`py-3 px-3 sm:py-3 sm:px-4 rounded-lg font-semibold transition-all text-xs sm:text-sm min-h-[44px] active:scale-95 ${
                activeTab === 'rules'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
              }`}
            >
              Rules
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fadeIn">
          {/* AI Plans Tab */}
          {activeTab === 'plans' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
                  <Bot className="text-indigo-600" size={28} />
                  <span>AI-Recommended Investment Plans</span>
                </h2>
                <p className="text-gray-600">
                  Choose from {aiInvestmentPlans.length} AI-curated investment strategies tailored to different risk profiles
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {aiInvestmentPlans.map((plan) => (
                  <InvestmentPlanCard
                    key={plan.id}
                    plan={plan}
                    onActivate={handleActivatePlan}
                    isActive={activePlans.some((ap) => ap.planId === plan.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <PerformanceTracker
              activePlans={activePlans}
              performanceMetrics={performanceMetrics}
              onTogglePlan={handleTogglePlan}
            />
          )}

          {/* Backtest Tab */}
          {activeTab === 'backtest' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">Historical Backtesting</h2>
                <p className="text-gray-600 mb-4">
                  Select a plan to view its historical performance over the past 5 years
                </p>

                {/* Plan Selector */}
                <div className="flex flex-wrap gap-2">
                  {aiInvestmentPlans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => handleSelectPlanForBacktest(plan.id)}
                      className={`px-4 py-3 min-h-[44px] rounded-lg font-semibold transition-all flex items-center ${
                        selectedPlanForBacktest === plan.id
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                          : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {plan.icon} {plan.name}
                    </button>
                  ))}
                </div>
              </div>

              {backtestLoading ? (
                <div className="flex items-center justify-center py-10">
                  <LoadingSpinner message="Loading backtest results..." />
                </div>
              ) : (
                <BacktestResults backtest={backtestData?.[selectedPlanForBacktest] || backtestData} />
              )}
            </div>
          )}

          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <Settings className="text-indigo-600" size={28} />
                  <span>Investment Rule Builder</span>
                </h2>
                <p className="text-gray-600 mb-4">
                  Customize automated investment rules for your selected plan
                </p>

                {/* Plan Selector for Rules */}
                <div className="flex flex-wrap gap-2">
                  {aiInvestmentPlans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => handleSelectPlanForRules(plan)}
                      className={`px-4 py-3 min-h-[44px] rounded-lg font-semibold transition-all flex items-center ${
                        selectedPlanForRules?.id === plan.id
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                          : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      {plan.icon} {plan.name}
                    </button>
                  ))}
                </div>
              </div>

              <RuleBuilder selectedPlan={selectedPlanForRules} />
            </div>
          )}
        </div>

        {/* Transaction Log Section */}
        {activeTab === 'performance' && autoInvestTransactions.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6 border-2 border-gray-100 animate-fadeIn">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4">Recent Auto-Invest Transactions</h3>
            <div className="space-y-2">
              {autoInvestTransactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        transaction.type === 'Buy'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {transaction.type}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{transaction.asset}</p>
                      <p className="text-xs text-gray-600">{transaction.trigger}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(transaction.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoInvest;
