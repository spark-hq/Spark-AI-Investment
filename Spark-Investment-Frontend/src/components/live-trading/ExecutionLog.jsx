import { TrendingUp, TrendingDown, Shield, Clock, CheckCircle2, XCircle, User } from 'lucide-react';
import Card from '../ui/StockCard';

const ExecutionLog = ({ executionLog }) => {
  const getActionIcon = (action) => {
    return action === 'BUY' ? TrendingUp : TrendingDown;
  };

  const getActionColor = (action) => {
    return action === 'BUY' 
      ? 'text-green-600 bg-green-100' 
      : 'text-red-600 bg-red-100';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'executed':
        return CheckCircle2;
      case 'stop-loss':
        return Shield;
      case 'failed':
        return XCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'executed':
        return 'text-green-600 bg-green-100';
      case 'stop-loss':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="bg-white border-2 border-indigo-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl">
            <Clock className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Execution Log</h3>
            <p className="text-sm text-gray-600">Recent trading activity</p>
          </div>
        </div>
        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
          {executionLog.length} trades
        </span>
      </div>

      {/* Log Entries */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {executionLog.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-gray-100 p-6 rounded-full inline-block mb-3">
              <Clock className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-600 font-medium mb-1">No trades yet</p>
            <p className="text-sm text-gray-500">Trade history will appear here</p>
          </div>
        ) : (
            // index to be used as key if no unique id is present later phase
          executionLog.map((log) => {
            const ActionIcon = getActionIcon(log.action);
            const StatusIcon = getStatusIcon(log.status);
            const actionColorClass = getActionColor(log.action);
            const statusColorClass = getStatusColor(log.status);

            return (
              <div
                key={log.id}
                className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 border-2 border-gray-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-md"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${actionColorClass}`}>
                      <ActionIcon size={20} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900">{log.action}</span>
                        <span className="text-lg font-bold text-gray-900">{log.asset}</span>
                      </div>
                      <p className="text-xs text-gray-600">{log.time}</p>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${statusColorClass}`}>
                    <StatusIcon size={14} />
                    <span className="text-xs font-semibold capitalize">{log.status}</span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="bg-white rounded-lg p-2 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Quantity</p>
                    <p className="text-sm font-bold text-gray-900">{log.quantity}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Price</p>
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(log.price)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Amount</p>
                    <p className="text-sm font-bold text-indigo-900">{formatCurrency(log.amount)}</p>
                  </div>
                </div>

                {/* Type Badge */}
                <div className="flex items-center justify-between">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                    log.type === 'auto' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {log.type === 'auto' ? (
                      <>
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                        <span className="text-xs font-semibold">AI Auto-Trade</span>
                      </>
                    ) : (
                      <>
                        <User size={12} />
                        <span className="text-xs font-semibold">Manual Trade</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Reason */}
                {log.reason && (
                  <div className="mt-3 bg-indigo-50 rounded-lg p-2 border border-indigo-200">
                    <p className="text-xs text-indigo-900">
                      <strong>Reason:</strong> {log.reason}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Summary Stats */}
      {executionLog.length > 0 && (
        <div className="mt-4 pt-4 border-t-2 border-gray-100">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
              <p className="text-xs text-green-900 mb-1">Total Buys</p>
              <p className="text-2xl font-bold text-green-900">
                {executionLog.filter(log => log.action === 'BUY').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-3 border border-red-200">
              <p className="text-xs text-red-900 mb-1">Total Sells</p>
              <p className="text-2xl font-bold text-red-900">
                {executionLog.filter(log => log.action === 'SELL').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200">
              <p className="text-xs text-purple-900 mb-1">Total Value</p>
              <p className="text-lg font-bold text-purple-900">
                {formatCurrency(executionLog.reduce((sum, log) => sum + log.amount, 0))}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ExecutionLog;