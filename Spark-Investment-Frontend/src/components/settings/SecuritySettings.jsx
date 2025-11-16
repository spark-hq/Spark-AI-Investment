// src/components/settings/SecuritySettings.jsx

import { useState } from 'react';
import {
  Shield,
  Smartphone,
  Fingerprint,
  Clock,
  AlertTriangle,
  Check,
  X,
  Trash2,
  CheckCircle,
  XCircle,
  Monitor,
  MapPin,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const SecuritySettings = ({ settings, onSave }) => {
  // const [localSettings, setLocalSettings] = useState(settings);
  const [localSettings, setLocalSettings] = useState({
  twoFactorAuth: {
    enabled: false,
    method: "SMS",
    enabledDate: new Date().toISOString(),
  },
  biometric: {
    enabled: false,
    type: "Fingerprint",
  },
  sessionTimeout: 30,
  loginAlerts: true,
  trustedDevices: [],
  loginHistory: [],
  ...settings, // override defaults with provided data
});

  const [saved, setSaved] = useState(false);

  const handleToggle = (field) => {
    setLocalSettings({
      ...localSettings,
      [field]: !localSettings[field],
    });
    setSaved(false);
  };

  const handle2FAToggle = () => {
    setLocalSettings({
      ...localSettings,
      twoFactorAuth: {
        ...localSettings.twoFactorAuth,
        enabled: !localSettings.twoFactorAuth.enabled,
      },
    });
    setSaved(false);
  };

  const handle2FAMethodChange = (method) => {
    setLocalSettings({
      ...localSettings,
      twoFactorAuth: {
        ...localSettings.twoFactorAuth,
        method: method,
      },
    });
    setSaved(false);
  };

  const handleBiometricToggle = () => {
    setLocalSettings({
      ...localSettings,
      biometric: {
        ...localSettings.biometric,
        enabled: !localSettings.biometric.enabled,
      },
    });
    setSaved(false);
  };

  const handleBiometricTypeChange = (type) => {
    setLocalSettings({
      ...localSettings,
      biometric: {
        ...localSettings.biometric,
        type: type,
      },
    });
    setSaved(false);
  };

  const handleSessionTimeoutChange = (minutes) => {
    setLocalSettings({
      ...localSettings,
      sessionTimeout: parseInt(minutes),
    });
    setSaved(false);
  };

  const handleSave = () => {
    onSave(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRemoveDevice = (deviceId) => {
    // Remove device logic
    console.log('Removing device:', deviceId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 p-2 rounded-lg">
            <Shield className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Security Settings</h3>
            <p className="text-sm text-gray-600">Protect your account with advanced security</p>
          </div>
        </div>
        {saved && (
          <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg animate-fadeIn">
            <Check size={16} />
            <span className="text-sm font-semibold">Saved!</span>
          </div>
        )}
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Smartphone className="text-indigo-600" size={20} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security</p>
            </div>
          </div>
          <button
            onClick={handle2FAToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              localSettings.twoFactorAuth.enabled ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                localSettings.twoFactorAuth.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {localSettings.twoFactorAuth.enabled && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-green-50 p-3 rounded-lg border border-green-200 flex items-center space-x-2">
              <CheckCircle className="text-green-600" size={16} />
              <p className="text-sm text-green-700">
                2FA enabled since{' '}
                {new Date(localSettings.twoFactorAuth.enabledDate).toLocaleDateString('en-GB')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Authentication Method
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {['SMS', 'Email', 'Authenticator App'].map((method) => (
                  <button
                    key={method}
                    onClick={() => handle2FAMethodChange(method)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      localSettings.twoFactorAuth.method === method
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <p className="font-semibold text-gray-900 text-sm">{method}</p>
                    {localSettings.twoFactorAuth.method === method && (
                      <Check className="text-indigo-600 mx-auto mt-2" size={16} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Biometric Authentication */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Fingerprint className="text-purple-600" size={20} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">Biometric Authentication</h4>
              <p className="text-sm text-gray-600">Login using biometrics</p>
            </div>
          </div>
          <button
            onClick={handleBiometricToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              localSettings.biometric.enabled ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                localSettings.biometric.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {localSettings.biometric.enabled && (
          <div className="space-y-3 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {['Fingerprint', 'Face ID'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleBiometricTypeChange(type)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    localSettings.biometric.type === type
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <p className="font-semibold text-gray-900 text-sm">{type}</p>
                  {localSettings.biometric.type === type && (
                    <Check className="text-purple-600 mx-auto mt-2" size={16} />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Session Management */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Clock className="text-indigo-600" size={20} />
          <span>Session Management</span>
        </h4>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900 text-sm">Session Timeout</p>
              <p className="text-xs text-gray-600">Automatically logout after inactivity</p>
            </div>
            <select
              value={localSettings.sessionTimeout}
              onChange={(e) => handleSessionTimeoutChange(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900 text-sm">Login Alerts</p>
              <p className="text-xs text-gray-600">Get notified of new login attempts</p>
            </div>
            <button
              onClick={() => handleToggle('loginAlerts')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.loginAlerts ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Trusted Devices */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Monitor className="text-indigo-600" size={20} />
          <span>Trusted Devices</span>
        </h4>

        <div className="space-y-3">
          {localSettings.trustedDevices.map((device) => (
            <div key={device.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <p className="font-semibold text-gray-900">{device.name}</p>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {device.type}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Clock size={12} />
                      <span>Last used: {formatDistanceToNow(new Date(device.lastUsed), { addSuffix: true })}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin size={12} />
                      <span>{device.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={12} />
                      <span>Added: {new Date(device.addedDate).toLocaleDateString('en-GB')}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveDevice(device.id)}
                  className="flex items-center space-x-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg font-semibold transition-all text-xs"
                >
                  <Trash2 size={12} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Login History */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <AlertTriangle className="text-indigo-600" size={20} />
          <span>Recent Login Activity</span>
        </h4>

        <div className="space-y-3">
          {localSettings.loginHistory.map((log) => (
            <div
              key={log.id}
              className={`p-4 rounded-lg border-2 ${
                log.status === 'Success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {log.status === 'Success' ? (
                      <CheckCircle className="text-green-600" size={16} />
                    ) : (
                      <XCircle className="text-red-600" size={16} />
                    )}
                    <p className="font-semibold text-gray-900 text-sm">{log.device}</p>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        log.status === 'Success'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Clock size={12} />
                      <span>{formatDistanceToNow(new Date(log.date), { addSuffix: true })}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin size={12} />
                      <span>{log.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield size={12} />
                      <span>IP: {log.ipAddress}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Alert */}
      <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="text-yellow-600 flex-shrink-0" size={24} />
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Security Tips</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>" Enable Two-Factor Authentication for maximum security</li>
              <li>" Use a strong, unique password for your account</li>
              <li>" Regularly review your trusted devices and login history</li>
              <li>" Never share your credentials or API keys with anyone</li>
              <li>" Report any suspicious activity immediately</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
        >
          Save Security Settings
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;
