// src/data/aiAnalysisData.js

/**
 * AI Analysis Data for Spark Investment AI
 * Contains AI-generated insights, predictions, risk assessments
 */

export const aiAnalysisData = {
  // RELIANCE INDUSTRIES
  INV001: {
    investmentId: 'INV001',
    investmentName: 'Reliance Industries Ltd',
    symbol: 'RELIANCE',
    analysisDate: '2024-11-03',
    
    // AI Recommendation
    recommendation: 'Buy',
    confidence: 85,
    targetPrice: 3800,
    stopLoss: 3200,
    
    // Investment Health Score (0-100)
    healthScore: 82,
    healthGrade: 'A',
    
    // Valuation
    valuation: 'Fair', // Overvalued | Fair | Undervalued
    valuationScore: 68,
    
    // AI Explanation
    aiExplanation: 'Strong buy recommendation based on robust fundamentals and diversified business model. The company shows consistent growth across multiple sectors with strong management execution. Current market positioning and future growth prospects in digital services make this an attractive long-term investment despite moderate valuation.',
    
    // Risk Assessment
    riskLevel: 'Medium',
    riskScore: 6.2,
    volatility: 'Moderate',
    
    // Pros and Cons
    pros: [
      'Strong fundamentals with diversified business model',
      'Consistent revenue growth across multiple sectors',
      'Low debt-to-equity ratio indicating financial stability',
      'Digital transformation initiatives showing promise',
      'Strong management team with clear vision',
    ],
    cons: [
      'High valuation compared to industry peers',
      'Dependence on oil & gas sector for major revenue',
      'Regulatory challenges in telecom sector',
      'Competition intensifying in retail segment',
    ],
    
    // Sector Analysis
    sectorAnalysis: {
      sector: 'Energy & Diversified',
      sectorGrowth: 'Positive',
      marketShare: 'Leading',
      competitivePosition: 'Strong',
      insights: 'Energy sector showing recovery post-pandemic. Company\'s diversification into retail and telecom provides stability. Digital services segment expected to be major growth driver.',
    },
    
    // Diversification Score
    diversificationScore: 7.5,
    diversificationInsight: 'Well-diversified across energy, retail, telecom, and digital services. Reduces overall portfolio risk.',
    
    // Benchmark Comparison
    benchmarks: {
      nifty50: {
        name: 'NIFTY 50',
        performance: '+12.5%',
        comparison: 'Outperforming',
        differential: '+22.5%',
      },
      sensex: {
        name: 'SENSEX',
        performance: '+11.8%',
        comparison: 'Outperforming',
        differential: '+23.2%',
      },
    },
    
    // Historical Performance (5 years back)
    historicalData: [
      { year: -5, value: 1200, returns: 0 },
      { year: -4, value: 1450, returns: 20.8 },
      { year: -3, value: 1680, returns: 15.9 },
      { year: -2, value: 2100, returns: 25.0 },
      { year: -1, value: 2500, returns: 19.0 },
      { year: 0, value: 3375, returns: 35.0 },
    ],
    
    // Future Predictions (5 years forward)
    predictions: [
      { year: 0, value: 3375, confidence: 100 },
      { year: 1, value: 3800, confidence: 85 },
      { year: 2, value: 4200, confidence: 75 },
      { year: 3, value: 4650, confidence: 65 },
      { year: 4, value: 5100, confidence: 55 },
      { year: 5, value: 5600, confidence: 45 },
    ],
    
    // AI Insights
    aiInsights: [
      'Strong buy signal based on technical and fundamental analysis',
      'Expected to benefit from India\'s digital transformation',
      'Retail segment showing consistent growth trajectory',
      'Telecom ARPU improvements expected in coming quarters',
      'Renewable energy investments positioned for future growth',
    ],
    
    // Key Metrics
    keyMetrics: {
      pe_ratio: 24.5,
      pb_ratio: 2.8,
      roe: 14.2,
      debtToEquity: 0.45,
      dividendYield: 0.8,
    },
  },

  // TCS
  INV002: {
    investmentId: 'INV002',
    investmentName: 'Tata Consultancy Services',
    symbol: 'TCS',
    analysisDate: '2024-11-03',
    
    recommendation: 'Hold',
    confidence: 72,
    targetPrice: 3800,
    stopLoss: 3200,
    
    riskLevel: 'Low',
    riskScore: 3.8,
    volatility: 'Low',
    
    pros: [
      'Industry leader with strong brand reputation',
      'Diversified client base across geographies',
      'High operating margins and cash generation',
      'Consistent dividend payout history',
      'Strong digital transformation capabilities',
    ],
    cons: [
      'Client concentration in few sectors',
      'Wage inflation pressuring margins',
      'Competition from global IT giants',
      'Slowdown in banking and financial services clients',
    ],
    
    sectorAnalysis: {
      sector: 'Information Technology',
      sectorGrowth: 'Stable',
      marketShare: 'Leading',
      competitivePosition: 'Strong',
      insights: 'IT services sector facing headwinds due to global economic uncertainty. However, cloud migration and digital transformation initiatives provide long-term growth opportunities.',
    },
    
    diversificationScore: 6.8,
    diversificationInsight: 'Good diversification across IT services. Consider adding non-IT exposure to portfolio.',
    
    benchmarks: {
      nifty50: {
        name: 'NIFTY 50',
        performance: '+12.5%',
        comparison: 'Underperforming',
        differential: '-20.5%',
      },
      sensex: {
        name: 'SENSEX',
        performance: '+11.8%',
        comparison: 'Underperforming',
        differential: '-19.8%',
      },
    },
    
    historicalData: [
      { year: -5, value: 2800, returns: 0 },
      { year: -4, value: 3200, returns: 14.3 },
      { year: -3, value: 3500, returns: 9.4 },
      { year: -2, value: 3900, returns: 11.4 },
      { year: -1, value: 3750, returns: -3.8 },
      { year: 0, value: 3450, returns: -8.0 },
    ],
    
    predictions: [
      { year: 0, value: 3450, confidence: 100 },
      { year: 1, value: 3650, confidence: 80 },
      { year: 2, value: 3900, confidence: 70 },
      { year: 3, value: 4200, confidence: 60 },
      { year: 4, value: 4500, confidence: 50 },
      { year: 5, value: 4850, confidence: 40 },
    ],
    
    aiInsights: [
      'Current dip presents potential buying opportunity for long-term investors',
      'Strong balance sheet provides stability during market volatility',
      'Focus on AI and automation services expected to drive growth',
      'Order book remains healthy despite near-term challenges',
      'Valuation attractive compared to historical averages',
    ],
    
    keyMetrics: {
      pe_ratio: 27.8,
      pb_ratio: 12.5,
      roe: 45.2,
      debtToEquity: 0.02,
      dividendYield: 3.2,
    },
  },

  // HDFC BANK
  INV003: {
    investmentId: 'INV003',
    investmentName: 'HDFC Bank Ltd',
    symbol: 'HDFCBANK',
    analysisDate: '2024-11-03',
    
    recommendation: 'Strong Buy',
    confidence: 90,
    targetPrice: 2400,
    stopLoss: 2000,
    
    riskLevel: 'Low',
    riskScore: 3.2,
    volatility: 'Low',
    
    pros: [
      'Largest private sector bank with strong brand',
      'Robust asset quality and low NPA ratios',
      'Consistent growth in deposits and advances',
      'Strong digital banking infrastructure',
      'Efficient cost management and high profitability',
    ],
    cons: [
      'Integration challenges post HDFC merger',
      'Competitive pressure from fintech companies',
      'Regulatory risks in banking sector',
      'Slower loan growth in certain segments',
    ],
    
    sectorAnalysis: {
      sector: 'Banking & Financial Services',
      sectorGrowth: 'Strong',
      marketShare: 'Leading',
      competitivePosition: 'Dominant',
      insights: 'Banking sector benefiting from economic recovery. Credit growth accelerating. Digital adoption increasing customer engagement and reducing costs.',
    },
    
    diversificationScore: 8.2,
    diversificationInsight: 'Excellent addition for portfolio stability. Banking sector provides defensive characteristics.',
    
    benchmarks: {
      nifty50: {
        name: 'NIFTY 50',
        performance: '+12.5%',
        comparison: 'Outperforming',
        differential: '+15.5%',
      },
      sensex: {
        name: 'SENSEX',
        performance: '+11.8%',
        comparison: 'Outperforming',
        differential: '+16.2%',
      },
    },
    
    historicalData: [
      { year: -5, value: 1100, returns: 0 },
      { year: -4, value: 1280, returns: 16.4 },
      { year: -3, value: 1450, returns: 13.3 },
      { year: -2, value: 1666, returns: 14.9 },
      { year: -1, value: 1900, returns: 14.0 },
      { year: 0, value: 2133, returns: 28.0 },
    ],
    
    predictions: [
      { year: 0, value: 2133, confidence: 100 },
      { year: 1, value: 2400, confidence: 88 },
      { year: 2, value: 2700, confidence: 80 },
      { year: 3, value: 3000, confidence: 70 },
      { year: 4, value: 3350, confidence: 60 },
      { year: 5, value: 3700, confidence: 50 },
    ],
    
    aiInsights: [
      'Top pick in banking sector with strong fundamentals',
      'HDFC merger synergies expected to materialize over time',
      'Digital initiatives driving customer acquisition and retention',
      'Strong liability franchise provides competitive advantage',
      'Valuation reasonable given growth prospects',
    ],
    
    keyMetrics: {
      pe_ratio: 19.5,
      pb_ratio: 2.9,
      roe: 17.8,
      debtToEquity: 0.0,
      dividendYield: 1.2,
    },
  },

  // BITCOIN
  INV011: {
    investmentId: 'INV011',
    investmentName: 'Bitcoin',
    symbol: 'BTC',
    analysisDate: '2024-11-03',
    
    recommendation: 'Hold',
    confidence: 65,
    targetPrice: 7500000,
    stopLoss: 6000000,
    
    riskLevel: 'High',
    riskScore: 8.5,
    volatility: 'Very High',
    
    pros: [
      'Leading cryptocurrency with strong brand recognition',
      'Institutional adoption increasing globally',
      'Limited supply creates scarcity value',
      'Decentralized nature provides independence',
      'Growing acceptance as store of value',
    ],
    cons: [
      'Extreme price volatility and speculation',
      'Regulatory uncertainty in multiple jurisdictions',
      'Environmental concerns over mining',
      'Competition from other cryptocurrencies',
      'Security risks and exchange vulnerabilities',
    ],
    
    sectorAnalysis: {
      sector: 'Cryptocurrency',
      sectorGrowth: 'Volatile but Growing',
      marketShare: 'Dominant',
      competitivePosition: 'Leader',
      insights: 'Cryptocurrency market maturing with institutional participation. Regulatory clarity improving in some regions. Bitcoin maintaining dominance despite competition.',
    },
    
    diversificationScore: 5.5,
    diversificationInsight: 'High risk asset. Limit exposure to 5-10% of portfolio. Provides uncorrelated returns to traditional assets.',
    
    benchmarks: {
      nifty50: {
        name: 'NIFTY 50',
        performance: '+12.5%',
        comparison: 'Significantly Outperforming',
        differential: '+57.5%',
      },
      sensex: {
        name: 'SENSEX',
        performance: '+11.8%',
        comparison: 'Significantly Outperforming',
        differential: '+58.2%',
      },
    },
    
    historicalData: [
      { year: -5, value: 2800000, returns: 0 },
      { year: -4, value: 3500000, returns: 25.0 },
      { year: -3, value: 4200000, returns: 20.0 },
      { year: -2, value: 4000000, returns: -4.8 },
      { year: -1, value: 5500000, returns: 37.5 },
      { year: 0, value: 6800000, returns: 70.0 },
    ],
    
    predictions: [
      { year: 0, value: 6800000, confidence: 100 },
      { year: 1, value: 7500000, confidence: 50 },
      { year: 2, value: 8200000, confidence: 40 },
      { year: 3, value: 9000000, confidence: 35 },
      { year: 4, value: 10000000, confidence: 30 },
      { year: 5, value: 11500000, confidence: 25 },
    ],
    
    aiInsights: [
      'Extreme volatility expected to continue in near term',
      'ETF approvals could drive institutional adoption',
      'Bitcoin halving cycle may impact supply dynamics',
      'Regulatory developments key risk factor to monitor',
      'Consider dollar-cost averaging approach for entries',
    ],
    
    keyMetrics: {
      pe_ratio: null,
      pb_ratio: null,
      roe: null,
      debtToEquity: null,
      dividendYield: 0.0,
    },
  },
};

// Investment IDs for dropdown
export const availableInvestments = [
  { id: 'INV001', name: 'Reliance Industries Ltd', symbol: 'RELIANCE' },
  { id: 'INV002', name: 'Tata Consultancy Services', symbol: 'TCS' },
  { id: 'INV003', name: 'HDFC Bank Ltd', symbol: 'HDFCBANK' },
  { id: 'INV011', name: 'Bitcoin', symbol: 'BTC' },
];

// Risk level configuration
export const riskLevels = {
  Low: {
    color: 'green',
    range: '0-4',
    description: 'Low volatility, stable returns expected',
  },
  Medium: {
    color: 'yellow',
    range: '4-7',
    description: 'Moderate volatility, balanced risk-reward',
  },
  High: {
    color: 'red',
    range: '7-10',
    description: 'High volatility, significant price swings possible',
  },
};

// Recommendation types
export const recommendations = {
  'Strong Buy': { color: 'green', icon: '🚀', confidence: 85 },
  'Buy': { color: 'green', icon: '📈', confidence: 70 },
  'Hold': { color: 'yellow', icon: '⏸️', confidence: 60 },
  'Sell': { color: 'red', icon: '📉', confidence: 40 },
  'Strong Sell': { color: 'red', icon: '⚠️', confidence: 30 },
};

// ===================================
// Portfolio-Wide AI Analysis Data
// ===================================

// Portfolio Insights
export const portfolioInsights = {
  healthScore: 78,
  healthGrade: 'B+',
  diversification: 'Good',
  valuation: 'Fair Value',
  valuationScore: 7.2,
  summary: 'Your portfolio shows strong performance with balanced diversification across multiple sectors. Risk exposure is moderate with good potential for long-term growth. Consider rebalancing to increase exposure to high-growth sectors while maintaining current risk levels.',
  keyMetrics: {
    totalReturn: '+34.45%',
    volatility: 'Moderate',
    sharpeRatio: 1.42,
    betaRatio: 0.95
  },
  predictionData: []
};

// Risk Analysis
export const riskAnalysis = {
  riskLevel: 'MEDIUM',
  riskScore: 58,
  volatility: 'Moderate',
  riskBreakdown: {
    marketRisk: 45,
    sectorRisk: 52,
    concentrationRisk: 38,
    liquidityRisk: 25
  },
  recommendations: [
    'Diversify into defensive sectors (FMCG, Pharma)',
    'Reduce concentration in energy sector (currently 28%)',
    'Consider adding fixed income instruments'
  ]
};

// Market Sentiment
export const marketSentiment = {
  overall: 'BULLISH',
  score: 72,
  confidence: 0.85,
  sentiment: 'Positive',
  indicators: {
    technical: 'Bullish',
    fundamental: 'Neutral',
    news: 'Positive',
    socialMedia: 'Very Positive'
  },
  summary: 'Market sentiment remains positive with strong buying interest across sectors. Technical indicators suggest continued uptrend, though some consolidation expected.',
  lastUpdated: new Date().toISOString()
};

// Portfolio Recommendations
export const portfolioRecommendations = {
  overallRecommendation: 'HOLD',
  confidence: 0.82,
  pros: [
    'Strong diversification across sectors reduces risk',
    'Portfolio showing consistent positive returns (+34%)',
    'Good mix of growth and value stocks',
    'Low concentration risk with 20 holdings'
  ],
  cons: [
    'High exposure to energy sector (28%)',
    'Limited defensive stocks (Pharma, FMCG)',
    'Some holdings showing overbought signals',
    'Could benefit from fixed income allocation'
  ],
  actions: [
    {
      type: 'BUY',
      symbol: 'HDFC',
      name: 'HDFC Bank',
      reason: 'Undervalued with strong fundamentals',
      confidence: 0.85,
      targetAllocation: '8%'
    },
    {
      type: 'SELL',
      symbol: 'RELIANCE',
      name: 'Reliance Industries',
      reason: 'Book partial profits after 35% gains',
      confidence: 0.75,
      targetAllocation: '5%'
    },
    {
      type: 'HOLD',
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      reason: 'Stable performer, maintain current position',
      confidence: 0.80,
      targetAllocation: '6%'
    }
  ]
};

// Quick Insights
export const quickInsights = [
  {
    id: 1,
    type: 'opportunity',
    title: 'Undervalued Stock Detected',
    description: 'HDFC Bank showing strong fundamentals with 15% undervaluation',
    action: 'Consider increasing position',
    confidence: 0.82
  },
  {
    id: 2,
    type: 'warning',
    title: 'Profit Taking Opportunity',
    description: 'Reliance Industries up 35% - consider partial profit booking',
    action: 'Book 30% profits',
    confidence: 0.75
  },
  {
    id: 3,
    type: 'info',
    title: 'Sector Rotation Detected',
    description: 'Money flowing from IT to Banking sector',
    action: 'Monitor portfolio allocation',
    confidence: 0.88
  }
];

// Chat Messages (for AI chat feature)
export const chatMessages = [];

export default aiAnalysisData;