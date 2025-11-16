// src/components/live-trading/OrderStatusFlow.jsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, TrendingDown, Ban } from 'lucide-react';
import Card from '../ui/StockCard';
import useStore from '../../store/useStore';

const OrderStatusFlow = ({ orders = [], onOrderUpdate }) => {
  const addNotification = useStore((state) => state.addNotification);
  const [processingOrders, setProcessingOrders] = useState(new Set());

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Simulate order execution with random delays
  const processOrder = useCallback((order) => {
    if (processingOrders.has(order.id) || order.status !== 'pending') {
      return;
    }

    setProcessingOrders((prev) => new Set([...prev, order.id]));

    // Random execution time between 2-8 seconds
    const executionDelay = Math.floor(Math.random() * 6000) + 2000;

    // 85% chance of success, 15% chance of rejection
    const willSucceed = Math.random() < 0.85;

    setTimeout(() => {
      const newStatus = willSucceed ? 'filled' : 'rejected';
      const executedPrice = willSucceed
        ? order.price + (Math.random() - 0.5) * 2 // Price slippage ±1
        : order.price;

      const updatedOrder = {
        ...order,
        status: newStatus,
        executedPrice: willSucceed ? executedPrice : null,
        executedAt: new Date().toISOString(),
        rejectionReason: !willSucceed
          ? ['Insufficient liquidity', 'Price limit exceeded', 'Market closed', 'Order timeout'][
              Math.floor(Math.random() * 4)
            ]
          : null,
      };

      // Trigger notification
      if (willSucceed) {
        addNotification({
          type: 'success',
          message: `Order Filled: ${order.action.toUpperCase()} ${order.quantity} ${order.symbol}`,
          details: `Executed at ${formatCurrency(executedPrice)}`,
        });
      } else {
        addNotification({
          type: 'error',
          message: `Order Rejected: ${order.symbol}`,
          details: updatedOrder.rejectionReason,
        });
      }

      // Update order
      if (onOrderUpdate) {
        onOrderUpdate(updatedOrder);
      }

      setProcessingOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(order.id);
        return newSet;
      });
    }, executionDelay);
  }, [processingOrders, onOrderUpdate, addNotification]);

  // Auto-process pending orders
  useEffect(() => {
    orders.forEach((order) => {
      if (order.status === 'pending' && !processingOrders.has(order.id)) {
        processOrder(order);
      }
    });
  }, [orders, processingOrders, processOrder]);

  // Get status configuration
  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        label: 'Pending',
        description: 'Order submitted, waiting for execution...',
      },
      filled: {
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        label: 'Filled',
        description: 'Order executed successfully',
      },
      rejected: {
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
        label: 'Rejected',
        description: 'Order could not be executed',
      },
      cancelled: {
        icon: Ban,
        color: 'text-gray-600',
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        label: 'Cancelled',
        description: 'Order cancelled by user',
      },
    };
    return configs[status] || configs.pending;
  };

  // Group orders by status
  const groupedOrders = useMemo(() => {
    const groups = {
      pending: [],
      filled: [],
      rejected: [],
      cancelled: [],
    };

    orders.forEach((order) => {
      if (groups[order.status]) {
        groups[order.status].push(order);
      }
    });

    return groups;
  }, [orders]);

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: groupedOrders.pending.length,
      filled: groupedOrders.filled.length,
      rejected: groupedOrders.rejected.length,
      fillRate: orders.length > 0 ? ((groupedOrders.filled.length / orders.length) * 100).toFixed(1) : 0,
    };
  }, [orders, groupedOrders]);

  const OrderCard = ({ order }) => {
    const config = getStatusConfig(order.status);
    const Icon = config.icon;
    const ActionIcon = order.action === 'buy' ? TrendingUp : TrendingDown;
    const actionColor = order.action === 'buy' ? 'text-green-600' : 'text-red-600';
    const isProcessing = processingOrders.has(order.id);

    return (
      <Card className={`${config.bg} border-2 ${config.border} hover-lift transition-all duration-300 ${isProcessing ? 'animate-pulse' : ''}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`${config.bg} p-2 rounded-lg border ${config.border}`}>
              <ActionIcon className={actionColor} size={20} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">{order.symbol}</h4>
              <p className="text-sm text-gray-600 capitalize">
                {order.action} • {order.quantity} shares
              </p>
            </div>
          </div>
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${config.bg} border ${config.border}`}>
            <Icon className={config.color} size={16} />
            <span className={`text-sm font-semibold ${config.color}`}>{config.label}</span>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg p-3 mb-3 border border-gray-200">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600 mb-1">Order Price</p>
              <p className="font-semibold text-gray-900">{formatCurrency(order.price)}</p>
            </div>
            {order.status === 'filled' && order.executedPrice && (
              <div>
                <p className="text-gray-600 mb-1">Executed Price</p>
                <p className="font-semibold text-green-600">{formatCurrency(order.executedPrice)}</p>
              </div>
            )}
            <div>
              <p className="text-gray-600 mb-1">Order Value</p>
              <p className="font-semibold text-gray-900">{formatCurrency(order.price * order.quantity)}</p>
            </div>
            {order.stopLoss && (
              <div>
                <p className="text-gray-600 mb-1">Stop Loss</p>
                <p className="font-semibold text-orange-600">{formatCurrency(order.stopLoss)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <Clock size={12} />
            <span>Placed: {formatTime(order.placedAt)}</span>
          </div>
          {order.status === 'filled' && order.executedAt && (
            <div className="flex items-center space-x-2 text-xs text-green-600">
              <CheckCircle size={12} />
              <span>Filled: {formatTime(order.executedAt)}</span>
            </div>
          )}
          {order.status === 'rejected' && order.executedAt && (
            <div className="flex items-center space-x-2 text-xs text-red-600">
              <XCircle size={12} />
              <span>Rejected: {formatTime(order.executedAt)}</span>
            </div>
          )}
        </div>

        {/* Status Description */}
        <div className={`mt-3 p-2.5 rounded-lg ${config.bg} border ${config.border}`}>
          <p className={`text-xs ${config.color} font-medium`}>
            {isProcessing && order.status === 'pending' ? 'Processing order...' : config.description}
          </p>
          {order.status === 'rejected' && order.rejectionReason && (
            <p className="text-xs text-red-700 mt-1 font-semibold">Reason: {order.rejectionReason}</p>
          )}
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-yellow-600 h-1.5 rounded-full animate-progress" style={{ width: '100%' }}></div>
            </div>
          </div>
        )}
      </Card>
    );
  };

  if (orders.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200">
        <div className="text-center py-8">
          <AlertCircle className="mx-auto text-gray-400 mb-3" size={48} />
          <h3 className="text-lg font-bold text-gray-700 mb-2">No Orders</h3>
          <p className="text-sm text-gray-600">Place your first order to see it here</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Header */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Order Status</h3>
          <div className="bg-white bg-opacity-20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
            <span className="text-sm font-semibold">{stats.fillRate}% Fill Rate</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-xs opacity-90 mb-1">Total Orders</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-yellow-500 bg-opacity-20 rounded-lg p-3 backdrop-blur-sm border border-yellow-300 border-opacity-30">
            <p className="text-xs opacity-90 mb-1">Pending</p>
            <p className="text-2xl font-bold">{stats.pending}</p>
          </div>
          <div className="bg-green-500 bg-opacity-20 rounded-lg p-3 backdrop-blur-sm border border-green-300 border-opacity-30">
            <p className="text-xs opacity-90 mb-1">Filled</p>
            <p className="text-2xl font-bold">{stats.filled}</p>
          </div>
          <div className="bg-red-500 bg-opacity-20 rounded-lg p-3 backdrop-blur-sm border border-red-300 border-opacity-30">
            <p className="text-xs opacity-90 mb-1">Rejected</p>
            <p className="text-2xl font-bold">{stats.rejected}</p>
          </div>
        </div>
      </Card>

      {/* Pending Orders */}
      {groupedOrders.pending.length > 0 && (
        <div>
          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center space-x-2">
            <Clock className="text-yellow-600" size={20} />
            <span>Pending Orders ({groupedOrders.pending.length})</span>
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {groupedOrders.pending.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      )}

      {/* Filled Orders */}
      {groupedOrders.filled.length > 0 && (
        <div>
          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center space-x-2">
            <CheckCircle className="text-green-600" size={20} />
            <span>Filled Orders ({groupedOrders.filled.length})</span>
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {groupedOrders.filled.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      )}

      {/* Rejected Orders */}
      {groupedOrders.rejected.length > 0 && (
        <div>
          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center space-x-2">
            <XCircle className="text-red-600" size={20} />
            <span>Rejected Orders ({groupedOrders.rejected.length})</span>
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {groupedOrders.rejected.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(OrderStatusFlow);
