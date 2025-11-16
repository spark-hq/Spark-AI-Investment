import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import Card from '../ui/StockCard';

const MarketDataCards = React.memo(({ marketData, selectedAsset, onAssetSelect }) => {
  const formatCurrency = (amount, type) => {
    if (type === 'Crypto') {
      return `$${amount.toLocaleString()}`;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {marketData.map((asset) => {
        const isPositive = asset.change >= 0;
        const isSelected = selectedAsset?.id === asset.id;
        const TrendIcon = isPositive ? TrendingUp : TrendingDown;

        return (
          <Card
            key={asset.id}
            onClick={() => onAssetSelect(asset)}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              isSelected
                ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-0 shadow-2xl'
                : 'bg-white hover:shadow-xl border-2 border-gray-200 hover:border-indigo-300'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div
                  className={`text-3xl ${
                    isSelected ? 'bg-white bg-opacity-20 p-2 rounded-lg backdrop-blur-sm' : ''
                  }`}
                >
                  {asset.logo}
                </div>
                <div>
                  <h4
                    className={`font-bold text-lg ${
                      isSelected ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {asset.symbol}
                  </h4>
                  <p
                    className={`text-xs ${
                      isSelected ? 'text-indigo-100' : 'text-gray-600'
                    }`}
                  >
                    {asset.platform}
                  </p>
                </div>
              </div>
              {isSelected && (
                <div className="flex items-center space-x-1 bg-white bg-opacity-20 px-2 py-1 rounded-full backdrop-blur-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold">LIVE</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="mb-3">
              <p
                className={`text-3xl font-bold ${
                  isSelected ? 'text-white' : 'text-gray-900'
                }`}
              >
                {formatCurrency(asset.currentPrice, asset.type)}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <div
                  className={`flex items-center space-x-1 px-2 py-0.5 rounded-full ${
                    isSelected
                      ? isPositive
                        ? 'bg-green-400 bg-opacity-20 text-white'
                        : 'bg-red-400 bg-opacity-20 text-white'
                      : isPositive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  <TrendIcon size={14} />
                  <span className="text-sm font-bold">
                    {isPositive ? '+' : ''}
                    {asset.changePercent.toFixed(2)}%
                  </span>
                </div>
                <span
                  className={`text-sm ${
                    isSelected ? 'text-indigo-100' : 'text-gray-600'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {formatCurrency(asset.change, asset.type)}
                </span>
              </div>
            </div>

            {/* Mini Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div
                className={`rounded-lg p-2 ${
                  isSelected
                    ? 'bg-white bg-opacity-10 backdrop-blur-sm'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <p
                  className={`text-xs ${
                    isSelected ? 'text-indigo-100' : 'text-gray-600'
                  }`}
                >
                  Volume
                </p>
                <p
                  className={`text-sm font-bold ${
                    isSelected ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {asset.volume}
                </p>
              </div>
              <div
                className={`rounded-lg p-2 ${
                  isSelected
                    ? 'bg-white bg-opacity-10 backdrop-blur-sm'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <p
                  className={`text-xs ${
                    isSelected ? 'text-indigo-100' : 'text-gray-600'
                  }`}
                >
                  High/Low
                </p>
                <p
                  className={`text-xs font-bold ${
                    isSelected ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {formatCurrency(asset.high, asset.type)} /{' '}
                  {formatCurrency(asset.low, asset.type)}
                </p>
              </div>
            </div>

            {/* Live Indicator */}
            {!isSelected && (
              <div className="mt-3 flex items-center justify-center">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Activity size={12} />
                  <span>Click to analyze</span>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
});

MarketDataCards.displayName = 'MarketDataCards';

export default MarketDataCards;