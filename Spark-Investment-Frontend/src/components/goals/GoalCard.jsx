import { Edit2, Trash2, TrendingUp, Calendar, Target, DollarSign } from 'lucide-react';
import Card from '../ui/StockCard';
import {
  calculateGoalProgress,
  calculateRemainingAmount,
  calculateMonthsRemaining,
  calculateRequiredSIP,
  getGoalCategory,
  getPriorityColor,
} from '../../data/goalsData';

const GoalCard = ({ goal, onEdit, onDelete }) => {
  const progress = calculateGoalProgress(goal);
  const remainingAmount = calculateRemainingAmount(goal);
  const monthsRemaining = calculateMonthsRemaining(goal.targetDate);
  const requiredSIP = calculateRequiredSIP(goal);
  const category = getGoalCategory(goal.category);
  const priorityColor = getPriorityColor(goal.priority);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      year: 'numeric',
    });
  };

  const isAchieved = goal.status === 'achieved';
  const isOnTrack = goal.monthlyContribution >= requiredSIP;

  return (
    <Card className={`bg-white border-2 ${isAchieved ? 'border-green-200' : 'border-gray-200'} hover:shadow-xl transition-all duration-300 relative overflow-hidden`}>
      {/* Achievement Badge */}
      {isAchieved && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
          ✓ Achieved
        </div>
      )}

      {/* Category Icon & Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`bg-${category.color}-100 p-3 rounded-xl text-2xl`}>
            {category.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{goal.name}</h3>
            <span className={`text-xs font-semibold text-${category.color}-600 bg-${category.color}-50 px-2 py-1 rounded-full`}>
              {category.name}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        {!isAchieved && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(goal)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Edit goal"
            >
              <Edit2 size={18} className="text-gray-600" />
            </button>
            <button
              onClick={() => onDelete(goal.id)}
              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
              aria-label="Delete goal"
            >
              <Trash2 size={18} className="text-red-600" />
            </button>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4">{goal.description}</p>

      {/* Target & Current Amount */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Target Amount</p>
          <p className="text-lg font-bold text-indigo-600">{formatCurrency(goal.targetAmount)}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Current Amount</p>
          <p className="text-lg font-bold text-green-600">{formatCurrency(goal.currentAmount)}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">Progress</span>
          <span className="text-sm font-bold text-indigo-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isAchieved
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : progress >= 75
                ? 'bg-gradient-to-r from-green-500 to-green-600'
                : progress >= 50
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                : 'bg-gradient-to-r from-indigo-500 to-purple-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      {!isAchieved && (
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-gray-500" />
            <div>
              <p className="text-xs text-gray-600">Time Left</p>
              <p className="font-semibold text-gray-900">{monthsRemaining} months</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Target size={16} className="text-gray-500" />
            <div>
              <p className="text-xs text-gray-600">Remaining</p>
              <p className="font-semibold text-gray-900">{formatCurrency(remainingAmount)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp size={16} className="text-gray-500" />
            <div>
              <p className="text-xs text-gray-600">Monthly SIP</p>
              <p className="font-semibold text-gray-900">{formatCurrency(goal.monthlyContribution)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign size={16} className="text-gray-500" />
            <div>
              <p className="text-xs text-gray-600">Required SIP</p>
              <p className={`font-semibold ${isOnTrack ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(requiredSIP)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Date */}
      {isAchieved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-green-800">
            <span className="font-semibold">Achieved on:</span> {formatDate(goal.achievedDate)}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-${priorityColor}-100 text-${priorityColor}-700`}>
            {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
          </span>
        </div>
        <div className="text-xs text-gray-600">
          Target: <span className="font-semibold">{formatDate(goal.targetDate)}</span>
        </div>
      </div>

      {/* On Track Indicator */}
      {!isAchieved && (
        <div className={`mt-3 p-2 rounded-lg text-xs text-center font-semibold ${
          isOnTrack
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-orange-50 text-orange-700 border border-orange-200'
        }`}>
          {isOnTrack ? '✓ On Track' : `⚠ Increase SIP by ${formatCurrency(requiredSIP - goal.monthlyContribution)}`}
        </div>
      )}
    </Card>
  );
};

export default GoalCard;
