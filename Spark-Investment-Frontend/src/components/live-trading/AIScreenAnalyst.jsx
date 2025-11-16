import { TrendingUp, TrendingDown, AlertTriangle, Target, Shield, Brain, Activity, BarChart3, Sparkles } from 'lucide-react';
import Card from '../ui/StockCard';

const AIScreenAnalyst = ({ selectedAsset, aiAnalysis, isActive }) => {
  if (!selectedAsset || !aiAnalysis) {
    return (
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200">
        <div className="text-center py-12">
          <div className="bg-gray-200 p-6 rounded-full inline-block mb-4">
            <Brain className="text-gray-400" size={48} />
          </div>
          <p className="text-gray-600 font-medium mb-2">No Asset Selected</p>
          <p className="text-sm text-gray-500">Select an asset to view AI analysis</p>
        </div>
      </Card>
    );
  }

  const getSignalColor = (signal) => {
    switch (signal) {
      case 'BUY':
        return {
          bg: 'from-green-600 to-emerald-600',
          text: 'text-green-600',
          icon: '🟢',
          label: 'BUY',
        };
      case 'SELL':
        return {
          bg: 'from-red-600 to-pink-600',
          text: 'text-red-600',
          icon: '🔴',
          label: 'SELL',
        };
      case 'HOLD':
        return {
          bg: 'from-yellow-600 to-orange-600',
          text: 'text-yellow-600',
          icon: '🟡',
          label: 'HOLD',
        };
      default:
        return {
          bg: 'from-gray-600 to-gray-700',
          text: 'text-gray-600',
          icon: '⚫',
          label: 'NEUTRAL',
        };
    }
  };

//   const getRiskColor = (riskLevel) => {
//     switch (riskLevel?.toLowerCase()) {
//       case 'low':
//         return 'text-green-600 bg-green-100';
//       case 'medium':
//         return 'text-yellow-600 bg-yellow-100';
//       case 'high':
//         return 'text-red-600 bg-red-100';
//       default:
//         return 'text-gray-600 bg-gray-100';
//     }
//   };

  const signalConfig = getSignalColor(aiAnalysis.signal);
  const TrendIcon = aiAnalysis.trend === 'up' ? TrendingUp : TrendingDown;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
                <Brain size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">AI Screen Analyst</h3>
                <p className="text-indigo-100 text-sm">Real-time market intelligence</p>
              </div>
            </div>
            {isActive && (
              <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-3 py-1 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">LIVE</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Activity size={16} />
            <span>Analyzing: <strong>{selectedAsset.name}</strong></span>
          </div>
        </div>
      </Card>

      {/* Main Analysis Card */}
      <Card className="bg-white border-2 border-indigo-100">
        {/* Detected Pattern */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
            <BarChart3 size={16} />
            <span>Detected Pattern</span>
          </h4>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 border-2 border-indigo-200">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-indigo-900">{aiAnalysis.pattern}</span>
              <TrendIcon className={aiAnalysis.trend === 'up' ? 'text-green-600' : 'text-red-600'} size={32} />
            </div>
          </div>
        </div>

        {/* Current Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Price</p>
            <p className="text-lg font-bold text-gray-900">
              {selectedAsset.type === 'Crypto' ? '$' : '₹'}
              {selectedAsset.currentPrice.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">RSI</p>
            <p className="text-lg font-bold text-gray-900">{aiAnalysis.rsi}</p>
            <p className={`text-xs ${aiAnalysis.technicalIndicators.rsi.status === 'Bullish' ? 'text-green-600' : aiAnalysis.technicalIndicators.rsi.status === 'Bearish' ? 'text-red-600' : 'text-gray-600'}`}>
              {aiAnalysis.technicalIndicators.rsi.status}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Volume</p>
            <p className="text-lg font-bold text-gray-900">{aiAnalysis.volumeStatus}</p>
          </div>
        </div>

        {/* MACD Status */}
        <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-900 font-medium">MACD: {aiAnalysis.macd}</span>
            <span className="text-xs font-semibold bg-blue-200 text-blue-900 px-2 py-1 rounded-full">
              {aiAnalysis.technicalIndicators.macd.status}
            </span>
          </div>
        </div>

        <div className="border-t-2 border-gray-100 pt-4 mb-4"></div>

        {/* AI Recommendation */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
            <Sparkles size={16} className="text-purple-600" />
            <span>AI Recommendation</span>
          </h4>
          
          <div className={`bg-gradient-to-r ${signalConfig.bg} text-white rounded-xl p-4 mb-3 shadow-lg`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{signalConfig.icon}</span>
                <div>
                  <p className="text-2xl font-bold">{signalConfig.label}</p>
                  <p className="text-sm opacity-90">Confidence: {aiAnalysis.confidence}%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Risk Level</p>
                <p className="text-lg font-bold">{aiAnalysis.riskLevel}</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-2 backdrop-blur-sm">
              <div className="h-2 bg-white bg-opacity-30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${aiAnalysis.confidence}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Price Targets */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border-2 border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="text-green-600" size={16} />
                <span className="text-xs font-semibold text-green-900">Entry Price</span>
              </div>
              <p className="text-xl font-bold text-green-900">{formatCurrency(aiAnalysis.entryPrice)}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border-2 border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="text-blue-600" size={16} />
                <span className="text-xs font-semibold text-blue-900">Target Price</span>
              </div>
              <p className="text-xl font-bold text-blue-900">{formatCurrency(aiAnalysis.targetPrice)}</p>
              <p className="text-xs text-blue-700 mt-1">+{aiAnalysis.targetPercent}% ↗</p>
            </div>
          </div>

          {/* Stop Loss */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-3 border-2 border-red-200 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="text-red-600" size={20} />
                <div>
                  <span className="text-xs font-semibold text-red-900 block">Stop-Loss (Auto-suggested)</span>
                  <p className="text-lg font-bold text-red-900 mt-1">{formatCurrency(aiAnalysis.stopLoss)}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-red-700">{aiAnalysis.stopLossPercent}% ↘</span>
              </div>
            </div>
          </div>

          {/* Potential Profit */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-purple-900">Potential Profit (10 qty)</span>
              <span className="text-xl font-bold text-purple-900">{formatCurrency(aiAnalysis.potentialProfit)}</span>
            </div>
          </div>
        </div>

        {/* Risk Warning */}
        {aiAnalysis.warning && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-3 mb-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="text-yellow-600 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <p className="text-xs font-semibold text-yellow-900 mb-1">⚠️ AI Warning</p>
                <p className="text-sm text-yellow-800">{aiAnalysis.warning}</p>
              </div>
            </div>
          </div>
        )}

        {/* Technical Indicators Summary */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-200">
          <h5 className="text-xs font-semibold text-indigo-900 mb-2">📊 Technical Indicators</h5>
          <div className="space-y-2">
            {Object.entries(aiAnalysis.technicalIndicators).map(([key, indicator], index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-xs text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                <div className="text-right">
                  <span className="text-xs font-semibold text-indigo-900">{indicator.value}</span>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                    indicator.status.includes('Bullish') ? 'bg-green-200 text-green-800' :
                    indicator.status.includes('Bearish') ? 'bg-red-200 text-red-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {indicator.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why This Signal */}
        {aiAnalysis.reasons && aiAnalysis.reasons.length > 0 && (
          <div className="mt-4 pt-4 border-t-2 border-gray-100">
            <h5 className="text-sm font-semibold text-gray-900 mb-2">💡 Why {aiAnalysis.signal}?</h5>
            <ul className="space-y-2">
              {aiAnalysis.reasons.map((reason, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-sm text-gray-700">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {/* Recent Actions */}
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">📜 Recent AI Actions</h4>
        <div className="space-y-2">
          <div className="bg-white rounded-lg p-2 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">11:23</span>
              <span className="text-sm font-medium text-green-700">Bought RELIANCE</span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-2 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">11:15</span>
              <span className="text-sm font-medium text-blue-700">Sold TCS</span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-2 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">11:10</span>
              <span className="text-sm font-medium text-red-700">Stop-loss triggered</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIScreenAnalyst;