import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Sparkles, Zap, Shield, BarChart3 } from 'lucide-react';
import Card from '../components/ui/StockCard';
import ScreenCapturePanel from '../components/live-trading/ScreenCapturePanel';
import LiveMarketChart from '../components/live-trading/LiveMarketChart';
import AIScreenAnalyst from '../components/live-trading/AIScreenAnalyst';
import AutoTradeSettings from '../components/live-trading/AutoTradeSettings';
import ExecutionLog from '../components/live-trading/ExecutionLog';
import TradingChart from '../components/live-trading/TradingChart';
import MarketDataCards from '../components/live-trading/MarketDataCards';
import OrderPanel from '../components/live-trading/OrderPanel';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ErrorDisplay } from '../components/ui/ErrorBoundary';
import {
  useLiveMarketData,
  useExecuteTrade,
  useExecutionLog,
} from '../hooks/useLiveTrading';
import {
  initialMarketData,
  aiAnalysisData,
  defaultAutoTradeSettings,
  platforms,
  calculateChange,
  updatePriceHistory,
  generateChartData,
} from '../data/liveMarketData';

const LiveTrading = () => {
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [chartTimeframe, setChartTimeframe] = useState('1D');
  const [chartData, setChartData] = useState([]);
  const [screenCaptureActive, setScreenCaptureActive] = useState(false);
  const [autoTradeSettings, setAutoTradeSettings] = useState(defaultAutoTradeSettings);
  const [viewMode, setViewMode] = useState('chart'); // 'chart' or 'capture'

  // Extract symbols from initialMarketData
  const symbols = useMemo(() => initialMarketData.map(asset => asset.symbol), []);

  // Fetch live market data from API (updates every 3 seconds)
  const { data: liveQuotes, isLoading: marketLoading, isError: marketError } = useLiveMarketData(symbols, {
    refetchInterval: 3000,
  });

  // Fetch execution log from API
  const { executionLog: apiExecutionLog, isLoading: logLoading } = useExecutionLog();

  // Use API execution log or fallback to empty array
  const executionLog = apiExecutionLog || [];

  // Execute trade mutation
  const executeTrade = useExecuteTrade();

  // Transform live quotes into marketData format
  const marketData = useMemo(() => {
    if (!liveQuotes || liveQuotes.length === 0) {
      return initialMarketData;
    }

    return initialMarketData.map((asset, index) => {
      const liveQuote = liveQuotes[index];
      if (!liveQuote) return asset;

      return {
        ...asset,
        currentPrice: liveQuote.price || asset.currentPrice,
        change: liveQuote.change || asset.change,
        changePercent: liveQuote.changePercent || asset.changePercent,
        volume: liveQuote.volume || asset.volume,
        priceHistory: asset.priceHistory, // Keep existing history for now
      };
    });
  }, [liveQuotes]);

  // Update chart data when asset or timeframe changes
  useEffect(() => {
    if (selectedAsset) {
      const updatedAsset = marketData.find((a) => a.id === selectedAsset.id);
      if (updatedAsset) {
        setSelectedAsset(updatedAsset);
        const data = generateChartData(updatedAsset, chartTimeframe);
        setChartData(data);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAsset?.id, chartTimeframe, marketData]);

  const handleAssetSelect = (asset) => {
    // Toggle: If clicking the same asset, deselect it
    if (selectedAsset?.id === asset.id) {
      setSelectedAsset(null);
      setChartData([]);
      return;
    }
    
    // Select new asset
    setSelectedAsset(asset);
    const data = generateChartData(asset, chartTimeframe);
    setChartData(data);
  };

  const handleScreenCaptureStatusChange = (status) => {
    setScreenCaptureActive(status === 'active');
  };

  const handleAutoTradeSettingsChange = (settings) => {
    setAutoTradeSettings(settings);
  };

  const handleOrderPlaced = (order) => {
    // Execute trade using API mutation
    executeTrade.mutate({
      action: order.action,
      symbol: order.symbol || order.asset,
      asset: order.asset,
      quantity: order.quantity,
      price: order.price,
      orderType: order.orderType || 'market',
      timestamp: order.timestamp,
    });
  };

  const currentAIAnalysis = selectedAsset ? aiAnalysisData[selectedAsset.id] : null;
  const suggestedStopLoss = currentAIAnalysis?.stopLoss || null;

  // Calculate summary stats
  const totalInvested = 125000; // Mock value
  const totalValue = 132500; // Mock value
  const totalProfit = totalValue - totalInvested;
  const profitPercent = ((totalProfit / totalInvested) * 100).toFixed(2);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Show loading state on initial load
  if (marketLoading && (!marketData || marketData.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner message="Loading live market data..." />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (marketError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <ErrorDisplay
            title="Failed to load market data"
            message="There was an error loading live market data. Please try again."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-medium mb-4 flex items-center space-x-2 transition-colors px-4 py-3 rounded-lg min-h-[44px]"
          >
            <span>← Back</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                <TrendingUp className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">Live Trading</h1>
                <p className="text-xl text-gray-600">AI-powered trading assistant</p>
              </div>
              <Sparkles className="text-purple-600 animate-pulse" size={32} />
            </div>

            {/* Platform Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:space-x-3 w-full sm:w-auto">
              <label className="text-sm font-semibold text-gray-700">Platform:</label>
              <select
                value={selectedPlatform.id}
                onChange={(e) =>
                  setSelectedPlatform(platforms.find((p) => p.id === e.target.value))
                }
                className="w-full sm:w-auto px-4 py-2 border-2 border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold text-gray-900 bg-white shadow-md"
              >
                {platforms.map((platform) => (
                  <option key={platform.id} value={platform.id}>
                    {platform.logo} {platform.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fadeIn">
          <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white hover-lift shadow-xl border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
            <div className="relative z-10">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm w-12 h-12 flex items-center justify-center mb-3">
                <BarChart3 size={24} />
              </div>
              <p className="text-indigo-100 text-sm mb-2 font-medium">Total Invested</p>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{formatCurrency(totalInvested)}</h3>
              <p className="text-indigo-100 text-sm">Across {marketData.length} assets</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white hover-lift shadow-xl border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
            <div className="relative z-10">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm w-12 h-12 flex items-center justify-center mb-3">
                <TrendingUp size={24} />
              </div>
              <p className="text-green-100 text-sm mb-2 font-medium">Current Value</p>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{formatCurrency(totalValue)}</h3>
              <p className="text-green-100 text-sm">+{profitPercent}% growth</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white hover-lift shadow-xl border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
            <div className="relative z-10">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm w-12 h-12 flex items-center justify-center mb-3">
                <Zap size={24} />
              </div>
              <p className="text-purple-100 text-sm mb-2 font-medium">Total Profit</p>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{formatCurrency(totalProfit)}</h3>
              <p className="text-purple-100 text-sm">Unrealized gains</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-600 to-orange-600 text-white hover-lift shadow-xl border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
            <div className="relative z-10">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm w-12 h-12 flex items-center justify-center mb-3">
                <Shield size={24} />
              </div>
              <p className="text-yellow-100 text-sm mb-2 font-medium">Auto-Trading</p>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                {autoTradeSettings.enabled ? 'Active' : 'Inactive'}
              </h3>
              <p className="text-yellow-100 text-sm">
                {autoTradeSettings.enabled
                  ? `${formatCurrency(autoTradeSettings.dailyLimit - 2500)} left`
                  : 'Enable in settings'}
              </p>
            </div>
          </Card>
        </div>

        {/* Market Data Cards */}
        <div className="mb-8 animate-fadeIn">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <span>📊 Live Market Data</span>
            <span className="text-sm font-normal text-gray-600">(Updates every 3 seconds)</span>
          </h2>
          <MarketDataCards
            marketData={marketData}
            selectedAsset={selectedAsset}
            onAssetSelect={handleAssetSelect}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Left Column - Charts & Orders */}
          <div className="lg:col-span-2 space-y-6">
            {/* View Mode Toggle */}
            <div className="flex items-center justify-center gap-2 p-2 bg-white rounded-xl border-2 border-gray-200 shadow-sm">
              <button
                onClick={() => setViewMode('chart')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === 'chart'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                aria-label="Live Market Chart View"
                aria-pressed={viewMode === 'chart'}
              >
                <BarChart3 size={18} />
                <span>Live Market Chart</span>
              </button>
              <button
                onClick={() => setViewMode('capture')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === 'capture'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                aria-label="Screen Capture View"
                aria-pressed={viewMode === 'capture'}
              >
                <Shield size={18} />
                <span>Screen Capture</span>
              </button>
            </div>

            {/* Conditional Rendering based on View Mode */}
            {viewMode === 'chart' ? (
              <LiveMarketChart selectedAsset={selectedAsset} marketData={marketData} />
            ) : (
              <ScreenCapturePanel
                onStatusChange={handleScreenCaptureStatusChange}
                selectedAsset={selectedAsset}
              />
            )}

            {/* Order Panel */}
            <OrderPanel
              selectedAsset={selectedAsset}
              onOrderPlaced={handleOrderPlaced}
              autoStopLossEnabled={autoTradeSettings.autoStopLoss}
              suggestedStopLoss={suggestedStopLoss}
            />

            {/* Trading Chart */}
            <TradingChart
              asset={selectedAsset}
              chartData={chartData}
              timeframe={chartTimeframe}
              onTimeframeChange={setChartTimeframe}
            />

            {/* Execution Log */}
            <ExecutionLog executionLog={executionLog} />
          </div>

          {/* Right Column - AI Analysis & Settings */}
          <div className="space-y-6">
            {/* AI Screen Analyst */}
            <AIScreenAnalyst
              selectedAsset={selectedAsset}
              aiAnalysis={currentAIAnalysis}
              isActive={screenCaptureActive}
            />

            {/* Auto-Trade Settings */}
            <AutoTradeSettings
              settings={autoTradeSettings}
              onSettingsChange={handleAutoTradeSettingsChange}
            />
          </div>
        </div>

        {/* Bottom Info Card */}
        <Card className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 animate-fadeIn hover-lift shadow-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-white opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '40px 40px',
              }}
            ></div>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-sm">
                <Sparkles className="text-white" size={48} />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">AI-Powered Trading Intelligence</h3>
                <p className="text-indigo-100">
                  Experience real-time market analysis, automated trading, and intelligent risk
                  management powered by advanced AI algorithms.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/ai-analysis')}
              className="bg-white text-indigo-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-bold shadow-lg transition-all whitespace-nowrap"
            >
              View AI Analysis →
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LiveTrading;