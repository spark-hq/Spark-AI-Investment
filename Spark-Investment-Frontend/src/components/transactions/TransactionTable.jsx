// src/components/transactions/TransactionTable.jsx

import { useState } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';

const TransactionTable = ({ transactions, onTransactionClick }) => {
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Sort transactions
  const sortedTransactions = [...transactions].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Convert dates to timestamps for comparison
    if (sortField === 'date') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    // Handle numeric fields
    if (sortField === 'amount' || sortField === 'totalAmount') {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex);

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp size={16} className="inline" />
    ) : (
      <ChevronDown size={16} className="inline" />
    );
  };

  // Get transaction type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'Buy':
        return <ArrowDownRight className="text-green-600" size={18} />;
      case 'Sell':
        return <ArrowUpRight className="text-red-600" size={18} />;
      case 'SIP':
        return <RefreshCw className="text-blue-600" size={18} />;
      case 'Dividend':
        return <TrendingUp className="text-orange-600" size={18} />;
      default:
        return null;
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      Completed: 'bg-green-100 text-green-700 border-green-200',
      Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      Failed: 'bg-red-100 text-red-700 border-red-200',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          badges[status] || 'bg-gray-100 text-gray-700 border-gray-200'
        }`}
      >
        {status}
      </span>
    );
  };

  // Get type badge color
  const getTypeBadge = (type) => {
    const badges = {
      Buy: 'bg-green-50 text-green-700 border-green-200',
      Sell: 'bg-red-50 text-red-700 border-red-200',
      SIP: 'bg-blue-50 text-blue-700 border-blue-200',
      Dividend: 'bg-orange-50 text-orange-700 border-orange-200',
    };

    return badges[type] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto scrollbar-hide relative">
        {/* Scroll Indicator - Right Edge Fade */}
        <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-white via-white to-transparent pointer-events-none z-10 lg:hidden"></div>
        <table className="w-full">
          <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b-2 border-indigo-100">
            <tr>
              <th
                className="px-6 py-4 text-left text-sm font-bold text-gray-900 cursor-pointer hover:bg-indigo-100 transition-colors"
                onClick={() => handleSort('date')}
              >
                Date & Time {getSortIcon('date')}
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Type</th>
              <th
                className="px-6 py-4 text-left text-sm font-bold text-gray-900 cursor-pointer hover:bg-indigo-100 transition-colors"
                onClick={() => handleSort('asset')}
              >
                Asset {getSortIcon('asset')}
              </th>
              <th
                className="px-6 py-4 text-left text-sm font-bold text-gray-900 cursor-pointer hover:bg-indigo-100 transition-colors"
                onClick={() => handleSort('platform')}
              >
                Platform {getSortIcon('platform')}
              </th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">Quantity</th>
              <th
                className="px-6 py-4 text-right text-sm font-bold text-gray-900 cursor-pointer hover:bg-indigo-100 transition-colors"
                onClick={() => handleSort('totalAmount')}
              >
                Amount {getSortIcon('totalAmount')}
              </th>
              <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-6xl">=�</div>
                    <p className="text-lg font-semibold">No transactions found</p>
                    <p className="text-sm">Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((transaction) => {
                const { date, time } = formatDate(transaction.date);
                return (
                  <tr
                    key={transaction.id}
                    onClick={() => onTransactionClick(transaction)}
                    className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 cursor-pointer transition-all group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">{date}</span>
                        <span className="text-xs text-gray-500">{time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`p-2 rounded-lg border ${getTypeBadge(transaction.type)}`}
                        >
                          {getTypeIcon(transaction.type)}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {transaction.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{transaction.logo}</span>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">
                            {transaction.asset}
                          </span>
                          <span className="text-xs text-gray-500">{transaction.symbol}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-700">
                        {transaction.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-semibold text-gray-900">
                          {transaction.quantity}
                        </span>
                        <span className="text-xs text-gray-500">
                          @ {formatCurrency(transaction.price)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-gray-900">
                          {formatCurrency(transaction.totalAmount)}
                        </span>
                        {(transaction.fees > 0 || transaction.tax > 0) && (
                          <span className="text-xs text-gray-500">
                            (Fees: {formatCurrency(transaction.fees + transaction.tax)})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">{getStatusBadge(transaction.status)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {paginatedTransactions.length > 0 && (
        <div className="bg-gray-50 px-6 py-4 border-t-2 border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
              <span className="font-semibold">{Math.min(endIndex, sortedTransactions.length)}</span>{' '}
              of <span className="font-semibold">{sortedTransactions.length}</span> transactions
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border-2 transition-all ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300'
                }`}
              >
                <ChevronLeft size={20} />
              </button>

              {/* Page numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                        currentPage === pageNum
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-indigo-50 hover:border-indigo-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg border-2 transition-all ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300'
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
