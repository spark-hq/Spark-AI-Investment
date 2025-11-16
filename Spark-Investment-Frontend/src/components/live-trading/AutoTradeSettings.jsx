import { useState } from 'react';
import { Settings, DollarSign, Shield, Bell, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import Card from '../ui/StockCard';
import Button from '../ui/Button';

const AutoTradeSettings = ({ settings, onSettingsChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  const handleToggleAutoTrade = () => {
    const newSettings = { ...localSettings, enabled: !localSettings.enabled };
    setLocalSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const handleInputChange = (field, value) => {
    const newSettings = { ...localSettings, [field]: value };
    setLocalSettings(newSettings);
  };

  const handleSaveSettings = () => {
    onSettingsChange?.(localSettings);
    setIsExpanded(false);
  };

  const handleNotificationToggle = (type) => {
    const newNotifications = {
      ...localSettings.notifications,
      [type]: !localSettings.notifications[type],
    };
    setLocalSettings({
      ...localSettings,
      notifications: newNotifications,
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const usedAmount = 2500; // Mock used amount
  const availableAmount = localSettings.dailyLimit - usedAmount;
  const usagePercentage = (usedAmount / localSettings.dailyLimit) * 100;

  return (
    <Card className="bg-white border-2 border-indigo-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl">
            <Settings className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Auto-Trading</h3>
            <p className="text-sm text-gray-600">AI-powered execution</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold"
        >
          {isExpanded ? 'Collapse' : 'Expand'} ⚙️
        </button>
      </div>

      {/* Status Toggle */}
      <div className={`rounded-xl p-4 mb-4 border-2 ${localSettings.enabled ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${localSettings.enabled ? 'bg-green-500' : 'bg-gray-400'}`}>
              {localSettings.enabled ? (
                <TrendingUp className="text-white" size={24} />
              ) : (
                <Shield className="text-white" size={24} />
              )}
            </div>
            <div>
              <p className={`font-bold ${localSettings.enabled ? 'text-green-900' : 'text-gray-900'}`}>
                {localSettings.enabled ? 'Auto-Trading Active' : 'Auto-Trading Inactive'}
              </p>
              <p className={`text-xs ${localSettings.enabled ? 'text-green-700' : 'text-gray-600'}`}>
                {localSettings.enabled ? 'AI will execute trades automatically' : 'Manual trading only'}
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleAutoTrade}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              localSettings.enabled ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                localSettings.enabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {localSettings.enabled && (
          <div className="bg-white rounded-lg p-3 border border-green-200">
            <div className="flex items-center space-x-2 text-xs text-green-800">
              <AlertCircle size={14} />
              <span>Trades will execute based on AI signals within your set limits</span>
            </div>
          </div>
        )}
      </div>

      {/* Daily Limit Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
            <DollarSign size={16} />
            <span>Daily Limit</span>
          </span>
          <span className="text-sm font-bold text-indigo-600">
            {formatCurrency(usedAmount)} / {formatCurrency(localSettings.dailyLimit)}
          </span>
        </div>
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              usagePercentage > 80 ? 'bg-red-500' : usagePercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${usagePercentage}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-600">Used: {formatCurrency(usedAmount)}</span>
          <span className="text-xs text-green-600 font-semibold">
            Available: {formatCurrency(availableAmount)}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
          <p className="text-xs text-blue-900 mb-1">Per Trade Limit</p>
          <p className="text-lg font-bold text-blue-900">{formatCurrency(localSettings.perTradeLimit)}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200">
          <p className="text-xs text-purple-900 mb-1">Max Trades/Day</p>
          <p className="text-lg font-bold text-purple-900">{localSettings.maxTradesPerDay} trades</p>
        </div>
      </div>

      {/* Expanded Settings */}
      {isExpanded && (
        <div className="border-t-2 border-gray-100 pt-4 space-y-4 animate-fadeIn">
          {/* Daily Limit Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Daily Trading Limit
            </label>
            <input
              type="number"
              value={localSettings.dailyLimit}
              onChange={(e) => handleInputChange('dailyLimit', Number(e.target.value))}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              placeholder="10000"
            />
          </div>

          {/* Per Trade Limit */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Per Trade Limit
            </label>
            <input
              type="number"
              value={localSettings.perTradeLimit}
              onChange={(e) => handleInputChange('perTradeLimit', Number(e.target.value))}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              placeholder="2000"
            />
          </div>

          {/* Max Trades Per Day */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Max Trades Per Day
            </label>
            <input
              type="number"
              value={localSettings.maxTradesPerDay}
              onChange={(e) => handleInputChange('maxTradesPerDay', Number(e.target.value))}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              placeholder="5"
            />
          </div>

          {/* Risk Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Risk Tolerance
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['low', 'medium', 'high'].map((risk) => (
                <button
                  key={risk}
                  onClick={() => handleInputChange('riskLevel', risk)}
                  className={`py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                    localSettings.riskLevel === risk
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {risk.charAt(0).toUpperCase() + risk.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Auto Stop-Loss */}
          <div className="bg-red-50 rounded-lg p-3 border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Shield className="text-red-600" size={20} />
                <span className="text-sm font-semibold text-red-900">Auto Stop-Loss</span>
              </div>
              <button
                onClick={() => handleInputChange('autoStopLoss', !localSettings.autoStopLoss)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.autoStopLoss ? 'bg-red-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.autoStopLoss ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {localSettings.autoStopLoss && (
              <div className="mt-2">
                <input
                  type="number"
                  value={localSettings.stopLossPercent}
                  onChange={(e) => handleInputChange('stopLossPercent', Number(e.target.value))}
                  className="w-full px-3 py-2 border-2 border-red-200 rounded-lg focus:border-red-500 focus:outline-none"
                  placeholder="3"
                  step="0.5"
                />
                <p className="text-xs text-red-700 mt-1">Stop-loss percentage below entry</p>
              </div>
            )}
          </div>

          {/* Auto Target */}
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="text-green-600" size={20} />
                <span className="text-sm font-semibold text-green-900">Auto Target</span>
              </div>
              <button
                onClick={() => handleInputChange('autoTarget', !localSettings.autoTarget)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.autoTarget ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.autoTarget ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {localSettings.autoTarget && (
              <div className="mt-2">
                <input
                  type="number"
                  value={localSettings.targetPercent}
                  onChange={(e) => handleInputChange('targetPercent', Number(e.target.value))}
                  className="w-full px-3 py-2 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
                  placeholder="5"
                  step="0.5"
                />
                <p className="text-xs text-green-700 mt-1">Target profit percentage</p>
              </div>
            )}
          </div>

          {/* Trading Hours */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
              <Clock size={16} />
              <span>Trading Hours</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600">Start Time</label>
                <input
                  type="time"
                  value={localSettings.tradingHours.start}
                  onChange={(e) =>
                    handleInputChange('tradingHours', {
                      ...localSettings.tradingHours,
                      start: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">End Time</label>
                <input
                  type="time"
                  value={localSettings.tradingHours.end}
                  onChange={(e) =>
                    handleInputChange('tradingHours', {
                      ...localSettings.tradingHours,
                      end: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
              <Bell size={16} />
              <span>Notifications</span>
            </label>
            <div className="space-y-2">
              {Object.entries(localSettings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <button
                    onClick={() => handleNotificationToggle(key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSaveSettings}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg"
          >
            Save Settings
          </Button>
        </div>
      )}
    </Card>
  );
};

export default AutoTradeSettings;