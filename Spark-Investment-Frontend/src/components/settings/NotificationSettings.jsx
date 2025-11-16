// src/components/settings/NotificationSettings.jsx

import { useState } from 'react';
import { Bell, Mail, MessageSquare, Smartphone, Check, Clock } from 'lucide-react';

const NotificationSettings = ({ settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleToggle = (category, field) => {
    setLocalSettings({
      ...localSettings,
      [category]: {
        ...localSettings[category],
        [field]: !localSettings[category][field],
      },
    });
    setSaved(false);
  };

  const handleFrequencyChange = (field, value) => {
    setLocalSettings({
      ...localSettings,
      frequency: {
        ...localSettings.frequency,
        [field]: value,
      },
    });
    setSaved(false);
  };

  const handleSave = () => {
    onSave(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const ToggleSwitch = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-indigo-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
            <Bell className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Notification Settings</h3>
            <p className="text-sm text-gray-600">Manage how you receive updates</p>
          </div>
        </div>
        {saved && (
          <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg animate-fadeIn">
            <Check size={16} />
            <span className="text-sm font-semibold">Saved!</span>
          </div>
        )}
      </div>

      {/* Email Notifications */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Mail className="text-blue-600" size={20} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive updates via email</p>
            </div>
          </div>
          <ToggleSwitch
            enabled={localSettings.email.enabled}
            onChange={() => handleToggle('email', 'enabled')}
          />
        </div>

        {localSettings.email.enabled && (
          <div className="space-y-3 pl-11 animate-fadeIn">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Market Alerts</p>
                <p className="text-xs text-gray-600">Get notified about market movements</p>
              </div>
              <ToggleSwitch
                enabled={localSettings.email.marketAlerts}
                onChange={() => handleToggle('email', 'marketAlerts')}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Price Alerts</p>
                <p className="text-xs text-gray-600">Alerts when stocks reach target prices</p>
              </div>
              <ToggleSwitch
                enabled={localSettings.email.priceAlerts}
                onChange={() => handleToggle('email', 'priceAlerts')}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Portfolio Updates</p>
                <p className="text-xs text-gray-600">Daily/weekly portfolio summaries</p>
              </div>
              <ToggleSwitch
                enabled={localSettings.email.portfolioUpdates}
                onChange={() => handleToggle('email', 'portfolioUpdates')}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Transaction Confirmations</p>
                <p className="text-xs text-gray-600">Confirm all buy/sell transactions</p>
              </div>
              <ToggleSwitch
                enabled={localSettings.email.transactionConfirmations}
                onChange={() => handleToggle('email', 'transactionConfirmations')}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Monthly Reports</p>
                <p className="text-xs text-gray-600">Comprehensive monthly performance</p>
              </div>
              <ToggleSwitch
                enabled={localSettings.email.monthlyReports}
                onChange={() => handleToggle('email', 'monthlyReports')}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900 text-sm">AI Recommendations</p>
                <p className="text-xs text-gray-600">AI-powered investment insights</p>
              </div>
              <ToggleSwitch
                enabled={localSettings.email.aiRecommendations}
                onChange={() => handleToggle('email', 'aiRecommendations')}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900 text-sm">News & Updates</p>
                <p className="text-xs text-gray-600">Market news and platform updates</p>
              </div>
              <ToggleSwitch
                enabled={localSettings.email.newsAndUpdates}
                onChange={() => handleToggle('email', 'newsAndUpdates')}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Promotional Emails</p>
                <p className="text-xs text-gray-600">Special offers and promotions</p>
              </div>
              <ToggleSwitch
                enabled={localSettings.email.promotionalEmails}
                onChange={() => handleToggle('email', 'promotionalEmails')}
              />
            </div>
          </div>
        )}
      </div>

      {/* SMS Notifications */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <MessageSquare className="text-green-600" size={20} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">SMS Notifications</h4>
              <p className="text-sm text-gray-600">Receive important alerts via SMS</p>
            </div>
          </div>
          <ToggleSwitch
            enabled={localSettings.sms.enabled}
            onChange={() => handleToggle('sms', 'enabled')}
          />
        </div>

        {localSettings.sms.enabled && (
          <div className="space-y-3 pl-11 animate-fadeIn">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Transaction Alerts</p>
                <p className="text-xs text-gray-600">Instant transaction confirmations</p>
              </div>
              <ToggleSwitch
                enabled={localSettings.sms.transactionAlerts}
                onChange={() => handleToggle('sms', 'transactionAlerts')}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Security Alerts</p>
                <p className="text-xs text-gray-600">Account security notifications</p>
              </div>
              <ToggleSwitch
                enabled={localSettings.sms.securityAlerts}
                onChange={() => handleToggle('sms', 'securityAlerts')}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Login Alerts</p>
                <p className="text-xs text-gray-600">New device login notifications</p>
              </div>
              <ToggleSwitch
                enabled={localSettings.sms.loginAlerts}
                onChange={() => handleToggle('sms', 'loginAlerts')}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Payment Reminders</p>
                <p className="text-xs text-gray-600">SIP and payment due dates</p>
              </div>
              <ToggleSwitch
                enabled={localSettings.sms.paymentReminders}
                onChange={() => handleToggle('sms', 'paymentReminders')}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Price Alerts</p>
                <p className="text-xs text-gray-600">Stock price target alerts</p>
              </div>
              <ToggleSwitch
                enabled={localSettings.sms.priceAlerts}
                onChange={() => handleToggle('sms', 'priceAlerts')}
              />
            </div>
          </div>
        )}
      </div>

      {/* Push Notifications */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Smartphone className="text-purple-600" size={20} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">Push Notifications</h4>
              <p className="text-sm text-gray-600">Real-time alerts on your devices</p>
            </div>
          </div>
          <ToggleSwitch
            enabled={localSettings.push.enabled}
            onChange={() => handleToggle('push', 'enabled')}
          />
        </div>

        {localSettings.push.enabled && (
          <div className="space-y-3 pl-11 animate-fadeIn">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Market Movements</p>
                <p className="text-xs text-gray-600">Significant market changes</p>
              </div>
              <ToggleSwitch
                enabled={localSettings.push.marketMovements}
                onChange={() => handleToggle('push', 'marketMovements')}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Goal Milestones</p>
                <p className="text-xs text-gray-600">Investment goal achievements</p>
              </div>
              <ToggleSwitch
                enabled={localSettings.push.goalMilestones}
                onChange={() => handleToggle('push', 'goalMilestones')}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Auto-Invest Executions</p>
                <p className="text-xs text-gray-600">Automated investment updates</p>
              </div>
              <ToggleSwitch
                enabled={localSettings.push.autoInvestExecutions}
                onChange={() => handleToggle('push', 'autoInvestExecutions')}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Portfolio Changes</p>
                <p className="text-xs text-gray-600">Holdings and allocation changes</p>
              </div>
              <ToggleSwitch
                enabled={localSettings.push.portfolioChanges}
                onChange={() => handleToggle('push', 'portfolioChanges')}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Security Alerts</p>
                <p className="text-xs text-gray-600">Critical security notifications</p>
              </div>
              <ToggleSwitch
                enabled={localSettings.push.securityAlerts}
                onChange={() => handleToggle('push', 'securityAlerts')}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Daily Summary</p>
                <p className="text-xs text-gray-600">End-of-day portfolio summary</p>
              </div>
              <ToggleSwitch
                enabled={localSettings.push.dailySummary}
                onChange={() => handleToggle('push', 'dailySummary')}
              />
            </div>
          </div>
        )}
      </div>

      {/* Notification Frequency */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Clock className="text-indigo-600" size={20} />
          <span>Notification Frequency</span>
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 text-sm">Price Alerts</p>
              <p className="text-xs text-gray-600">How often to receive price notifications</p>
            </div>
            <select
              value={localSettings.frequency.priceAlerts}
              onChange={(e) => handleFrequencyChange('priceAlerts', e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              <option>Instant</option>
              <option>Hourly</option>
              <option>Daily</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 text-sm">Portfolio Updates</p>
              <p className="text-xs text-gray-600">Portfolio performance summaries</p>
            </div>
            <select
              value={localSettings.frequency.portfolioUpdates}
              onChange={(e) => handleFrequencyChange('portfolioUpdates', e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 text-sm">Market News</p>
              <p className="text-xs text-gray-600">Market insights and news updates</p>
            </div>
            <select
              value={localSettings.frequency.marketNews}
              onChange={(e) => handleFrequencyChange('marketNews', e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
        >
          Save Notification Settings
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;
