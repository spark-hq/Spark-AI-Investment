// src/components/live-trading/OrderConfirmationModal.jsx

import React, { useMemo } from 'react';
import { X, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, DollarSign, Package, Clock } from 'lucide-react';

const OrderConfirmationModal = ({ order, onConfirm, onCancel }) => {
  if (!order) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate order details
  const orderDetails = useMemo(() => {
    const baseAmount = order.quantity * order.price;
    const brokerageFee = baseAmount * 0.0003; // 0.03% brokerage
    const exchangeFee = baseAmount * 0.00003; // 0.003% exchange fee
    const gst = (brokerageFee + exchangeFee) * 0.18; // 18% GST
    const stampDuty = baseAmount * 0.00015; // 0.015% stamp duty
    const totalCharges = brokerageFee + exchangeFee + gst + stampDuty;
    const totalAmount = order.action === 'buy'
      ? baseAmount + totalCharges
      : baseAmount - totalCharges;

    return {
      baseAmount,
      brokerageFee,
      exchangeFee,
      gst,
      stampDuty,
      totalCharges,
      totalAmount,
      estimatedProfit: order.stopLoss ? (order.price - order.stopLoss) * order.quantity : null,
      estimatedRisk: order.stopLoss ? ((order.price - order.stopLoss) / order.price * 100) : null,
    };
  }, [order]);

  const isBuyOrder = order.action === 'buy';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Drag Handle */}
        <div className="pt-3 pb-0 flex justify-center bg-white rounded-t-2xl">
          <div
            className="w-12 h-1 bg-gray-300 rounded-full"
            role="separator"
            aria-label="Swipe down to close"
          ></div>
        </div>

        {/* Header */}
        <div className={`${isBuyOrder ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-red-600 to-rose-600'} text-white p-6 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-white opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '40px 40px',
              }}
            ></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-4 rounded-xl ${isBuyOrder ? 'bg-green-700' : 'bg-red-700'} bg-opacity-50 backdrop-blur-sm`}>
                {isBuyOrder ? <TrendingUp size={32} /> : <TrendingDown size={32} />}
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-1">Confirm {isBuyOrder ? 'Buy' : 'Sell'} Order</h2>
                <p className="text-lg opacity-90">{order.asset} • {order.orderType.toUpperCase()}</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all backdrop-blur-sm"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Warning Banner */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex items-start space-x-3">
            <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={24} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-900 mb-1">Review your order carefully</p>
              <p className="text-xs text-yellow-800">
                This order will be executed immediately at market price. Make sure all details are correct before confirming.
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Package size={20} className="text-indigo-600" />
              <span>Order Summary</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Symbol</p>
                <p className="text-lg font-bold text-gray-900">{order.asset}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Type</p>
                <p className="text-lg font-bold text-gray-900 uppercase">{order.orderType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Quantity</p>
                <p className="text-lg font-bold text-gray-900">{order.quantity} shares</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Price per Share</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(order.price)}</p>
              </div>
            </div>

            {order.stopLoss && (
              <div className="mt-4 pt-4 border-t border-indigo-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Stop Loss</p>
                    <p className="text-lg font-bold text-red-600">{formatCurrency(order.stopLoss)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Max Risk</p>
                    <p className="text-lg font-bold text-red-600">-{orderDetails.estimatedRisk?.toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cost Breakdown */}
          <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <DollarSign size={20} className="text-gray-700" />
              <span>Cost Breakdown</span>
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Base Amount ({order.quantity} × {formatCurrency(order.price)})</span>
                <span className="font-semibold text-gray-900">{formatCurrency(orderDetails.baseAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Brokerage (0.03%)</span>
                <span className="font-semibold text-gray-900">{formatCurrency(orderDetails.brokerageFee)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Exchange Charges (0.003%)</span>
                <span className="font-semibold text-gray-900">{formatCurrency(orderDetails.exchangeFee)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">GST (18%)</span>
                <span className="font-semibold text-gray-900">{formatCurrency(orderDetails.gst)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Stamp Duty (0.015%)</span>
                <span className="font-semibold text-gray-900">{formatCurrency(orderDetails.stampDuty)}</span>
              </div>

              <div className="border-t-2 border-gray-300 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Total {isBuyOrder ? 'Debit' : 'Credit'}</span>
                  <span className={`text-xl font-bold ${isBuyOrder ? 'text-red-600' : 'text-green-600'}`}>
                    {isBuyOrder ? '-' : '+'}{formatCurrency(orderDetails.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Execution Details */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-start space-x-3">
              <Clock className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">Execution Details</p>
                <p className="text-xs text-blue-800">
                  • Order will be placed immediately<br />
                  • Expected execution time: &lt;1 second<br />
                  • You will receive a notification upon execution
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-6 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(order)}
              className={`flex-1 ${isBuyOrder ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700'} text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2`}
            >
              <CheckCircle size={24} />
              <span>Confirm {isBuyOrder ? 'Buy' : 'Sell'} Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;
