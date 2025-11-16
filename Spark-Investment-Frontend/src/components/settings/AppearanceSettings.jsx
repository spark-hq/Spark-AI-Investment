// src/components/settings/AppearanceSettings.jsx

import { useState } from 'react';
import { Palette, Sun, Moon, Monitor, Check, Type, Eye, Sparkles } from 'lucide-react';

const AppearanceSettings = ({ settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [saved, setSaved] = useState(false);

  const themes = [
    { value: 'light', name: 'Light', icon: Sun, description: 'Light theme for daytime' },
    { value: 'dark', name: 'Dark', icon: Moon, description: 'Dark theme for nighttime' },
    { value: 'auto', name: 'Auto', icon: Monitor, description: 'Follows system preference' },
  ];

  const accentColors = [
    { value: 'indigo', name: 'Indigo', color: '#6366f1' },
    { value: 'blue', name: 'Blue', color: '#3b82f6' },
    { value: 'purple', name: 'Purple', color: '#a855f7' },
    { value: 'green', name: 'Green', color: '#10b981' },
    { value: 'orange', name: 'Orange', color: '#f97316' },
    { value: 'pink', name: 'Pink', color: '#ec4899' },
  ];

  const fontSizes = [
    { value: 'small', name: 'Small', size: '14px' },
    { value: 'medium', name: 'Medium', size: '16px' },
    { value: 'large', name: 'Large', size: '18px' },
  ];

  const handleChange = (field, value) => {
    setLocalSettings({ ...localSettings, [field]: value });
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
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
            <Palette className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Appearance</h3>
            <p className="text-sm text-gray-600">Customize the look and feel of your app</p>
          </div>
        </div>
        {saved && (
          <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg animate-fadeIn">
            <Check size={16} />
            <span className="text-sm font-semibold">Saved!</span>
          </div>
        )}
      </div>

      {/* Theme Selection */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
        <h4 className="text-lg font-bold text-gray-900 mb-4">Theme</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((theme) => {
            const IconComponent = theme.icon;
            const isSelected = localSettings.theme === theme.value;
            return (
              <button
                key={theme.value}
                onClick={() => handleChange('theme', theme.value)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <IconComponent
                    className={isSelected ? 'text-indigo-600' : 'text-gray-600'}
                    size={24}
                  />
                  {isSelected && <Check className="text-indigo-600" size={20} />}
                </div>
                <h5 className="font-bold text-gray-900 mb-1">{theme.name}</h5>
                <p className="text-xs text-gray-600">{theme.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accent Color */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Sparkles className="text-indigo-600" size={20} />
          <span>Accent Color</span>
        </h4>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {accentColors.map((color) => {
            const isSelected = localSettings.accentColor === color.value;
            return (
              <button
                key={color.value}
                onClick={() => handleChange('accentColor', color.value)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-gray-900 shadow-lg'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <div
                  className="w-full h-12 rounded-lg mb-2"
                  style={{ backgroundColor: color.color }}
                ></div>
                <p className="text-xs font-semibold text-gray-900">{color.name}</p>
                {isSelected && (
                  <div className="flex justify-center mt-1">
                    <Check className="text-gray-900" size={16} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Font Size */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Type className="text-indigo-600" size={20} />
          <span>Font Size</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fontSizes.map((size) => {
            const isSelected = localSettings.fontSize === size.value;
            return (
              <button
                key={size.value}
                onClick={() => handleChange('fontSize', size.value)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: size.size }} className="font-semibold text-gray-900">
                    Aa
                  </span>
                  {isSelected && <Check className="text-indigo-600" size={20} />}
                </div>
                <p className="text-sm font-semibold text-gray-900">{size.name}</p>
                <p className="text-xs text-gray-600">{size.size}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional Settings */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Eye className="text-indigo-600" size={20} />
          <span>Visual Preferences</span>
        </h4>
        <div className="space-y-4">
          {/* Show Animations */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900">Show Animations</p>
              <p className="text-sm text-gray-600">Enable smooth transitions and animations</p>
            </div>
            <button
              onClick={() => handleChange('showAnimations', !localSettings.showAnimations)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.showAnimations ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.showAnimations ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900">High Contrast</p>
              <p className="text-sm text-gray-600">Increase contrast for better visibility</p>
            </div>
            <button
              onClick={() => handleChange('highContrast', !localSettings.highContrast)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.highContrast ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.highContrast ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900">Reduced Motion</p>
              <p className="text-sm text-gray-600">Minimize animations and motion effects</p>
            </div>
            <button
              onClick={() => handleChange('reducedMotion', !localSettings.reducedMotion)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.reducedMotion ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
        >
          Save Appearance Settings
        </button>
      </div>
    </div>
  );
};

export default AppearanceSettings;
