import Card from '../ui/Card';
import { formatCurrency } from '../../utils/calculations';
import { DollarSign, TrendingUp, Wallet, Package } from 'lucide-react';

const PortfolioSummary = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Investment */}
      <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white hover-lift shadow-xl border-0 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="text-indigo-100 text-sm mb-2 font-medium">Total Invested</p>
          <h3 className="text-3xl font-bold mb-2">
            {formatCurrency(summary.totalInvested)}
          </h3>
          <p className="text-indigo-100 text-sm">
            Across {summary.activePlatforms} platforms
          </p>
        </div>
      </Card>

      {/* Current Value */}
      <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white hover-lift shadow-xl border-0 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
              <Wallet size={24} />
            </div>
          </div>
          <p className="text-green-100 text-sm mb-2 font-medium">Current Value</p>
          <h3 className="text-3xl font-bold mb-2">
            {formatCurrency(summary.currentValue)}
          </h3>
          <div className="flex items-center text-sm">
            <span className="text-green-100">Today: </span>
            <span className={`ml-2 font-semibold flex items-center space-x-1 ${
              summary.dayChange >= 0 ? 'text-white' : 'text-red-200'
            }`}>
              {summary.dayChange >= 0 ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingUp size={14} className="rotate-180" />
              )}
              <span>
                {summary.dayChange >= 0 ? '+' : ''}{formatCurrency(summary.dayChange)} 
                ({summary.dayChangePercentage >= 0 ? '+' : ''}{summary.dayChangePercentage}%)
              </span>
            </span>
          </div>
        </div>
      </Card>

      {/* Total Returns */}
      <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white hover-lift shadow-xl border-0 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-purple-100 text-sm mb-2 font-medium">Total Returns</p>
          <h3 className="text-3xl font-bold mb-2">
            {formatCurrency(summary.totalReturns)}
          </h3>
          <p className="text-purple-100 text-sm flex items-center space-x-1">
            <TrendingUp size={14} />
            <span>+{summary.returnPercentage}% overall</span>
          </p>
        </div>
      </Card>

      {/* Total Investments */}
      <Card className="bg-gradient-to-br from-orange-600 to-red-600 text-white hover-lift shadow-xl border-0 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
              <Package size={24} />
            </div>
          </div>
          <p className="text-orange-100 text-sm mb-2 font-medium">Active Investments</p>
          <h3 className="text-3xl font-bold mb-2">
            {summary.totalInvestments}
          </h3>
          <p className="text-orange-100 text-sm">
            Holdings across all platforms
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PortfolioSummary;