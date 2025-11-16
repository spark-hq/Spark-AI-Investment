import { useState, useEffect } from 'react';
import { X, Target } from 'lucide-react';
import { goalCategories } from '../../data/goalsData';

const CreateGoalModal = ({ isOpen, onClose, onSave, editGoal }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'retirement',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    monthlyContribution: '',
    priority: 'medium',
    description: '',
    expectedReturns: '12',
  });

  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (editGoal) {
      setFormData({
        name: editGoal.name,
        category: editGoal.category,
        targetAmount: editGoal.targetAmount.toString(),
        currentAmount: editGoal.currentAmount.toString(),
        targetDate: editGoal.targetDate,
        monthlyContribution: editGoal.monthlyContribution.toString(),
        priority: editGoal.priority,
        description: editGoal.description,
        expectedReturns: editGoal.expectedReturns.toString(),
      });
    } else {
      // Reset form for new goal
      setFormData({
        name: '',
        category: 'retirement',
        targetAmount: '',
        currentAmount: '0',
        targetDate: '',
        monthlyContribution: '',
        priority: 'medium',
        description: '',
        expectedReturns: '12',
      });
    }
    setErrors({});
  }, [editGoal, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Goal name is required';
    }

    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Target amount must be greater than 0';
    }

    if (!formData.currentAmount || parseFloat(formData.currentAmount) < 0) {
      newErrors.currentAmount = 'Current amount cannot be negative';
    }

    if (parseFloat(formData.currentAmount) > parseFloat(formData.targetAmount)) {
      newErrors.currentAmount = 'Current amount cannot exceed target amount';
    }

    if (!formData.targetDate) {
      newErrors.targetDate = 'Target date is required';
    } else {
      const targetDate = new Date(formData.targetDate);
      const today = new Date();
      if (targetDate <= today) {
        newErrors.targetDate = 'Target date must be in the future';
      }
    }

    if (!formData.monthlyContribution || parseFloat(formData.monthlyContribution) < 0) {
      newErrors.monthlyContribution = 'Monthly contribution must be 0 or greater';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const goalData = {
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount),
      monthlyContribution: parseFloat(formData.monthlyContribution),
      expectedReturns: parseFloat(formData.expectedReturns),
    };

    if (editGoal) {
      goalData.id = editGoal.id;
      goalData.startDate = editGoal.startDate;
      goalData.status = editGoal.status;
      goalData.linkedInvestments = editGoal.linkedInvestments || [];
    } else {
      goalData.id = Date.now();
      goalData.startDate = new Date().toISOString().split('T')[0];
      goalData.status = 'active';
      goalData.linkedInvestments = [];
    }

    onSave(goalData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Target size={28} />
            <h2 className="text-2xl font-bold">
              {editGoal ? 'Edit Goal' : 'Create New Goal'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Goal Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Goal Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Dream Home, Retirement Fund"
              className={`w-full px-4 py-3 border-2 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              {goalCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Target Amount & Current Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="targetAmount" className="block text-sm font-semibold text-gray-700 mb-2">
                Target Amount (₹) *
              </label>
              <input
                type="number"
                id="targetAmount"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleChange}
                placeholder="e.g., 5000000"
                className={`w-full px-4 py-3 border-2 ${
                  errors.targetAmount ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
              />
              {errors.targetAmount && <p className="mt-1 text-sm text-red-600">{errors.targetAmount}</p>}
            </div>

            <div>
              <label htmlFor="currentAmount" className="block text-sm font-semibold text-gray-700 mb-2">
                Current Amount (₹) *
              </label>
              <input
                type="number"
                id="currentAmount"
                name="currentAmount"
                value={formData.currentAmount}
                onChange={handleChange}
                placeholder="e.g., 1000000"
                className={`w-full px-4 py-3 border-2 ${
                  errors.currentAmount ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
              />
              {errors.currentAmount && <p className="mt-1 text-sm text-red-600">{errors.currentAmount}</p>}
            </div>
          </div>

          {/* Target Date & Monthly Contribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="targetDate" className="block text-sm font-semibold text-gray-700 mb-2">
                Target Date *
              </label>
              <input
                type="date"
                id="targetDate"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 border-2 ${
                  errors.targetDate ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
              />
              {errors.targetDate && <p className="mt-1 text-sm text-red-600">{errors.targetDate}</p>}
            </div>

            <div>
              <label htmlFor="monthlyContribution" className="block text-sm font-semibold text-gray-700 mb-2">
                Monthly SIP (₹) *
              </label>
              <input
                type="number"
                id="monthlyContribution"
                name="monthlyContribution"
                value={formData.monthlyContribution}
                onChange={handleChange}
                placeholder="e.g., 25000"
                className={`w-full px-4 py-3 border-2 ${
                  errors.monthlyContribution ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
              />
              {errors.monthlyContribution && (
                <p className="mt-1 text-sm text-red-600">{errors.monthlyContribution}</p>
              )}
            </div>
          </div>

          {/* Priority & Expected Returns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
                Priority *
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label htmlFor="expectedReturns" className="block text-sm font-semibold text-gray-700 mb-2">
                Expected Returns (% p.a.)
              </label>
              <input
                type="number"
                id="expectedReturns"
                name="expectedReturns"
                value={formData.expectedReturns}
                onChange={handleChange}
                placeholder="e.g., 12"
                step="0.1"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your financial goal..."
              rows="3"
              className={`w-full px-4 py-3 border-2 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none`}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              {editGoal ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGoalModal;
