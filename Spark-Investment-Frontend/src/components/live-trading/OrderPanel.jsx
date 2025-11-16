import { useState } from 'react';
import { TrendingUp, TrendingDown, Shield, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import Card from '../ui/StockCard';
import Button from '../ui/Button';

const OrderPanel = ({ selectedAsset, onOrderPlaced, autoStopLossEnabled, suggestedStopLoss }) => {
  const [orderType, setOrderType] = useState('market'); // market, limit
  const [action, setAction] = useState('buy'); // buy, sell
  const [quantity, setQuantity] = useState(10);
  const [limitPrice, setLimitPrice] = useState(selectedAsset?.currentPrice || 0);
  const [useAutoStopLoss, setUseAutoStopLoss] = useState(autoStopLossEnabled);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePlaceOrder = () => {
    const order = {
      asset: selectedAsset.symbol,
      action: action.toUpperCase(),
      type: orderType,
      quantity: quantity,
      price: orderType === 'market' ? selectedAsset.currentPrice : limitPrice,
      stopLoss: useAutoStopLoss ? suggestedStopLoss : null,
      timestamp: new Date().toLocaleTimeString(),
    };

    onOrderPlaced?.(order);
    setShowSuccessModal(true);

    // Auto-close modal after 3 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);
  };

  const calculateTotal = () => {
    const price = orderType === 'market' ? selectedAsset?.currentPrice || 0 : limitPrice;
    return price * quantity;
  };

  const formatCurrency = (amount) => {
    if (!selectedAsset) return '₹0';
    if (selectedAsset.type === 'Crypto') {
      return `$${amount.toLocaleString()}`;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!selectedAsset) {
    return (
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200">
        <div className="text-center py-12">
          <div className="bg-gray-200 p-6 rounded-full inline-block mb-4">
            <DollarSign className="text-gray-400" size={48} />
          </div>
          <p className="text-gray-600 font-medium mb-2">No Asset Selected</p>
          <p className="text-sm text-gray-500">Select an asset to place orders</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white border-2 border-indigo-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl">
              <DollarSign className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Place Order</h3>
              <p className="text-sm text-gray-600">{selectedAsset.name}</p>
            </div>
          </div>
        </div>

        {/* Order Type Toggle */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Order Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setOrderType('market')}
              className={`py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                orderType === 'market'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Market
            </button>
            <button
              onClick={() => setOrderType('limit')}
              className={`py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                orderType === 'limit'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Limit
            </button>
          </div>
        </div>

        {/* Buy/Sell Toggle */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Action</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setAction('buy')}
              className={`py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center space-x-2 ${
                action === 'buy'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingUp size={20} />
              <span>BUY</span>
            </button>
            <button
              onClick={() => setAction('sell')}
              className={`py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center space-x-2 ${
                action === 'sell'
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingDown size={20} />
              <span>SELL</span>
            </button>
          </div>
        </div>

        {/* Quantity Input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none text-lg font-bold"
            placeholder="Enter quantity"
          />
        </div>

        {/* Price Input (for limit orders) */}
        {orderType === 'limit' && (
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Limit Price</label>
            <input
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(Number(e.target.value))}
              step="0.01"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none text-lg font-bold"
              placeholder="Enter price"
            />
          </div>
        )}

        {/* Current Price Display (for market orders) */}
        {orderType === 'market' && (
          <div className="mb-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border-2 border-indigo-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-indigo-900">Current Price</span>
              <span className="text-xl font-bold text-indigo-900">
                {formatCurrency(selectedAsset.currentPrice)}
              </span>
            </div>
          </div>
        )}

        {/* Auto Stop-Loss */}
        <div className="mb-4 bg-red-50 rounded-lg p-3 border-2 border-red-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Shield className="text-red-600" size={20} />
              <span className="text-sm font-semibold text-red-900">Auto Stop-Loss</span>
            </div>
            <button
              onClick={() => setUseAutoStopLoss(!useAutoStopLoss)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                useAutoStopLoss ? 'bg-red-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  useAutoStopLoss ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          {useAutoStopLoss && suggestedStopLoss && (
            <div className="flex items-center justify-between bg-white rounded-lg p-2">
              <span className="text-xs text-red-900">AI Suggested Stop-Loss</span>
              <span className="text-sm font-bold text-red-900">
                {formatCurrency(suggestedStopLoss)}
              </span>
            </div>
          )}
        </div>

        {/* Total Amount */}
        <div className="mb-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-200">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-purple-900">Total Amount</span>
            <span className="text-2xl font-bold text-purple-900">
              {formatCurrency(calculateTotal())}
            </span>
          </div>
        </div>

        {/* Place Order Button */}
        <Button
          onClick={handlePlaceOrder}
          disabled={quantity <= 0}
          className={`w-full py-4 text-lg font-bold shadow-lg ${
            action === 'buy'
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
              : 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700'
          }`}
        >
          {action === 'buy' ? '🚀 PLACE BUY ORDER' : '📉 PLACE SELL ORDER'}
        </Button>

        {/* Portfolio Impact Preview */}
        <div className="mt-4 pt-4 border-t-2 border-gray-100">
          <p className="text-xs font-semibold text-gray-700 mb-2">📊 Portfolio Impact</p>
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-blue-900">After this trade:</span>
                <span className="font-bold text-blue-900">
                  {action === 'buy' ? '+' : '-'}{formatCurrency(calculateTotal())}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-900">New {selectedAsset.symbol} holdings:</span>
                <span className="font-bold text-blue-900">
                  {action === 'buy' ? quantity : -quantity} units
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <Card className="bg-white max-w-md mx-4 animate-scaleIn">
            <div className="text-center">
              <div className="bg-green-100 p-6 rounded-full inline-block mb-4">
                <CheckCircle2 className="text-green-600" size={64} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h3>
              <p className="text-gray-600 mb-4">
                Your {action.toUpperCase()} order for {quantity} {selectedAsset.symbol} has been
                placed.
              </p>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 mb-4 border-2 border-indigo-200">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Action:</span>
                    <span className="font-bold text-indigo-900">{action.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Quantity:</span>
                    <span className="font-bold text-indigo-900">{quantity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Total:</span>
                    <span className="font-bold text-indigo-900">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
              >
                View Order History
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default OrderPanel;