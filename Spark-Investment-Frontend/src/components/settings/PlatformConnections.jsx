// src/components/settings/PlatformConnections.jsx

import { useState } from 'react';
import {
  Link as LinkIcon,
  Unlink,
  RefreshCw,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Key,
  AlertCircle,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const PlatformConnections = ({ platforms, onConnect, onDisconnect, onSync }) => {
  const [syncing, setSyncing] = useState(null);

  const handleSync = async (platformId) => {
    setSyncing(platformId);
    await onSync(platformId);
    setTimeout(() => setSyncing(null), 2000);
  };

  const getPlatformStatusColor = (status) => {
    return status === 'Connected'
      ? 'bg-green-100 text-green-700 border-green-300'
      : 'bg-gray-100 text-gray-700 border-gray-300';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 p-2 rounded-lg">
            <LinkIcon className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Connected Platforms</h3>
            <p className="text-sm text-gray-600">Manage your trading and investment platforms</p>
          </div>
        </div>
        <button
          onClick={() => onConnect()}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
        >
          <Plus size={16} />
          <span>Add Platform</span>
        </button>
      </div>

      {/* Connected Platforms Grid */}
      <div className="grid grid-cols-1 gap-6">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className={`bg-white rounded-xl shadow-md p-6 border-2 transition-all ${
              platform.status === 'Connected' ? 'border-green-200' : 'border-gray-200'
            }`}
          >
            {/* Platform Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="text-5xl">{platform.logo}</div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h4 className="text-xl font-bold text-gray-900">{platform.name}</h4>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPlatformStatusColor(
                        platform.status
                      )}`}
                    >
                      {platform.status === 'Connected' ? (
                        <span className="flex items-center space-x-1">
                          <CheckCircle size={12} />
                          <span>Connected</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1">
                          <XCircle size={12} />
                          <span>Disconnected</span>
                        </span>
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{platform.type}</p>
                </div>
              </div>

              {/* Action Buttons */}
              {platform.status === 'Connected' ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSync(platform.id)}
                    disabled={syncing === platform.id}
                    className={`flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-semibold transition-all ${
                      syncing === platform.id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <RefreshCw size={14} className={syncing === platform.id ? 'animate-spin' : ''} />
                    <span className="text-sm">Sync</span>
                  </button>
                  <button
                    onClick={() => onDisconnect(platform.id)}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-semibold transition-all"
                  >
                    <Unlink size={14} />
                    <span className="text-sm">Disconnect</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onConnect(platform.id)}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  <LinkIcon size={14} />
                  <span>Connect</span>
                </button>
              )}
            </div>

            {/* Platform Details (only if connected) */}
            {platform.status === 'Connected' && (
              <div className="space-y-4 animate-fadeIn">
                {/* Connection Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock size={14} className="text-gray-600" />
                      <p className="text-xs font-medium text-gray-600">Connected Since</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(platform.connectedDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <RefreshCw size={14} className="text-gray-600" />
                      <p className="text-xs font-medium text-gray-600">Last Synced</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {formatDistanceToNow(new Date(platform.lastSync), { addSuffix: true })}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Key size={14} className="text-gray-600" />
                      <p className="text-xs font-medium text-gray-600">Account Number</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{platform.accountNumber}</p>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Shield className="text-indigo-600" size={16} />
                    <h5 className="text-sm font-bold text-gray-900">Permissions Granted</h5>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {platform.permissions.map((permission, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Auto Sync */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="text-blue-600" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Auto-Sync</p>
                      <p className="text-xs text-gray-600">Automatically sync portfolio data</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      /* Toggle auto-sync logic */
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      platform.autoSync ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        platform.autoSync ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* API Key (masked) */}
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Key className="text-yellow-600" size={16} />
                    <p className="text-sm font-semibold text-gray-900">API Key</p>
                  </div>
                  <p className="text-xs font-mono text-gray-700 bg-white p-2 rounded border border-yellow-200">
                    {platform.apiKey}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">Keep your API key secure and never share it</p>
                </div>
              </div>
            )}

            {/* Disconnected State */}
            {platform.status === 'Disconnected' && (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <XCircle className="text-gray-400 mx-auto mb-2" size={32} />
                <p className="text-sm text-gray-600">
                  This platform is not connected. Connect to sync your portfolio data.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Security Notice */}
      <div className="bg-indigo-50 rounded-xl p-6 border-2 border-indigo-200">
        <div className="flex items-start space-x-3">
          <Shield className="text-indigo-600 flex-shrink-0" size={24} />
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Security & Privacy</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>" Your API keys are encrypted and stored securely</li>
              <li>" We only request read-only access to your portfolio data</li>
              <li>" You can revoke access anytime by disconnecting the platform</li>
              <li>" We never store your login credentials</li>
              <li>" All data syncs use industry-standard encryption</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformConnections;
