// Live Market Data with Simulated Real-Time Updates
// This data will be used for the Live Trading page

export const platforms = [
  { id: 'zerodha', name: 'Zerodha', logo: '🔷' },
  { id: 'groww', name: 'Groww', logo: '🟢' },
  { id: 'upstox', name: 'Upstox', logo: '🟣' },
  { id: 'binance', name: 'Binance', logo: '🟡' },
];

// Initial market data (will be updated in real-time)
export const initialMarketData = [
  {
    id: 'RELIANCE',
    name: 'Reliance Industries',
    symbol: 'RELIANCE',
    type: 'Stock',
    platform: 'Zerodha',
    currentPrice: 3375,
    previousClose: 3300,
    change: 75,
    changePercent: 2.27,
    open: 3310,
    high: 3390,
    low: 3305,
    volume: '2.5M',
    logo: '🛢️',
    sector: 'Energy',
    priceHistory: [3310, 3320, 3340, 3355, 3360, 3370, 3375], // Last 7 data points
  },
  {
    id: 'TCS',
    name: 'Tata Consultancy Services',
    symbol: 'TCS',
    type: 'Stock',
    platform: 'Zerodha',
    currentPrice: 4250,
    previousClose: 4280,
    change: -30,
    changePercent: -0.70,
    open: 4275,
    high: 4290,
    low: 4240,
    volume: '1.8M',
    logo: '💻',
    sector: 'IT',
    priceHistory: [4275, 4270, 4265, 4260, 4255, 4248, 4250],
  },
  {
    id: 'INFY',
    name: 'Infosys Ltd',
    symbol: 'INFY',
    type: 'Stock',
    platform: 'Groww',
    currentPrice: 1850,
    previousClose: 1820,
    change: 30,
    changePercent: 1.65,
    open: 1825,
    high: 1865,
    low: 1820,
    volume: '3.2M',
    logo: '🏢',
    sector: 'IT',
    priceHistory: [1825, 1830, 1835, 1840, 1845, 1848, 1850],
  },
  {
    id: 'BTC',
    name: 'Bitcoin',
    symbol: 'BTC/USDT',
    type: 'Crypto',
    platform: 'Binance',
    currentPrice: 67500,
    previousClose: 66800,
    change: 700,
    changePercent: 1.05,
    open: 66900,
    high: 67800,
    low: 66700,
    volume: '24.5K BTC',
    logo: '₿',
    sector: 'Crypto',
    priceHistory: [66900, 67000, 67100, 67200, 67300, 67400, 67500],
  },
  {
    id: 'ETH',
    name: 'Ethereum',
    symbol: 'ETH/USDT',
    type: 'Crypto',
    platform: 'Binance',
    currentPrice: 3850,
    previousClose: 3900,
    change: -50,
    changePercent: -1.28,
    open: 3895,
    high: 3910,
    low: 3830,
    volume: '18.2K ETH',
    logo: '⟠',
    sector: 'Crypto',
    priceHistory: [3895, 3890, 3880, 3870, 3860, 3855, 3850],
  },
  {
    id: 'SOL',
    name: 'Solana',
    symbol: 'SOL/USDT',
    type: 'Crypto',
    platform: 'Binance',
    currentPrice: 245,
    previousClose: 238,
    change: 7,
    changePercent: 2.94,
    open: 240,
    high: 248,
    low: 239,
    volume: '12.8K SOL',
    logo: '◎',
    sector: 'Crypto',
    priceHistory: [240, 241, 242, 243, 244, 244.5, 245],
  },
];

// AI Analysis for each asset (simulated screen analysis)
export const aiAnalysisData = {
  RELIANCE: {
    signal: 'BUY',
    confidence: 87,
    pattern: 'Bullish Flag',
    trend: 'up',
    rsi: 62,
    macd: 'Bullish Crossover',
    volumeStatus: 'High',
    entryPrice: 3370,
    targetPrice: 3500,
    targetPercent: 3.8,
    stopLoss: 3250,
    stopLossPercent: -3.6,
    riskLevel: 'Medium',
    potentialProfit: 3000,
    warning: 'Watch for resistance at ₹3,400. Strong momentum but market volatility increasing.',
    reasons: [
      'Strong quarterly results announced',
      'Energy sector showing growth momentum',
      'Technical breakout from consolidation',
      'Volume supporting the upward move',
    ],
    technicalIndicators: {
      rsi: { value: 62, status: 'Neutral' },
      macd: { value: 'Positive', status: 'Bullish Crossover' },
      movingAvg: { value: 'Above 20-day MA', status: 'Bullish' },
    },
  },
  TCS: {
    signal: 'HOLD',
    confidence: 65,
    pattern: 'Descending Triangle',
    trend: 'down',
    rsi: 48,
    macd: 'Neutral',
    volumeStatus: 'Medium',
    entryPrice: 4245,
    targetPrice: 4300,
    targetPercent: 1.3,
    stopLoss: 4200,
    stopLossPercent: -1.1,
    riskLevel: 'Low',
    potentialProfit: 1100,
    warning: 'Stock showing weakness. Wait for clear direction before entering.',
    reasons: [
      'IT sector facing headwinds',
      'Price below key moving averages',
      'Earnings growth slowing',
      'Awaiting quarterly results',
    ],
    technicalIndicators: {
      rsi: { value: 48, status: 'Neutral' },
      macd: { value: 'Flat', status: 'Neutral' },
      movingAvg: { value: 'Below 50-day MA', status: 'Bearish' },
    },
  },
  INFY: {
    signal: 'BUY',
    confidence: 78,
    pattern: 'Cup and Handle',
    trend: 'up',
    rsi: 58,
    macd: 'Bullish',
    volumeStatus: 'High',
    entryPrice: 1848,
    targetPrice: 1920,
    targetPercent: 3.9,
    stopLoss: 1810,
    stopLossPercent: -2.1,
    riskLevel: 'Medium',
    potentialProfit: 1800,
    warning: 'Good entry point but watch global IT sector trends.',
    reasons: [
      'Breaking out of consolidation',
      'Strong client additions reported',
      'Deal wins accelerating',
      'Technical setup favorable',
    ],
    technicalIndicators: {
      rsi: { value: 58, status: 'Bullish' },
      macd: { value: 'Positive', status: 'Bullish' },
      movingAvg: { value: 'Above 20-day MA', status: 'Bullish' },
    },
  },
  BTC: {
    signal: 'BUY',
    confidence: 82,
    pattern: 'Ascending Triangle',
    trend: 'up',
    rsi: 64,
    macd: 'Strong Bullish',
    volumeStatus: 'Very High',
    entryPrice: 67400,
    targetPrice: 70000,
    targetPercent: 3.9,
    stopLoss: 65500,
    stopLossPercent: -2.8,
    riskLevel: 'High',
    potentialProfit: 6500,
    warning: 'High volatility expected. Use tight stop-loss.',
    reasons: [
      'Breaking all-time high resistance',
      'Institutional buying increasing',
      'Bitcoin ETF inflows strong',
      'Market sentiment very bullish',
    ],
    technicalIndicators: {
      rsi: { value: 64, status: 'Bullish' },
      macd: { value: 'Strong Positive', status: 'Very Bullish' },
      movingAvg: { value: 'Above all MAs', status: 'Strong Bullish' },
    },
  },
  ETH: {
    signal: 'HOLD',
    confidence: 58,
    pattern: 'Bearish Pennant',
    trend: 'down',
    rsi: 45,
    macd: 'Bearish',
    volumeStatus: 'Medium',
    entryPrice: 3845,
    targetPrice: 3950,
    targetPercent: 2.7,
    stopLoss: 3780,
    stopLossPercent: -1.7,
    riskLevel: 'Medium',
    potentialProfit: 2100,
    warning: 'Weak momentum. Consider waiting for reversal confirmation.',
    reasons: [
      'Following Bitcoin weakness',
      'Gas fees declining',
      'Some profit booking visible',
      'Support at $3800 critical',
    ],
    technicalIndicators: {
      rsi: { value: 45, status: 'Neutral' },
      macd: { value: 'Negative', status: 'Bearish' },
      movingAvg: { value: 'Near 50-day MA', status: 'Neutral' },
    },
  },
  SOL: {
    signal: 'BUY',
    confidence: 85,
    pattern: 'Breakout from Wedge',
    trend: 'up',
    rsi: 68,
    macd: 'Bullish',
    volumeStatus: 'Very High',
    entryPrice: 244,
    targetPrice: 260,
    targetPercent: 6.6,
    stopLoss: 235,
    stopLossPercent: -3.7,
    riskLevel: 'High',
    potentialProfit: 4000,
    warning: 'Strong momentum but overbought. Book partial profits at target.',
    reasons: [
      'Network activity surging',
      'DeFi TVL increasing rapidly',
      'Ecosystem growth accelerating',
      'Breaking key resistance levels',
    ],
    technicalIndicators: {
      rsi: { value: 68, status: 'Overbought' },
      macd: { value: 'Strong Positive', status: 'Bullish' },
      movingAvg: { value: 'Above all MAs', status: 'Very Bullish' },
    },
  },
};

// Auto-trading settings (default values)
export const defaultAutoTradeSettings = {
  enabled: false,
  dailyLimit: 10000,
  perTradeLimit: 2000,
  maxTradesPerDay: 5,
  riskLevel: 'medium', // low, medium, high
  autoStopLoss: true,
  stopLossPercent: 3,
  autoTarget: true,
  targetPercent: 5,
  tradingHours: {
    start: '09:15',
    end: '15:30',
  },
  notifications: {
    beforeExecution: true,
    afterExecution: true,
    stopLossTriggered: true,
  },
};

// Sample execution log
export const initialExecutionLog = [
  {
    id: 'TXN001',
    time: '11:23:45',
    action: 'BUY',
    asset: 'RELIANCE',
    quantity: 10,
    price: 3365,
    amount: 33650,
    status: 'executed',
    type: 'auto',
    reason: 'AI Signal: Strong bullish pattern detected',
  },
  {
    id: 'TXN002',
    time: '11:15:22',
    action: 'SELL',
    asset: 'TCS',
    quantity: 5,
    price: 4270,
    amount: 21350,
    status: 'executed',
    type: 'auto',
    reason: 'AI Signal: Profit target reached',
  },
  {
    id: 'TXN003',
    time: '11:10:08',
    action: 'SELL',
    asset: 'INFY',
    quantity: 15,
    price: 1815,
    amount: 27225,
    status: 'stop-loss',
    type: 'auto',
    reason: 'Stop-loss triggered at ₹1815',
  },
  {
    id: 'TXN004',
    time: '10:45:30',
    action: 'BUY',
    asset: 'BTC',
    quantity: 0.5,
    price: 66800,
    amount: 33400,
    status: 'executed',
    type: 'manual',
    reason: 'Manual trade executed',
  },
];

// Function to simulate price updates (to be used with setInterval)
export const updatePrice = (currentPrice, volatility = 0.002) => {
  // Generate random price change (-volatility to +volatility)
  const change = (Math.random() - 0.5) * 2 * volatility;
  const newPrice = currentPrice * (1 + change);
  return Math.round(newPrice * 100) / 100; // Round to 2 decimals
};

// Function to calculate change and percentage
export const calculateChange = (currentPrice, previousClose) => {
  const change = currentPrice - previousClose;
  const changePercent = (change / previousClose) * 100;
  return {
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
  };
};

// Function to update price history
export const updatePriceHistory = (history, newPrice) => {
  const updatedHistory = [...history.slice(1), newPrice]; // Remove first, add new
  return updatedHistory;
};

// Chart timeframes
export const chartTimeframes = [
  { id: '1D', label: '1 Day', dataPoints: 24 },
  { id: '1W', label: '1 Week', dataPoints: 7 },
  { id: '1M', label: '1 Month', dataPoints: 30 },
];

// Generate historical chart data for selected timeframe
export const generateChartData = (asset, timeframe) => {
  const basePrice = asset.currentPrice;
  const dataPoints = chartTimeframes.find(t => t.id === timeframe)?.dataPoints || 24;
  
  const data = [];
  let price = basePrice * 0.95; // Start 5% below current price
  
  for (let i = 0; i < dataPoints; i++) {
    // Simulate gradual increase to current price
    // eslint-disable-next-line no-unused-vars
    const progress = i / dataPoints;
    const targetPrice = basePrice;
    price = price + (targetPrice - price) * 0.1 + (Math.random() - 0.5) * (basePrice * 0.01);
    
    data.push({
      time: i,
      price: Math.round(price * 100) / 100,
      label: timeframe === '1D' ? `${i}:00` : timeframe === '1W' ? `Day ${i + 1}` : `Day ${i + 1}`,
    });
  }
  
  return data;
};

// Screen capture status
export const screenCaptureStates = {
  inactive: { status: 'inactive', color: 'gray', icon: '⚫', label: 'Not Active' },
  starting: { status: 'starting', color: 'yellow', icon: '🟡', label: 'Initializing...' },
  active: { status: 'active', color: 'green', icon: '🟢', label: 'Active' },
  analyzing: { status: 'analyzing', color: 'blue', icon: '🔵', label: 'Analyzing...' },
  error: { status: 'error', color: 'red', icon: '🔴', label: 'Error' },
};