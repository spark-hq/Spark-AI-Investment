import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/calculations';
import { CheckCircle, Clock, TrendingUp, TrendingDown } from 'lucide-react';

const PlatformCards = ({ platforms }) => {
  const getPlatformGradient = (name) => {
    const gradients = {
      Zerodha: 'from-blue-500 to-blue-600',
      Groww: 'from-green-500 to-green-600',
      Upstox: 'from-purple-500 to-purple-600',
      Binance: 'from-yellow-500 to-orange-600',
    };
    return gradients[name] || 'from-gray-500 to-gray-600';
  };

  return (
    <Card title="Connected Platforms" subtitle="Multi-platform portfolio tracking" className="mb-8 border-2 border-purple-100">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className={`rounded-2xl p-6 transition-all hover:shadow-xl hover:-translate-y-1 border-2 ${
              platform.connected
                ? 'border-green-200 bg-gradient-to-br from-white to-green-50'
                : 'border-gray-200 bg-gradient-to-br from-white to-gray-50'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`bg-gradient-to-br ${getPlatformGradient(platform.name)} p-3 rounded-xl shadow-lg`}>
                  <span className="text-2xl">{platform.logo}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {platform.name}
                  </h3>
                  {platform.connected && (
                    <div className="flex items-center space-x-1 text-green-600 text-xs mt-1">
                      <CheckCircle size={12} />
                      <span className="font-semibold">Connected</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {platform.connected ? (
              <div className="space-y-3">
                {/* Stats */}
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Invested</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(platform.totalInvested)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Current</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(platform.currentValue)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-gray-600">Returns</span>
                      <span className={`font-bold flex items-center space-x-1 ${
                        platform.returns >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {platform.returns >= 0 ? (
                          <TrendingUp size={14} />
                        ) : (
                          <TrendingDown size={14} />
                        )}
                        <span>
                          {platform.returns >= 0 ? '+' : ''}{formatCurrency(platform.returns)}
                        </span>
                      </span>
                    </div>
                    <div className="text-center mt-1">
                      <span className={`text-xs font-semibold ${
                        platform.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ({platform.returnPercentage >= 0 ? '+' : ''}{platform.returnPercentage}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Last Sync */}
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                  <Clock size={12} />
                  <span>
                    Synced: {new Date(platform.lastSync).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                {/* View Details Button */}
                <Link to="/investments">
                  <Button 
                    size="sm" 
                    fullWidth 
                    variant="outline"
                    className="hover-lift"
                  >
                    View Details →
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="text-4xl mb-3 opacity-30">🔗</div>
                <p className="text-gray-600 text-sm mb-4">
                  Connect to track investments
                </p>
                <Button 
                  size="sm" 
                  fullWidth 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  Connect Platform
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PlatformCards;