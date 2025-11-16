// Connected platforms
export const connectedPlatforms = [
  {
    id: 1,
    name: 'Zerodha',
    logo: '🟢',
    connected: true,
    totalInvested: 250000,
    currentValue: 285000,
    returns: 35000,
    returnPercentage: 14,
    lastSync: '2024-11-01T10:30:00'
  },
  {
    id: 2,
    name: 'Groww',
    logo: '🟡',
    connected: true,
    totalInvested: 180000,
    currentValue: 195000,
    returns: 15000,
    returnPercentage: 8.33,
    lastSync: '2024-11-01T09:15:00'
  },
  {
    id: 3,
    name: 'Upstox',
    logo: '🟠',
    connected: true,
    totalInvested: 120000,
    currentValue: 138000,
    returns: 18000,
    returnPercentage: 15,
    lastSync: '2024-11-01T11:00:00'
  },
  {
    id: 4,
    name: 'Crypto (Binance)',
    logo: '🔵',
    connected: false,
    totalInvested: 0,
    currentValue: 0,
    returns: 0,
    returnPercentage: 0,
    lastSync: null
  }
];

// Portfolio summary
export const portfolioSummary = {
  totalInvested: 550000,
  currentValue: 618000,
  totalReturns: 68000,
  returnPercentage: 12.36,
  dayChange: 2500,
  dayChangePercentage: 0.41,
  activePlatforms: 3,
  totalInvestments: 25
};

// Asset allocation
export const assetAllocation = [
  { name: 'Equity', value: 350000, percentage: 56.6, color: '#3B82F6' },
  { name: 'Debt', value: 120000, percentage: 19.4, color: '#10B981' },
  { name: 'Gold', value: 80000, percentage: 12.9, color: '#F59E0B' },
  { name: 'Crypto', value: 68000, percentage: 11.1, color: '#8B5CF6' }
];

// Performance over time (monthly data for last 12 months)
export const performanceData = [
  { month: 'Dec 2023', invested: 500000, value: 520000 },
  { month: 'Jan 2024', invested: 510000, value: 535000 },
  { month: 'Feb 2024', invested: 515000, value: 545000 },
  { month: 'Mar 2024', invested: 520000, value: 555000 },
  { month: 'Apr 2024', invested: 525000, value: 565000 },
  { month: 'May 2024', invested: 530000, value: 575000 },
  { month: 'Jun 2024', invested: 535000, value: 580000 },
  { month: 'Jul 2024', invested: 540000, value: 590000 },
  { month: 'Aug 2024', invested: 545000, value: 600000 },
  { month: 'Sep 2024', invested: 550000, value: 610000 },
  { month: 'Oct 2024', invested: 550000, value: 615000 },
  { month: 'Nov 2024', invested: 550000, value: 618000 }
];

// Top performing investments
export const topPerformers = [
  {
    id: 1,
    name: 'HDFC Bank',
    platform: 'Zerodha',
    invested: 50000,
    current: 68000,
    returns: 18000,
    returnPercentage: 36,
    type: 'Equity'
  },
  {
    id: 2,
    name: 'Reliance Industries',
    platform: 'Groww',
    invested: 75000,
    current: 89000,
    returns: 14000,
    returnPercentage: 18.67,
    type: 'Equity'
  },
  {
    id: 3,
    name: 'Gold ETF',
    platform: 'Upstox',
    invested: 80000,
    current: 92000,
    returns: 12000,
    returnPercentage: 15,
    type: 'Gold'
  }
];

// Recent activity
export const recentActivity = [
  {
    id: 1,
    type: 'buy',
    asset: 'Infosys',
    platform: 'Zerodha',
    amount: 15000,
    quantity: 50,
    price: 300,
    date: '2024-10-30T14:30:00',
    status: 'completed'
  },
  {
    id: 2,
    type: 'sell',
    asset: 'TCS',
    platform: 'Groww',
    amount: 22000,
    quantity: 60,
    price: 366.67,
    date: '2024-10-28T11:15:00',
    status: 'completed'
  },
  {
    id: 3,
    type: 'sip',
    asset: 'Axis Bluechip Fund',
    platform: 'Groww',
    amount: 5000,
    date: '2024-10-25T09:00:00',
    status: 'completed'
  },
  {
    id: 4,
    type: 'buy',
    asset: 'Bitcoin',
    platform: 'Binance',
    amount: 10000,
    quantity: 0.15,
    price: 66666.67,
    date: '2024-10-20T16:45:00',
    status: 'completed'
  }
];