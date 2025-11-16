// src/data/settingsData.js

/**
 * Settings Data for Spark Investment AI
 * User Profile, Preferences, Security, Notifications, Platform Connections
 */

// USER PROFILE DATA
export const userProfile = {
  id: "USER001",
  firstName: "Rahul",
  lastName: "Sharma",
  email: "rahul.sharma@example.com",
  phone: "+91 98765 43210",
  dateOfBirth: "1995-06-15",
  gender: "Male",
  nationality: "Indian",
  pan: "ABCDE1234F",
  address: {
    street: "123 MG Road",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001",
    country: "India",
  },
  profilePicture: null,
  kycStatus: "Verified",
  kycVerifiedDate: "2023-05-20",
  memberSince: "2023-01-15",
  riskProfile: "Moderate",
  investmentGoals: ["Retirement", "Wealth Creation", "Tax Savings"],
  annualIncome: "₹12,00,000 - ₹18,00,000",
};

// NOTIFICATION SETTINGS
export const notificationSettings = {
  email: {
    enabled: true,
    marketAlerts: true,
    priceAlerts: true,
    portfolioUpdates: true,
    transactionConfirmations: true,
    monthlyReports: true,
    aiRecommendations: true,
    promotionalEmails: false,
    newsAndUpdates: true,
  },
  sms: {
    enabled: true,
    transactionAlerts: true,
    securityAlerts: true,
    loginAlerts: true,
    paymentReminders: false,
    priceAlerts: false,
  },
  push: {
    enabled: true,
    marketMovements: true,
    goalMilestones: true,
    autoInvestExecutions: true,
    portfolioChanges: true,
    securityAlerts: true,
    dailySummary: false,
  },
  frequency: {
    priceAlerts: "Instant",
    portfolioUpdates: "Daily",
    marketNews: "Weekly",
  },
};

// CONNECTED PLATFORMS
export const connectedPlatforms = [
  {
    id: "PLAT001",
    name: "Zerodha",
    logo: "📊",
    type: "Stock Broker",
    status: "Connected",
    connectedDate: "2023-01-20",
    lastSync: "2024-03-15T10:30:00",
    permissions: ["Read Portfolio", "Execute Trades", "View Transactions"],
    accountNumber: "ZR****1234",
    apiKey: "ze_****_****_1234",
    autoSync: true,
  },
  {
    id: "PLAT002",
    name: "Groww",
    logo: "🌱",
    type: "Mutual Funds",
    status: "Connected",
    connectedDate: "2023-02-10",
    lastSync: "2024-03-15T09:15:00",
    permissions: ["Read Portfolio", "View Transactions"],
    accountNumber: "GW****5678",
    apiKey: "gw_****_****_5678",
    autoSync: true,
  },
  {
    id: "PLAT003",
    name: "Upstox",
    logo: "📈",
    type: "Stock Broker",
    status: "Connected",
    connectedDate: "2023-03-15",
    lastSync: "2024-03-15T08:45:00",
    permissions: ["Read Portfolio"],
    accountNumber: "UP****9012",
    apiKey: "up_****_****_9012",
    autoSync: false,
  },
  {
    id: "PLAT004",
    name: "Binance",
    logo: "🪙",
    type: "Cryptocurrency",
    status: "Disconnected",
    connectedDate: null,
    lastSync: null,
    permissions: [],
    accountNumber: null,
    apiKey: null,
    autoSync: false,
  },
];

// SECURITY SETTINGS
export const securitySettings = {
  twoFactorAuth: {
    enabled: true,
    method: "Authenticator App", // 'SMS', 'Email', 'Authenticator App'
    enabledDate: "2023-05-10",
  },
  biometric: {
    enabled: true,
    type: "Fingerprint", // 'Fingerprint', 'Face ID'
  },
  sessionTimeout: 30, // minutes
  loginAlerts: true,
  trustedDevices: [
    {
      id: "DEV001",
      name: "iPhone 13 Pro",
      type: "Mobile",
      lastUsed: "2024-03-15T10:30:00",
      location: "Bangalore, India",
      addedDate: "2023-01-15",
    },
    {
      id: "DEV002",
      name: "MacBook Pro",
      type: "Desktop",
      lastUsed: "2024-03-14T18:20:00",
      location: "Bangalore, India",
      addedDate: "2023-01-15",
    },
  ],
  loginHistory: [
    {
      id: "LOG001",
      date: "2024-03-15T10:30:00",
      device: "iPhone 13 Pro",
      location: "Bangalore, India",
      ipAddress: "103.x.x.x",
      status: "Success",
    },
    {
      id: "LOG002",
      date: "2024-03-14T18:20:00",
      device: "MacBook Pro",
      location: "Bangalore, India",
      ipAddress: "103.x.x.x",
      status: "Success",
    },
    {
      id: "LOG003",
      date: "2024-03-13T09:15:00",
      device: "Unknown Device",
      location: "Mumbai, India",
      ipAddress: "152.x.x.x",
      status: "Blocked",
    },
  ],
};

// PREFERENCE SETTINGS
export const preferenceSettings = {
  language: "English",
  currency: "INR",
  timezone: "Asia/Kolkata",
  dateFormat: "DD/MM/YYYY",
  numberFormat: "Indian (12,34,567)",
  defaultView: "Dashboard", // 'Dashboard', 'Portfolio', 'Investments'
  chartType: "Line", // 'Line', 'Candlestick', 'Area'
  compactMode: false,
  animations: true,
  soundEffects: false,
  dataRefreshInterval: 30, // seconds
  itemsPerPage: 20,
  autoLogout: true,
  autoLogoutTime: 30, // minutes
  safetySettings: {
    autoTradingEnabled: false,
    dailyLimit: 10000,
    perTradeLimit: 2000,
    minConfidenceThreshold: 75,
    emergencyStopActive: false,
    requireApproval: true,
    allowAfterHours: false,
    maxDailyTrades: 5,
  },
};

// APPEARANCE SETTINGS
export const appearanceSettings = {
  theme: "light", // 'light', 'dark', 'auto'
  accentColor: "indigo", // 'indigo', 'blue', 'purple', 'green', 'orange'
  fontSize: "medium", // 'small', 'medium', 'large'
  sidebarPosition: "left", // 'left', 'right'
  sidebarCollapsed: false,
  showAnimations: true,
  highContrast: false,
  reducedMotion: false,
};

// AVAILABLE OPTIONS
export const availableOptions = {
  languages: [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "hi", name: "हिंदी (Hindi)", flag: "🇮🇳" },
    { code: "mr", name: "मराठी (Marathi)", flag: "🇮🇳" },
    { code: "ta", name: "தமிழ் (Tamil)", flag: "🇮🇳" },
    { code: "te", name: "తెలుగు (Telugu)", flag: "🇮🇳" },
    { code: "bn", name: "বাংলা (Bengali)", flag: "🇮🇳" },
  ],
  currencies: [
    { code: "INR", name: "Indian Rupee (₹)", symbol: "₹" },
    { code: "USD", name: "US Dollar ($)", symbol: "$" },
    { code: "EUR", name: "Euro (€)", symbol: "€" },
    { code: "GBP", name: "British Pound (£)", symbol: "£" },
  ],
  timezones: [
    { code: "Asia/Kolkata", name: "IST (GMT+5:30)" },
    { code: "America/New_York", name: "EST (GMT-5)" },
    { code: "Europe/London", name: "GMT (GMT+0)" },
    { code: "Asia/Singapore", name: "SGT (GMT+8)" },
  ],
  themes: [
    { value: "light", name: "Light", icon: "☀️" },
    { value: "dark", name: "Dark", icon: "🌙" },
    { value: "auto", name: "Auto (System)", icon: "💻" },
  ],
  accentColors: [
    { value: "indigo", name: "Indigo", color: "#6366f1" },
    { value: "blue", name: "Blue", color: "#3b82f6" },
    { value: "purple", name: "Purple", color: "#a855f7" },
    { value: "green", name: "Green", color: "#10b981" },
    { value: "orange", name: "Orange", color: "#f97316" },
  ],
};

// PRIVACY SETTINGS
export const privacySettings = {
  profileVisibility: "Private", // 'Public', 'Private', 'Friends'
  sharePortfolio: false,
  shareReturns: false,
  allowAnalytics: true,
  allowMarketingCookies: false,
  dataRetention: "2 years", // '1 year', '2 years', '5 years', 'Forever'
};

// EXPORT DATA OPTIONS
export const exportOptions = [
  {
    type: "Portfolio Holdings",
    format: "CSV",
    description: "Export all your current holdings",
    icon: "📄",
  },
  {
    type: "Transaction History",
    format: "CSV/PDF",
    description: "Export complete transaction history",
    icon: "📊",
  },
  {
    type: "Tax Reports",
    format: "PDF",
    description: "Export tax summary for financial year",
    icon: "📋",
  },
  {
    type: "Performance Reports",
    format: "PDF",
    description: "Export portfolio performance reports",
    icon: "📈",
  },
  {
    type: "Complete Account Data",
    format: "ZIP",
    description: "Export all your account data",
    icon: "📦",
  },
];

export default {
  userProfile,
  notificationSettings,
  connectedPlatforms,
  securitySettings,
  preferenceSettings,
  appearanceSettings,
  availableOptions,
  privacySettings,
  exportOptions,
};
