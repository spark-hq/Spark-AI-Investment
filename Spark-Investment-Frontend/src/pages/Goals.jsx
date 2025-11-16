import { useState } from 'react';
import { Plus, Target, TrendingUp, DollarSign, CheckCircle, Filter } from 'lucide-react';
import GoalCard from '../components/goals/GoalCard';
import CreateGoalModal from '../components/goals/CreateGoalModal';
import { mockGoals as initialGoals, getGoalsSummary, goalCategories } from '../data/goalsData';

const Goals = () => {
  const [goals, setGoals] = useState(initialGoals);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('priority');

  const summary = getGoalsSummary(goals);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Filter and sort goals
  const filteredGoals = goals
    .filter((goal) => {
      if (filterCategory !== 'all' && goal.category !== filterCategory) return false;
      if (filterStatus !== 'all' && goal.status !== filterStatus) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortBy === 'targetDate') {
        return new Date(a.targetDate) - new Date(b.targetDate);
      } else if (sortBy === 'progress') {
        const progressA = (a.currentAmount / a.targetAmount) * 100;
        const progressB = (b.currentAmount / b.targetAmount) * 100;
        return progressB - progressA;
      } else if (sortBy === 'amount') {
        return b.targetAmount - a.targetAmount;
      }
      return 0;
    });

  const handleCreateGoal = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleDeleteGoal = (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      setGoals(goals.filter((g) => g.id !== goalId));
    }
  };

  const handleSaveGoal = (goalData) => {
    if (editingGoal) {
      // Update existing goal
      setGoals(goals.map((g) => (g.id === goalData.id ? goalData : g)));
    } else {
      // Add new goal
      setGoals([...goals, goalData]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl">
                <Target className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Financial Goals</h1>
                <p className="text-gray-600 mt-1">Track and achieve your financial milestones</p>
              </div>
            </div>
            <button
              onClick={handleCreateGoal}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Create Goal</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border-2 border-indigo-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Goals</p>
              <Target className="text-indigo-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{summary.totalGoals}</p>
            <p className="text-xs text-gray-500 mt-1">
              {summary.activeGoals} active, {summary.achievedGoals} achieved
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-2 border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Target Amount</p>
              <DollarSign className="text-purple-600" size={24} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalTargetAmount)}</p>
            <p className="text-xs text-gray-500 mt-1">Across all active goals</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-2 border-green-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Current Savings</p>
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalCurrentAmount)}</p>
            <p className="text-xs text-gray-500 mt-1">{summary.overallProgress}% of target</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-2 border-orange-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Monthly SIP</p>
              <CheckCircle className="text-orange-600" size={24} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalMonthlyContribution)}</p>
            <p className="text-xs text-gray-500 mt-1">Total investments/month</p>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900">Overall Progress</h3>
            <span className="text-2xl font-bold text-indigo-600">{summary.overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000"
              style={{ width: `${summary.overallProgress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
            <span>Saved: {formatCurrency(summary.totalCurrentAmount)}</span>
            <span>Remaining: {formatCurrency(summary.remainingAmount)}</span>
          </div>
        </div>

        {/* Filters & Sort */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border-2 border-gray-200 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter size={20} className="text-gray-600" />
            <h3 className="text-lg font-bold text-gray-900">Filters & Sort</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label htmlFor="filterCategory" className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                id="filterCategory"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="all">All Categories</option>
                {goalCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="filterStatus" className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="all">All Goals</option>
                <option value="active">Active</option>
                <option value="achieved">Achieved</option>
                <option value="paused">Paused</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label htmlFor="sortBy" className="block text-sm font-semibold text-gray-700 mb-2">
                Sort By
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="priority">Priority</option>
                <option value="targetDate">Target Date</option>
                <option value="progress">Progress</option>
                <option value="amount">Target Amount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Goals Grid */}
        {filteredGoals.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-md border-2 border-gray-200">
            <Target className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Goals Found</h3>
            <p className="text-gray-600 mb-6">
              {goals.length === 0
                ? 'Start your financial journey by creating your first goal!'
                : 'Try adjusting your filters to see more goals.'}
            </p>
            {goals.length === 0 && (
              <button
                onClick={handleCreateGoal}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                <Plus size={20} />
                <span>Create Your First Goal</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onEdit={handleEditGoal} onDelete={handleDeleteGoal} />
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Goal Modal */}
      <CreateGoalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGoal(null);
        }}
        onSave={handleSaveGoal}
        editGoal={editingGoal}
      />
    </div>
  );
};

export default Goals;
