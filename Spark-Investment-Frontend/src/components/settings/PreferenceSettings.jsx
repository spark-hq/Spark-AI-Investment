// src/components/settings/PreferenceSettings.jsx

import { useState } from 'react';
import {
  Settings,
  Globe,
  DollarSign,
  Clock,
  Calendar,
  Hash,
  Layout,
  BarChart3,
  Minimize2,
  Zap,
  Volume2,
  RefreshCw,
  List,
  Check,
  LogOut,
} from 'lucide-react';

const PreferenceSettings = ({ settings, availableOptions, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setLocalSettings({
      ...localSettings,
      [field]: value,
    });
    setSaved(false);
  };

  const handleToggle = (field) => {
    setLocalSettings({
      ...localSettings,
      [field]: !localSettings[field],
    });
    setSaved(false);
  };

  const handleSave = () => {
    onSave(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-2 rounded-lg">
            <Settings className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Preferences</h3>
            <p className="text-sm text-gray-600">Customize your app experience</p>
          </div>
        </div>
        {saved && (
          <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg animate-fadeIn">
            <Check size={16} />
            <span className="text-sm font-semibold">Saved!</span>
          </div>
        )}
      </div>

      {/* Regional Settings */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Globe className="text-indigo-600" size={20} />
          <span>Regional Settings</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Language */}
          <div>
            <label className=" text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={localSettings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              {availableOptions.languages.map((lang) => (
                <option key={lang.code} value={lang.name}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Currency */}
          <div>
            <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
              <DollarSign size={14} />
              <span>Currency</span>
            </label>
            <select
              value={localSettings.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              {availableOptions.currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.name}
                </option>
              ))}
            </select>
          </div>

          {/* Timezone */}
          <div>
            <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
              <Clock size={14} />
              <span>Timezone</span>
            </label>
            <select
              value={localSettings.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              {availableOptions.timezones.map((tz) => (
                <option key={tz.code} value={tz.code}>
                  {tz.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Format */}
          <div>
            <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
              <Calendar size={14} />
              <span>Date Format</span>
            </label>
            <select
              value={localSettings.dateFormat}
              onChange={(e) => handleChange('dateFormat', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          {/* Number Format */}
          <div className="md:col-span-2">
            <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
              <Hash size={14} />
              <span>Number Format</span>
            </label>
            <select
              value={localSettings.numberFormat}
              onChange={(e) => handleChange('numberFormat', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              <option value="Indian (12,34,567)">Indian (12,34,567)</option>
              <option value="International (1,234,567)">International (1,234,567)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Layout className="text-indigo-600" size={20} />
          <span>Display Settings</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Default View */}
          <div>
            <label className=" text-sm font-medium text-gray-700 mb-2">Default View</label>
            <select
              value={localSettings.defaultView}
              onChange={(e) => handleChange('defaultView', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              <option>Dashboard</option>
              <option>Portfolio</option>
              <option>Investments</option>
              <option>Transactions</option>
            </select>
          </div>

          {/* Chart Type */}
          <div>
            <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
              <BarChart3 size={14} />
              <span>Default Chart Type</span>
            </label>
            <select
              value={localSettings.chartType}
              onChange={(e) => handleChange('chartType', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              <option>Line</option>
              <option>Candlestick</option>
              <option>Area</option>
              <option>Bar</option>
            </select>
          </div>

          {/* Data Refresh Interval */}
          <div>
            <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
              <RefreshCw size={14} />
              <span>Data Refresh Interval</span>
            </label>
            <select
              value={localSettings.dataRefreshInterval}
              onChange={(e) => handleChange('dataRefreshInterval', parseInt(e.target.value))}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              <option value="15">15 seconds</option>
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
              <option value="120">2 minutes</option>
              <option value="300">5 minutes</option>
            </select>
          </div>

          {/* Items Per Page */}
          <div>
            <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
              <List size={14} />
              <span>Items Per Page</span>
            </label>
            <select
              value={localSettings.itemsPerPage}
              onChange={(e) => handleChange('itemsPerPage', parseInt(e.target.value))}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              <option value="10">10 items</option>
              <option value="20">20 items</option>
              <option value="50">50 items</option>
              <option value="100">100 items</option>
            </select>
          </div>
        </div>
      </div>

      {/* UI Preferences */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Zap className="text-indigo-600" size={20} />
          <span>UI Preferences</span>
        </h4>

        <div className="space-y-4">
          {/* Compact Mode */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Minimize2 className="text-gray-600" size={20} />
              <div>
                <p className="font-semibold text-gray-900 text-sm">Compact Mode</p>
                <p className="text-xs text-gray-600">Reduce spacing for more content</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('compactMode')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.compactMode ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline- h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.compactMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Animations */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Zap className="text-gray-600" size={20} />
              <div>
                <p className="font-semibold text-gray-900 text-sm">Animations</p>
                <p className="text-xs text-gray-600">Enable smooth transitions</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('animations')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.animations ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline- h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.animations ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Volume2 className="text-gray-600" size={20} />
              <div>
                <p className="font-semibold text-gray-900 text-sm">Sound Effects</p>
                <p className="text-xs text-gray-600">Play sounds for actions</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('soundEffects')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.soundEffects ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline- h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.soundEffects ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Session Settings */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <LogOut className="text-indigo-600" size={20} />
          <span>Session Settings</span>
        </h4>

        <div className="space-y-4">
          {/* Auto Logout */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900 text-sm">Auto Logout</p>
              <p className="text-xs text-gray-600">Automatically logout after inactivity</p>
            </div>
            <button
              onClick={() => handleToggle('autoLogout')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.autoLogout ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline- h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.autoLogout ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {localSettings.autoLogout && (
            <div className="p-4 bg-gray-50 rounded-lg animate-fadeIn">
              <label className=" text-sm font-medium text-gray-700 mb-2">
                Auto Logout Time
              </label>
              <select
                value={localSettings.autoLogoutTime}
                onChange={(e) => handleChange('autoLogoutTime', parseInt(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default PreferenceSettings;
