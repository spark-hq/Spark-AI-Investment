// src/components/transactions/TransactionModal.jsx

import { X, CheckCircle, Clock, XCircle, Calendar, Hash, CreditCard, Building } from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';

const TransactionModal = ({ transaction, onClose }) => {
  if (!transaction) return null;

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      Completed: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: <CheckCircle size={20} />,
      },
      Pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        icon: <Clock size={20} />,
      },
      Failed: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: <XCircle size={20} />,
      },
    };

    const badge = badges[status] || badges.Completed;

    return (
      <div
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 ${badge.bg} ${badge.text} ${badge.border}`}
      >
        {badge.icon}
        <span className="font-semibold">{status}</span>
      </div>
    );
  };

  // Get type badge color
  const getTypeBadge = (type) => {
    const badges = {
      Buy: 'bg-gradient-to-r from-green-500 to-emerald-600',
      Sell: 'bg-gradient-to-r from-red-500 to-rose-600',
      SIP: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      Dividend: 'bg-gradient-to-r from-orange-500 to-amber-600',
    };

    return badges[type] || 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      fullDate: date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      dayOfWeek: date.toLocaleDateString('en-IN', { weekday: 'long' }),
    };
  };

  const { fullDate, time, dayOfWeek } = formatDate(transaction.date);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Drag Handle - Mobile Swipe Indicator */}
        <div className="pt-3 pb-0 flex justify-center bg-white rounded-t-2xl">
          <div
            className="w-12 h-1 bg-gray-300 rounded-full"
            role="separator"
            aria-label="Swipe down to close"
          ></div>
        </div>

        {/* Header */}
        <div className={`${getTypeBadge(transaction.type)} text-white p-6 relative overflow-hidden`}>
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
              <div className="text-6xl">{transaction.logo}</div>
              <div>
                <h2 className="text-3xl font-bold mb-1">{transaction.asset}</h2>
                <p className="text-lg opacity-90">{transaction.symbol}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all backdrop-blur-sm"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Transaction Type & Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Transaction Type</p>
              <div
                className={`${getTypeBadge(transaction.type)} text-white px-4 py-2 rounded-lg font-bold text-lg inline-block shadow-md`}
              >
                {transaction.type}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1 text-right">Status</p>
              {getStatusBadge(transaction.status)}
            </div>
          </div>

          {/* Amount Section */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border-2 border-indigo-100">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Base Amount</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(transaction.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-indigo-600">{formatCurrency(transaction.totalAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Fees</p>
                <p className="text-lg font-semibold text-gray-700">{formatCurrency(transaction.fees)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Tax</p>
                <p className="text-lg font-semibold text-gray-700">{formatCurrency(transaction.tax)}</p>
              </div>
            </div>
          </div>

          {/* Transaction Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Quantity */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Quantity</p>
              <p className="text-2xl font-bold text-gray-900">{transaction.quantity}</p>
            </div>

            {/* Price per unit */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Price per Unit</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(transaction.price)}</p>
            </div>

            {/* Platform */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600 mb-1 flex items-center space-x-1">
                <Building size={14} />
                <span>Platform</span>
              </p>
              <p className="text-lg font-bold text-gray-900">{transaction.platform}</p>
            </div>

            {/* Category */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Category</p>
              <p className="text-lg font-bold text-gray-900">{transaction.category}</p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-600 mb-2 flex items-center space-x-1 font-semibold">
              <Calendar size={16} />
              <span>Transaction Date & Time</span>
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Date</p>
                <p className="text-sm font-bold text-gray-900">{fullDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Time</p>
                <p className="text-sm font-bold text-gray-900">{time}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Day</p>
                <p className="text-sm font-bold text-gray-900">{dayOfWeek}</p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
            <p className="text-sm text-purple-600 mb-3 flex items-center space-x-1 font-semibold">
              <Hash size={16} />
              <span>Order Details</span>
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Order ID</p>
                <p className="text-sm font-mono font-bold text-gray-900">{transaction.orderId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1 flex items-center space-x-1">
                  <CreditCard size={12} />
                  <span>Payment Mode</span>
                </p>
                <p className="text-sm font-bold text-gray-900">{transaction.paymentMode}</p>
              </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Description</th>
                  <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="bg-white">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {transaction.type} ({transaction.quantity} units @ {formatCurrency(transaction.price)})
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                    {formatCurrency(transaction.amount)}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">Transaction Fees</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                    {formatCurrency(transaction.fees)}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-3 text-sm text-gray-900">Tax & Charges</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                    {formatCurrency(transaction.tax)}
                  </td>
                </tr>
                <tr className="bg-indigo-50 border-t-2 border-indigo-200">
                  <td className="px-4 py-3 text-base font-bold text-gray-900">Total Amount</td>
                  <td className="px-4 py-3 text-lg font-bold text-indigo-600 text-right">
                    {formatCurrency(transaction.totalAmount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
