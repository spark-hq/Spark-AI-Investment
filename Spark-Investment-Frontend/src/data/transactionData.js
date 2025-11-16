// src/data/transactionData.js

/**
 * Transaction History Data for Spark Investment AI
 * Includes: Buy, Sell, Dividend, SIP transactions
 * Platforms: Zerodha, Groww, Upstox, Binance
 * Status: Completed, Pending, Failed
 */

export const transactions = [
  // RECENT TRANSACTIONS - 2024
  {
    id: 'TXN001',
    date: '2024-03-15T10:30:00',
    type: 'Buy',
    asset: 'Reliance Industries Ltd',
    symbol: 'RELIANCE',
    platform: 'Zerodha',
    quantity: 10,
    price: 3375,
    amount: 33750,
    fees: 67.5,
    tax: 60.75,
    totalAmount: 33878.25,
    status: 'Completed',
    paymentMode: 'UPI',
    orderId: 'ZER240315001',
    logo: '🛢️',
    category: 'Stocks',
  },
  {
    id: 'TXN002',
    date: '2024-03-14T14:15:00',
    type: 'Sell',
    asset: 'TCS Ltd',
    symbol: 'TCS',
    platform: 'Zerodha',
    quantity: 5,
    price: 3450,
    amount: 17250,
    fees: 34.5,
    tax: 31.05,
    totalAmount: 17184.45,
    status: 'Completed',
    paymentMode: 'Bank Transfer',
    orderId: 'ZER240314002',
    logo: '💻',
    category: 'Stocks',
  },
  {
    id: 'TXN003',
    date: '2024-03-13T09:00:00',
    type: 'SIP',
    asset: 'SBI Bluechip Fund',
    symbol: 'SBI-BLUE',
    platform: 'Groww',
    quantity: 100,
    price: 78,
    amount: 7800,
    fees: 0,
    tax: 0,
    totalAmount: 7800,
    status: 'Completed',
    paymentMode: 'Auto-Debit',
    orderId: 'GRW240313001',
    logo: '📈',
    category: 'Mutual Funds',
  },
  {
    id: 'TXN004',
    date: '2024-03-12T16:45:00',
    type: 'Buy',
    asset: 'Bitcoin',
    symbol: 'BTC',
    platform: 'Binance',
    quantity: 0.01,
    price: 6800000,
    amount: 68000,
    fees: 680,
    tax: 0,
    totalAmount: 68680,
    status: 'Completed',
    paymentMode: 'Crypto Wallet',
    orderId: 'BIN240312001',
    logo: '₿',
    category: 'Cryptocurrency',
  },
  {
    id: 'TXN005',
    date: '2024-03-11T11:20:00',
    type: 'Dividend',
    asset: 'HDFC Bank Ltd',
    symbol: 'HDFCBANK',
    platform: 'Zerodha',
    quantity: 60,
    price: 35.5,
    amount: 2130,
    fees: 0,
    tax: 213,
    totalAmount: 1917,
    status: 'Completed',
    paymentMode: 'Credit to Account',
    orderId: 'ZER240311003',
    logo: '🏦',
    category: 'Stocks',
  },
  {
    id: 'TXN006',
    date: '2024-03-10T13:30:00',
    type: 'Buy',
    asset: 'Ethereum',
    symbol: 'ETH',
    platform: 'Binance',
    quantity: 0.2,
    price: 281250,
    amount: 56250,
    fees: 562.5,
    tax: 0,
    totalAmount: 56812.5,
    status: 'Pending',
    paymentMode: 'UPI',
    orderId: 'BIN240310002',
    logo: 'Ξ',
    category: 'Cryptocurrency',
  },
  {
    id: 'TXN007',
    date: '2024-03-09T10:00:00',
    type: 'SIP',
    asset: 'ICICI Prudential Technology Fund',
    symbol: 'ICICI-TECH',
    platform: 'Groww',
    quantity: 80,
    price: 86.67,
    amount: 6933.6,
    fees: 0,
    tax: 0,
    totalAmount: 6933.6,
    status: 'Failed',
    paymentMode: 'Auto-Debit',
    orderId: 'GRW240309002',
    logo: '🚀',
    category: 'Mutual Funds',
  },
  {
    id: 'TXN008',
    date: '2024-03-08T15:45:00',
    type: 'Buy',
    asset: 'Infosys Ltd',
    symbol: 'INFY',
    platform: 'Zerodha',
    quantity: 25,
    price: 1950,
    amount: 48750,
    fees: 97.5,
    tax: 87.75,
    totalAmount: 48935.25,
    status: 'Completed',
    paymentMode: 'UPI',
    orderId: 'ZER240308004',
    logo: '💻',
    category: 'Stocks',
  },

  // FEBRUARY 2024
  {
    id: 'TXN009',
    date: '2024-02-28T12:00:00',
    type: 'Sell',
    asset: 'Maruti Suzuki India Ltd',
    symbol: 'MARUTI',
    platform: 'Upstox',
    quantity: 3,
    price: 7650,
    amount: 22950,
    fees: 45.9,
    tax: 41.31,
    totalAmount: 22862.79,
    status: 'Completed',
    paymentMode: 'Bank Transfer',
    orderId: 'UPS240228001',
    logo: '🚗',
    category: 'Stocks',
  },
  {
    id: 'TXN010',
    date: '2024-02-25T09:30:00',
    type: 'Buy',
    asset: 'Asian Paints Ltd',
    symbol: 'ASIANPAINT',
    platform: 'Upstox',
    quantity: 8,
    price: 3600,
    amount: 28800,
    fees: 57.6,
    tax: 51.84,
    totalAmount: 28909.44,
    status: 'Completed',
    paymentMode: 'UPI',
    orderId: 'UPS240225002',
    logo: '🎨',
    category: 'Stocks',
  },
  {
    id: 'TXN011',
    date: '2024-02-20T14:00:00',
    type: 'Buy',
    asset: 'ITC Ltd',
    symbol: 'ITC',
    platform: 'Zerodha',
    quantity: 150,
    price: 403.33,
    amount: 60499.5,
    fees: 120.99,
    tax: 108.89,
    totalAmount: 60729.38,
    status: 'Completed',
    paymentMode: 'Bank Transfer',
    orderId: 'ZER240220005',
    logo: '🚬',
    category: 'Stocks',
  },
  {
    id: 'TXN012',
    date: '2024-02-15T10:15:00',
    type: 'SIP',
    asset: 'Parag Parikh Flexi Cap Fund',
    symbol: 'PPFAS',
    platform: 'Groww',
    quantity: 100,
    price: 90,
    amount: 9000,
    fees: 0,
    tax: 0,
    totalAmount: 9000,
    status: 'Completed',
    paymentMode: 'Auto-Debit',
    orderId: 'GRW240215003',
    logo: '🌟',
    category: 'Mutual Funds',
  },
  {
    id: 'TXN013',
    date: '2024-02-10T16:20:00',
    type: 'Dividend',
    asset: 'State Bank of India',
    symbol: 'SBIN',
    platform: 'Zerodha',
    quantity: 100,
    price: 12,
    amount: 1200,
    fees: 0,
    tax: 120,
    totalAmount: 1080,
    status: 'Completed',
    paymentMode: 'Credit to Account',
    orderId: 'ZER240210006',
    logo: '🏦',
    category: 'Stocks',
  },
  {
    id: 'TXN014',
    date: '2024-02-05T11:45:00',
    type: 'Buy',
    asset: 'Solana',
    symbol: 'SOL',
    platform: 'Binance',
    quantity: 20,
    price: 1600,
    amount: 32000,
    fees: 320,
    tax: 0,
    totalAmount: 32320,
    status: 'Completed',
    paymentMode: 'Crypto Wallet',
    orderId: 'BIN240205003',
    logo: '◎',
    category: 'Cryptocurrency',
  },

  // JANUARY 2024
  {
    id: 'TXN015',
    date: '2024-01-28T13:10:00',
    type: 'Buy',
    asset: 'Wipro Ltd',
    symbol: 'WIPRO',
    platform: 'Zerodha',
    quantity: 50,
    price: 440,
    amount: 22000,
    fees: 44,
    tax: 39.6,
    totalAmount: 22083.6,
    status: 'Completed',
    paymentMode: 'UPI',
    orderId: 'ZER240128007',
    logo: '💻',
    category: 'Stocks',
  },
  {
    id: 'TXN016',
    date: '2024-01-20T09:00:00',
    type: 'SIP',
    asset: 'Mirae Asset Large Cap Fund',
    symbol: 'MIRAE-LARGE',
    platform: 'Groww',
    quantity: 85,
    price: 84,
    amount: 7140,
    fees: 0,
    tax: 0,
    totalAmount: 7140,
    status: 'Completed',
    paymentMode: 'Auto-Debit',
    orderId: 'GRW240120004',
    logo: '🏢',
    category: 'Mutual Funds',
  },
  {
    id: 'TXN017',
    date: '2024-01-15T15:30:00',
    type: 'Sell',
    asset: 'Cardano',
    symbol: 'ADA',
    platform: 'Binance',
    quantity: 200,
    price: 21,
    amount: 4200,
    fees: 42,
    tax: 0,
    totalAmount: 4158,
    status: 'Completed',
    paymentMode: 'Crypto Wallet',
    orderId: 'BIN240115004',
    logo: '🔷',
    category: 'Cryptocurrency',
  },
  {
    id: 'TXN018',
    date: '2024-01-10T10:45:00',
    type: 'Buy',
    asset: 'Wipro Ltd',
    symbol: 'WIPRO',
    platform: 'Zerodha',
    quantity: 50,
    price: 440,
    amount: 22000,
    fees: 44,
    tax: 39.6,
    totalAmount: 22083.6,
    status: 'Completed',
    paymentMode: 'Bank Transfer',
    orderId: 'ZER240110008',
    logo: '💻',
    category: 'Stocks',
  },

  // DECEMBER 2023
  {
    id: 'TXN019',
    date: '2023-12-28T14:20:00',
    type: 'Dividend',
    asset: 'ITC Ltd',
    symbol: 'ITC',
    platform: 'Zerodha',
    quantity: 150,
    price: 8,
    amount: 1200,
    fees: 0,
    tax: 120,
    totalAmount: 1080,
    status: 'Completed',
    paymentMode: 'Credit to Account',
    orderId: 'ZER231228009',
    logo: '🚬',
    category: 'Stocks',
  },
  {
    id: 'TXN020',
    date: '2023-12-20T11:00:00',
    type: 'SIP',
    asset: 'SBI Bluechip Fund',
    symbol: 'SBI-BLUE',
    platform: 'Groww',
    quantity: 100,
    price: 75,
    amount: 7500,
    fees: 0,
    tax: 0,
    totalAmount: 7500,
    status: 'Completed',
    paymentMode: 'Auto-Debit',
    orderId: 'GRW231220005',
    logo: '📈',
    category: 'Mutual Funds',
  },
  {
    id: 'TXN021',
    date: '2023-12-15T16:40:00',
    type: 'Buy',
    asset: 'Nippon India ETF Nifty 50',
    symbol: 'NIFTYBEES',
    platform: 'Upstox',
    quantity: 200,
    price: 240,
    amount: 48000,
    fees: 96,
    tax: 86.4,
    totalAmount: 48182.4,
    status: 'Completed',
    paymentMode: 'UPI',
    orderId: 'UPS231215003',
    logo: '📉',
    category: 'ETF',
  },
  {
    id: 'TXN022',
    date: '2023-12-10T09:30:00',
    type: 'Sell',
    asset: 'Bitcoin',
    symbol: 'BTC',
    platform: 'Binance',
    quantity: 0.005,
    price: 6500000,
    amount: 32500,
    fees: 325,
    tax: 0,
    totalAmount: 32175,
    status: 'Completed',
    paymentMode: 'Crypto Wallet',
    orderId: 'BIN231210005',
    logo: '₿',
    category: 'Cryptocurrency',
  },

  // NOVEMBER 2023
  {
    id: 'TXN023',
    date: '2023-11-25T13:15:00',
    type: 'Buy',
    asset: 'HDFC Bank Ltd',
    symbol: 'HDFCBANK',
    platform: 'Zerodha',
    quantity: 30,
    price: 2133.33,
    amount: 63999.9,
    fees: 127.99,
    tax: 115.19,
    totalAmount: 64243.08,
    status: 'Completed',
    paymentMode: 'Bank Transfer',
    orderId: 'ZER231125010',
    logo: '🏦',
    category: 'Stocks',
  },
  {
    id: 'TXN024',
    date: '2023-11-20T10:00:00',
    type: 'SIP',
    asset: 'ICICI Prudential Technology Fund',
    symbol: 'ICICI-TECH',
    platform: 'Groww',
    quantity: 80,
    price: 83,
    amount: 6640,
    fees: 0,
    tax: 0,
    totalAmount: 6640,
    status: 'Completed',
    paymentMode: 'Auto-Debit',
    orderId: 'GRW231120006',
    logo: '🚀',
    category: 'Mutual Funds',
  },
  {
    id: 'TXN025',
    date: '2023-11-15T15:50:00',
    type: 'Dividend',
    asset: 'Reliance Industries Ltd',
    symbol: 'RELIANCE',
    platform: 'Zerodha',
    quantity: 20,
    price: 42,
    amount: 840,
    fees: 0,
    tax: 84,
    totalAmount: 756,
    status: 'Completed',
    paymentMode: 'Credit to Account',
    orderId: 'ZER231115011',
    logo: '🛢️',
    category: 'Stocks',
  },

  // OCTOBER 2023 - More transactions
  {
    id: 'TXN026',
    date: '2023-10-30T12:30:00',
    type: 'Buy',
    asset: 'Ethereum',
    symbol: 'ETH',
    platform: 'Binance',
    quantity: 0.3,
    price: 275000,
    amount: 82500,
    fees: 825,
    tax: 0,
    totalAmount: 83325,
    status: 'Completed',
    paymentMode: 'UPI',
    orderId: 'BIN231030006',
    logo: 'Ξ',
    category: 'Cryptocurrency',
  },
  {
    id: 'TXN027',
    date: '2023-10-22T09:15:00',
    type: 'Sell',
    asset: 'Asian Paints Ltd',
    symbol: 'ASIANPAINT',
    platform: 'Upstox',
    quantity: 5,
    price: 3500,
    amount: 17500,
    fees: 35,
    tax: 31.5,
    totalAmount: 17433.5,
    status: 'Completed',
    paymentMode: 'Bank Transfer',
    orderId: 'UPS231022004',
    logo: '🎨',
    category: 'Stocks',
  },
  {
    id: 'TXN028',
    date: '2023-10-15T14:00:00',
    type: 'SIP',
    asset: 'Parag Parikh Flexi Cap Fund',
    symbol: 'PPFAS',
    platform: 'Groww',
    quantity: 100,
    price: 85,
    amount: 8500,
    fees: 0,
    tax: 0,
    totalAmount: 8500,
    status: 'Completed',
    paymentMode: 'Auto-Debit',
    orderId: 'GRW231015007',
    logo: '🌟',
    category: 'Mutual Funds',
  },
  {
    id: 'TXN029',
    date: '2023-10-10T11:20:00',
    type: 'Buy',
    asset: 'Infosys Ltd',
    symbol: 'INFY',
    platform: 'Zerodha',
    quantity: 15,
    price: 1900,
    amount: 28500,
    fees: 57,
    tax: 51.3,
    totalAmount: 28608.3,
    status: 'Pending',
    paymentMode: 'UPI',
    orderId: 'ZER231010012',
    logo: '💻',
    category: 'Stocks',
  },
  {
    id: 'TXN030',
    date: '2023-10-05T16:45:00',
    type: 'Dividend',
    asset: 'HDFC Bank Ltd',
    symbol: 'HDFCBANK',
    platform: 'Zerodha',
    quantity: 60,
    price: 33,
    amount: 1980,
    fees: 0,
    tax: 198,
    totalAmount: 1782,
    status: 'Completed',
    paymentMode: 'Credit to Account',
    orderId: 'ZER231005013',
    logo: '🏦',
    category: 'Stocks',
  },
];

// FILTER OPTIONS
export const transactionFilters = {
  platforms: ['All', 'Zerodha', 'Groww', 'Upstox', 'Binance'],
  types: ['All', 'Buy', 'Sell', 'Dividend', 'SIP'],
  status: ['All', 'Completed', 'Pending', 'Failed'],
  categories: ['All', 'Stocks', 'Mutual Funds', 'ETF', 'Cryptocurrency'],
  paymentModes: ['All', 'UPI', 'Bank Transfer', 'Auto-Debit', 'Crypto Wallet', 'Credit to Account'],
  dateRanges: [
    { label: 'All Time', value: 'all' },
    { label: 'Today', value: '1d' },
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 3 Months', value: '3m' },
    { label: 'Last 6 Months', value: '6m' },
    { label: 'Last 1 Year', value: '1y' },
    { label: 'Custom Range', value: 'custom' },
  ],
  amountRanges: [
    { label: 'All Amounts', value: 'all' },
    { label: '₹0 - ₹10,000', value: '0-10000' },
    { label: '₹10,000 - ₹50,000', value: '10000-50000' },
    { label: '₹50,000 - ₹1,00,000', value: '50000-100000' },
    { label: '₹1,00,000+', value: '100000+' },
  ],
};

// SUMMARY STATISTICS
export const transactionSummary = {
  totalTransactions: transactions.length,
  completedTransactions: transactions.filter((t) => t.status === 'Completed').length,
  pendingTransactions: transactions.filter((t) => t.status === 'Pending').length,
  failedTransactions: transactions.filter((t) => t.status === 'Failed').length,
  totalBuyAmount: transactions
    .filter((t) => t.type === 'Buy' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.totalAmount, 0),
  totalSellAmount: transactions
    .filter((t) => t.type === 'Sell' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.totalAmount, 0),
  totalDividendAmount: transactions
    .filter((t) => t.type === 'Dividend' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.totalAmount, 0),
  totalSIPAmount: transactions
    .filter((t) => t.type === 'SIP' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.totalAmount, 0),
  totalFeesSpent: transactions
    .filter((t) => t.status === 'Completed')
    .reduce((sum, t) => sum + t.fees, 0),
  totalTaxSpent: transactions
    .filter((t) => t.status === 'Completed')
    .reduce((sum, t) => sum + t.tax, 0),
};

// MONTHLY DATA FOR CHARTS
export const getMonthlyTransactionData = () => {
  const monthlyData = {};

  transactions
    .filter((t) => t.status === 'Completed')
    .forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          buy: 0,
          sell: 0,
          dividend: 0,
          sip: 0,
          total: 0,
        };
      }

      const type = transaction.type.toLowerCase();
      monthlyData[monthKey][type] += transaction.totalAmount;
      monthlyData[monthKey].total += transaction.totalAmount;
    });

  return Object.values(monthlyData).reverse();
};

// CATEGORY-WISE DATA FOR CHARTS
export const getCategoryWiseData = () => {
  const categoryData = {};

  transactions
    .filter((t) => t.status === 'Completed')
    .forEach((transaction) => {
      const category = transaction.category;

      if (!categoryData[category]) {
        categoryData[category] = {
          name: category,
          value: 0,
          count: 0,
        };
      }

      categoryData[category].value += transaction.totalAmount;
      categoryData[category].count += 1;
    });

  return Object.values(categoryData);
};

// PLATFORM-WISE DATA FOR CHARTS
export const getPlatformWiseData = () => {
  const platformData = {};

  transactions
    .filter((t) => t.status === 'Completed')
    .forEach((transaction) => {
      const platform = transaction.platform;

      if (!platformData[platform]) {
        platformData[platform] = {
          name: platform,
          value: 0,
          count: 0,
        };
      }

      platformData[platform].value += transaction.totalAmount;
      platformData[platform].count += 1;
    });

  return Object.values(platformData);
};

// TYPE-WISE DATA FOR CHARTS
export const getTypeWiseData = () => {
  const typeData = {
    Buy: { name: 'Buy', value: 0, count: 0, color: '#10b981' },
    Sell: { name: 'Sell', value: 0, count: 0, color: '#ef4444' },
    Dividend: { name: 'Dividend', value: 0, count: 0, color: '#f59e0b' },
    SIP: { name: 'SIP', value: 0, count: 0, color: '#6366f1' },
  };

  transactions
    .filter((t) => t.status === 'Completed')
    .forEach((transaction) => {
      const type = transaction.type;
      typeData[type].value += transaction.totalAmount;
      typeData[type].count += 1;
    });

  return Object.values(typeData);
};

export default transactions;
