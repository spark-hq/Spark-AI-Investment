import { useState } from 'react';
import { Video, VideoOff, Monitor, AlertCircle, CheckCircle2 } from 'lucide-react';
import Card from '../ui/StockCard';
import Button from '../ui/Button';

const ScreenCapturePanel = ({ onStatusChange, selectedAsset }) => {
  const [captureStatus, setCaptureStatus] = useState('inactive'); // inactive, starting, active, error
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const statusConfig = {
    inactive: {
      icon: VideoOff,
      color: 'text-gray-500',
      bgColor: 'bg-gray-100',
      label: 'Not Active',
      iconColor: 'text-gray-500',
      buttonText: 'Start Screen Sharing',
      buttonClass: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700',
    },
    starting: {
      icon: Video,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      label: 'Initializing...',
      iconColor: 'text-yellow-600',
      buttonText: 'Connecting...',
      buttonClass: 'bg-yellow-500 text-white cursor-not-allowed',
    },
    active: {
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      label: 'Active',
      iconColor: 'text-green-600',
      buttonText: 'Stop Sharing',
      buttonClass: 'bg-red-600 text-white hover:bg-red-700',
    },
    error: {
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      label: 'Connection Error',
      iconColor: 'text-red-600',
      buttonText: 'Retry Connection',
      buttonClass: 'bg-indigo-600 text-white hover:bg-indigo-700',
    },
  };

  const currentStatus = statusConfig[captureStatus];
  const StatusIcon = currentStatus.icon;

  const handleToggleCapture = () => {
    if (captureStatus === 'inactive' || captureStatus === 'error') {
      // Start screen sharing
      setCaptureStatus('starting');
      onStatusChange?.('starting');

      // Simulate connection delay
      setTimeout(() => {
        setCaptureStatus('active');
        setIsAnalyzing(true);
        onStatusChange?.('active');
      }, 1500);
    } else if (captureStatus === 'active') {
      // Stop screen sharing
      setCaptureStatus('inactive');
      setIsAnalyzing(false);
      onStatusChange?.('inactive');
    }
  };

  return (
    <Card className="bg-white border-2 border-indigo-100 hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`${currentStatus.bgColor} p-3 rounded-xl`}>
            <Monitor className={`${currentStatus.iconColor}`} size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Screen Capture</h3>
            <p className="text-sm text-gray-600">AI-powered screen analysis</p>
          </div>
        </div>
        <div className={`${currentStatus.bgColor} px-3 py-1 rounded-full flex items-center space-x-2`}>
          <StatusIcon size={16} className={currentStatus.iconColor} />
          <span className={`text-sm font-semibold ${currentStatus.color}`}>
            {currentStatus.label}
          </span>
        </div>
      </div>

      {/* Screen Preview Area */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-4 border-2 border-dashed border-gray-300 min-h-[200px] flex items-center justify-center">
        {captureStatus === 'inactive' && (
          <div className="text-center">
            <div className="bg-gray-200 p-6 rounded-full inline-block mb-4">
              <Monitor className="text-gray-400" size={48} />
            </div>
            <p className="text-gray-600 font-medium mb-2">No Screen Sharing Active</p>
            <p className="text-sm text-gray-500">
              Click below to start capturing your trading screen
            </p>
          </div>
        )}

        {captureStatus === 'starting' && (
          <div className="text-center">
            <div className="bg-yellow-100 p-6 rounded-full inline-block mb-4 animate-pulse">
              <Video className="text-yellow-600" size={48} />
            </div>
            <p className="text-yellow-700 font-medium mb-2">Initializing Connection...</p>
            <p className="text-sm text-gray-600">Please select your trading window</p>
          </div>
        )}

        {captureStatus === 'active' && (
          <div className="w-full">
            <div className="bg-gray-900 rounded-lg p-4 mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 text-sm font-semibold flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>LIVE</span>
                </span>
                <span className="text-gray-400 text-xs">
                  {selectedAsset?.platform || 'Trading Platform'}
                </span>
              </div>
              <div className="bg-gray-800 rounded p-3 text-center">
                <p className="text-gray-300 text-sm mb-2">📊 Simulated Trading Screen</p>
                <div className="flex justify-around text-xs">
                  <div>
                    <p className="text-gray-400">Price</p>
                    <p className="text-green-400 font-bold">
                      ₹{selectedAsset?.currentPrice?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Change</p>
                    <p className={selectedAsset?.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {selectedAsset?.change >= 0 ? '+' : ''}
                      {selectedAsset?.changePercent?.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Volume</p>
                    <p className="text-blue-400 font-bold">{selectedAsset?.volume || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {isAnalyzing && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border-2 border-indigo-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-indigo-900">AI Analyzing Screen...</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-white rounded p-2">
                    <p className="text-gray-600">Patterns</p>
                    <p className="text-indigo-600 font-bold">Detected ✓</p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <p className="text-gray-600">Indicators</p>
                    <p className="text-indigo-600 font-bold">Reading ✓</p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <p className="text-gray-600">Signals</p>
                    <p className="text-indigo-600 font-bold">Generated ✓</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {captureStatus === 'error' && (
          <div className="text-center">
            <div className="bg-red-100 p-6 rounded-full inline-block mb-4">
              <AlertCircle className="text-red-600" size={48} />
            </div>
            <p className="text-red-700 font-medium mb-2">Connection Failed</p>
            <p className="text-sm text-gray-600">Unable to access screen. Check permissions.</p>
          </div>
        )}
      </div>

      {/* Action Button */}
      <Button
        onClick={handleToggleCapture}
        disabled={captureStatus === 'starting'}
        className={`w-full ${currentStatus.buttonClass} shadow-lg transition-all duration-300`}
      >
        {captureStatus === 'starting' && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
        )}
        {currentStatus.buttonText}
      </Button>

      {/* Info Text */}
      {captureStatus === 'inactive' && (
        <div className="mt-3 bg-blue-50 rounded-lg p-3 border border-blue-200">
          <p className="text-xs text-blue-800 flex items-start space-x-2">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>
              <strong>How it works:</strong> Share your trading platform screen and AI will analyze
              charts, patterns, and indicators in real-time to provide intelligent recommendations.
            </span>
          </p>
        </div>
      )}

      {captureStatus === 'active' && (
        <div className="mt-3 bg-green-50 rounded-lg p-3 border border-green-200">
          <p className="text-xs text-green-800 flex items-start space-x-2">
            <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
            <span>
              AI is actively monitoring your trading screen. Recommendations will update automatically
              based on what AI detects.
            </span>
          </p>
        </div>
      )}
    </Card>
  );
};

export default ScreenCapturePanel;