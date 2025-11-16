// src/components/settings/SafetyControls.jsx

import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, TrendingUp, DollarSign, Target, Clock, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';

const SafetyControls = ({ settings, onSave }) => {
  const [formData, setFormData] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setFormData(settings);
    setHasChanges(false);
  }, [settings]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(formData);
    setHasChanges(false);
  };

  const handleEmergencyStop = () => {
    if (confirm('⚠️ Are you sure you want to activate EMERGENCY STOP?\n\nThis will:\n- Disable all auto-trading immediately\n- Cancel pending orders\n- Require manual reactivation')) {
      handleChange('emergencyStopActive', true);
      handleChange('autoTradingEnabled', false);
      onSave({
        ...formData,
        emergencyStopActive: true,
        autoTradingEnabled: false,
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Shield className="text-indigo-600" size={28} />
            <span>Safety Controls</span>
          </h2>
          <p className="text-gray-600 mt-1">
            Configure auto-trading limits and safety mechanisms
          </p>
        </div>

        {/* Emergency Stop Button */}
        <Button
          onClick={handleEmergencyStop}
          variant="outline"
          className="bg-red-50 border-red-300 text-red-700 hover:bg-red-100 hover:border-red-400 font-bold"
        >
          <AlertTriangle size={18} />
          <span>EMERGENCY STOP</span>
        </Button>
      </div>

      {/* Emergency Stop Banner */}
      {formData.emergencyStopActive && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={24} />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-900">🚨 Emergency Stop Active</h3>
              <p className="text-red-700 text-sm mt-1">
                All auto-trading is disabled. Re-enable auto-trading below to resume.
              </p>
            </div>
            <Button
              onClick={() => {
                handleChange('emergencyStopActive', false);
                handleSave();
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Deactivate
            </Button>
          </div>
        </div>
      )}

      {/* Auto-Trading Toggle */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border-2 border-indigo-200">
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-3">
            <TrendingUp className="text-indigo-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="text-lg font-bold text-gray-900">Auto-Trading</h3>
              <p className="text-sm text-gray-600 mt-1">
                Enable AI to execute trades automatically based on recommendations
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.autoTradingEnabled}
              onChange={(e) => handleChange('autoTradingEnabled', e.target.checked)}
              disabled={formData.emergencyStopActive}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>

      {/* Trading Limits */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Daily Limit */}
        <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <DollarSign className="text-green-600" size={20} />
            <h3 className="text-lg font-bold text-gray-900">Daily Limit</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Maximum amount to trade per day
          </p>
          <input
            type="number"
            value={formData.dailyLimit}
            onChange={(e) => handleChange('dailyLimit', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none text-lg font-semibold"
            min="0"
            step="1000"
          />
          <p className="text-xs text-gray-500 mt-2">
            Current: {formatCurrency(formData.dailyLimit)}
          </p>
        </div>

        {/* Per-Trade Limit */}
        <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="text-purple-600" size={20} />
            <h3 className="text-lg font-bold text-gray-900">Per-Trade Limit</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Maximum amount per single trade
          </p>
          <input
            type="number"
            value={formData.perTradeLimit}
            onChange={(e) => handleChange('perTradeLimit', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none text-lg font-semibold"
            min="0"
            step="500"
          />
          <p className="text-xs text-gray-500 mt-2">
            Current: {formatCurrency(formData.perTradeLimit)}
          </p>
        </div>
      </div>

      {/* Confidence Threshold */}
      <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <CheckCircle className="text-blue-600" size={20} />
          <h3 className="text-lg font-bold text-gray-900">Minimum AI Confidence</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Only execute trades when AI confidence is above this threshold
        </p>
        <div className="space-y-4">
          <input
            type="range"
            value={formData.minConfidenceThreshold}
            onChange={(e) => handleChange('minConfidenceThreshold', parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            min="50"
            max="95"
            step="5"
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Lower confidence (50%)</span>
            <span className="text-2xl font-bold text-indigo-600">
              {formData.minConfidenceThreshold}%
            </span>
            <span className="text-sm text-gray-600">Higher confidence (95%)</span>
          </div>
        </div>
      </div>

      {/* Additional Settings */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Max Daily Trades */}
        <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="text-orange-600" size={20} />
            <h3 className="text-lg font-bold text-gray-900">Max Daily Trades</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Maximum number of trades per day
          </p>
          <input
            type="number"
            value={formData.maxDailyTrades}
            onChange={(e) => handleChange('maxDailyTrades', parseInt(e.target.value) || 1)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none text-lg font-semibold"
            min="1"
            max="20"
          />
        </div>

        {/* Approval & After Hours */}
        <div className="bg-white rounded-lg p-6 border-2 border-gray-200 space-y-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="text-teal-600" size={20} />
            <h3 className="text-lg font-bold text-gray-900">Trading Rules</h3>
          </div>

          {/* Require Approval */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-semibold text-gray-900">Require Approval</p>
              <p className="text-xs text-gray-600">Manual approval before execution</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.requireApproval}
                onChange={(e) => handleChange('requireApproval', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Allow After Hours */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-semibold text-gray-900">Allow After Hours</p>
              <p className="text-xs text-gray-600">Trade outside market hours</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowAfterHours}
                onChange={(e) => handleChange('allowAfterHours', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end space-x-4 pt-4 border-t">
        {hasChanges && (
          <p className="text-sm text-orange-600 font-medium">
            ⚠️ You have unsaved changes
          </p>
        )}
        <Button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`${
            hasChanges
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-gray-300 cursor-not-allowed'
          } text-white px-8 py-3`}
        >
          {hasChanges ? 'Save Safety Settings' : 'No Changes'}
        </Button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="text-blue-600 flex-shrink-0 mt-1" size={20} />
          <div>
            <h4 className="font-bold text-blue-900 mb-2">Safety First</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• All trades are monitored in real-time</li>
              <li>• Limits reset daily at midnight IST</li>
              <li>• Emergency stop can be activated anytime</li>
              <li>• Higher confidence threshold = safer but fewer trades</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyControls;
