# Frontend API Usage & Required Fixes
**Complete Guide to Frontend API Alignment**

**Date:** 2024-11-17
**Purpose:** Document where each API is used in frontend and exact changes needed to align with API contract

---

## 📍 Frontend API Architecture Overview

### API Service Layer
**Location:** `/src/services/api.js`
**Purpose:** Centralized API client with mock mode support
**Pattern:** All API calls go through this service layer

### Custom Hooks Layer
**Location:** `/src/hooks/`
**Purpose:** React Query hooks that consume API services
**Pattern:** Each hook maps to specific API endpoints

### Pages & Components
**Purpose:** UI that consumes the hooks
**Pattern:** Pages use hooks, hooks use API services, API services call backend

---

## 🔍 CATEGORY 1: Authentication APIs

### Current Status: ❌ Misaligned

### Where Used in Frontend:

| File | Lines | Function | API Called |
|------|-------|----------|------------|
| `src/contexts/AuthContext.jsx` | 125-171 | `login()` | Mock only (NO API) |
| `src/contexts/AuthContext.jsx` | 176-228 | `signup()` | Mock only (NO API) |
| `src/contexts/AuthContext.jsx` | 61-79 | `attemptTokenRefresh()` | Mock only (NO API) |
| `src/contexts/AuthContext.jsx` | 277-296 | `sendOTP()` | Mock only (NO API) |
| `src/contexts/AuthContext.jsx` | 301-332 | `verifyOTP()` | Mock only (NO API) |
| `src/contexts/AuthContext.jsx` | 337-356 | `resetPassword()` | Mock only (NO API) |
| `src/pages/auth/Login.jsx` | 102 | `login()` | Uses AuthContext |
| `src/pages/auth/Signup.jsx` | ~100 | `signup()` | Uses AuthContext |
| `src/pages/auth/ForgotPassword.jsx` | ~80 | `sendOTP()` | Uses AuthContext |

### ❌ Issues Found:

1. **NO API Integration**
   - Auth is 100% mock implementation
   - AuthContext doesn't use API service
   - Token storage uses local keys: `spark_access_token`, `spark_refresh_token`, `spark_user`

2. **Token Management Mismatch**
   - Frontend uses: `localStorage.getItem('spark_access_token')`
   - API service uses: `localStorage.getItem('auth_token')` (line 44 in api.js)
   - **Conflict!** Two different token keys

### ✅ Required Fixes:

#### Fix 1: Add Auth API to api.js
**File:** `src/services/api.js`
**Location:** After line 690 (before export)

```javascript
// ===================================
// Authentication API
// ===================================
export const authAPI = {
  // Signup
  signup: async (userData) => {
    if (MOCK_MODE) {
      await simulateDelay(1500);
      return mockResponse({
        success: true,
        data: {
          user: { id: 'mock_id', email: userData.email, name: userData.name },
          token: 'mock_token',
          refreshToken: 'mock_refresh_token',
        },
      });
    }
    const response = await apiClient.post('/auth/signup', userData);
    return response.data;
  },

  // Login
  login: async (email, password, rememberMe) => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse({
        success: true,
        data: {
          user: { id: 'mock_id', email, name: email.split('@')[0] },
          token: 'mock_token',
          refreshToken: 'mock_refresh_token',
        },
      });
    }
    const response = await apiClient.post('/auth/login', { email, password, rememberMe });
    return response.data;
  },

  // Logout
  logout: async () => {
    if (MOCK_MODE) {
      await simulateDelay(500);
      return mockResponse({ success: true, message: 'Logged out successfully' });
    }
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // Refresh Token
  refreshToken: async (refreshToken) => {
    if (MOCK_MODE) {
      await simulateDelay(500);
      return mockResponse({
        success: true,
        data: { token: 'new_mock_token', refreshToken: 'new_mock_refresh_token' },
      });
    }
    const response = await apiClient.post('/auth/refresh', {}, {
      headers: { Authorization: `Bearer ${refreshToken}` }
    });
    return response.data;
  },

  // Forgot Password
  forgotPassword: async (email) => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse({
        success: true,
        message: 'OTP sent to registered email and phone',
        data: { otpSentTo: `em***@example.com`, expiresIn: 600 },
      });
    }
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset Password
  resetPassword: async (email, otp, newPassword) => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse({ success: true, message: 'Password reset successfully' });
    }
    const response = await apiClient.post('/auth/reset-password', { email, otp, newPassword });
    return response.data;
  },
};
```

#### Fix 2: Update token key in api.js
**File:** `src/services/api.js`
**Line:** 44
**Change:**
```javascript
// BEFORE:
const token = localStorage.getItem('auth_token');

// AFTER:
const token = localStorage.getItem('spark_access_token');
```

#### Fix 3: Update AuthContext to use API
**File:** `src/contexts/AuthContext.jsx`
**Line:** 1
**Add import:**
```javascript
import { authAPI } from '../services/api';
```

**Line:** 125-171
**Replace login() function:**
```javascript
const login = useCallback(async (email, password, keepSignedIn = false) => {
  try {
    // Call real API through authAPI service
    const result = await authAPI.login(email, password, keepSignedIn);

    if (!result.success) {
      throw new Error(result.error || 'Login failed');
    }

    const { user, token, refreshToken } = result.data;
    const tokenExpiry = Date.now() + ACCESS_TOKEN_EXPIRY;

    // Store in localStorage
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, tokenExpiry.toString());

    // Update state
    setUser(user);
    setIsAuthenticated(true);

    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
}, []);
```

**Similar updates needed for:** `signup()`, `attemptTokenRefresh()`, `sendOTP()`, `verifyOTP()`, `resetPassword()`

---

## 🔍 CATEGORY 2: Portfolio APIs

### Current Status: ⚠️ Partially Aligned (3 misalignments)

### Where Used in Frontend:

| Hook File | Function | API Service Call | Backend Endpoint Expected |
|-----------|----------|-----------------|--------------------------|
| `hooks/usePortfolio.js:18` | `usePortfolioSummary()` | `portfolioAPI.getSummary()` | `GET /portfolio/summary` ✅ |
| `hooks/usePortfolio.js:36` | `useConnectedPlatforms()` | `portfolioAPI.getPlatforms()` | `GET /portfolio/platforms` ✅ |
| `hooks/usePortfolio.js:51` | `usePortfolioPerformance()` | `portfolioAPI.getPerformance(period)` | `GET /portfolio/performance?period=` ✅ |
| `hooks/usePortfolio.js:65` | `useAssetAllocation()` | `portfolioAPI.getAllocation()` | `GET /portfolio/allocation` ❌ |
| `hooks/usePortfolio.js:79` | `useTopPerformers()` | `portfolioAPI.getTopPerformers()` | `GET /portfolio/top-performers` ❌ |
| `hooks/usePortfolio.js:93` | `useRecentActivity()` | `portfolioAPI.getRecentActivity(limit)` | `GET /portfolio/activity?limit=` ❌ |
| `hooks/usePortfolio.js:108` | `useConnectPlatform()` | `portfolioAPI.connectPlatform()` | `POST /portfolio/connect` ⚠️ |
| `hooks/usePortfolio.js:127` | `useDisconnectPlatform()` | `portfolioAPI.disconnectPlatform(id)` | `DELETE /portfolio/platforms/:id` ✅ |

### ❌ Issues Found:

1. **GET `/portfolio/allocation`** - API contract includes this in `/portfolio/summary` response
2. **GET `/portfolio/top-performers`** - Not documented in API contract
3. **GET `/portfolio/activity`** - Not documented in API contract
4. **POST `/portfolio/connect`** vs **POST `/platforms/connect`** - Path mismatch

### ✅ Required Fixes:

#### Option A: Remove separate allocation endpoint (RECOMMENDED)
**File:** `src/hooks/usePortfolio.js`
**Lines:** 61-70
**Action:** Update hook to extract from summary instead

```javascript
// Change useAssetAllocation to use summary data
export const useAssetAllocation = () => {
  const summaryQuery = usePortfolioSummary();

  return {
    data: summaryQuery.data?.assetAllocation,
    isLoading: summaryQuery.isLoading,
    isError: summaryQuery.isError,
    refetch: summaryQuery.refetch,
  };
};
```

**File:** `src/services/api.js`
**Lines:** 124-131
**Action:** Remove `getAllocation()` method OR keep as alias

```javascript
// Option 1: Remove completely
// DELETE lines 124-131

// Option 2: Make it alias to summary (better for backward compatibility)
getAllocation: async () => {
  if (MOCK_MODE) {
    await simulateDelay(300);
    return mockResponse(mockPortfolio.summary.assetAllocation);
  }
  const response = await apiClient.get('/portfolio/summary');
  return { data: response.data.assetAllocation };
},
```

#### Option B: Add missing endpoints to API contract
**File:** `Spark-Investment-Frontend/docs/API_SPECIFICATION.md`
**Action:** Add these endpoints to documentation

```markdown
### GET /portfolio/allocation
**Response:**
```json
{
  "success": true,
  "data": {
    "equity": 60.00,
    "debt": 25.00,
    "gold": 10.00,
    "crypto": 5.00
  }
}
```

### GET /portfolio/top-performers
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "TCS",
      "returns": 25.50,
      "currentValue": 125000
    }
  ]
}
```

### GET /portfolio/activity?limit={limit}
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "type": "buy",
      "symbol": "RELIANCE",
      "amount": 50000,
      "timestamp": "2024-11-17T10:30:00Z"
    }
  ]
}
```
```

#### Fix for Platform Connect Path Mismatch
**File:** `src/services/api.js`
**Lines:** 154-161
**Change:**

```javascript
// BEFORE:
connectPlatform: async (platform, credentials) => {
  if (MOCK_MODE) {
    await simulateDelay(1500);
    return mockResponse({ success: true, message: 'Platform connected successfully' });
  }
  const response = await apiClient.post('/portfolio/connect', { platform, credentials });
  return response.data;
},

// AFTER (align with API contract):
connectPlatform: async (platform, credentials) => {
  if (MOCK_MODE) {
    await simulateDelay(1500);
    return mockResponse({ success: true, message: 'Platform connected successfully' });
  }
  // Changed path to match API contract
  const response = await apiClient.post('/platforms/connect', {
    platform,
    apiKey: credentials.apiKey,
    apiSecret: credentials.apiSecret,
    additionalAuth: credentials.additionalAuth
  });
  return response.data;
},
```

---

## 🔍 CATEGORY 3: Investments APIs

### Current Status: ⚠️ Major Misalignment (Category filtering)

### Where Used in Frontend:

| Hook File | Function | API Service Call | Backend Endpoint Expected |
|-----------|----------|-----------------|--------------------------|
| `hooks/useInvestments.js:20` | `useInvestments()` | `investmentsAPI.getAll()` | `GET /investments` ✅ |
| `hooks/useInvestments.js:43` | `useInvestment(id)` | `investmentsAPI.getById(id)` | `GET /investments/:id` ✅ |
| `hooks/useInvestments.js:56` | `useStocks()` | `investmentsAPI.getStocks()` | `GET /investments/stocks` ❌ |
| `hooks/useInvestments.js:69` | `useMutualFunds()` | `investmentsAPI.getMutualFunds()` | `GET /investments/mutual-funds` ❌ |
| `hooks/useInvestments.js:82` | `useCrypto()` | `investmentsAPI.getCrypto()` | `GET /investments/crypto` ❌ |
| `hooks/useInvestments.js:99` | `useAddInvestment()` | `investmentsAPI.add()` | `POST /investments` ✅ |
| `hooks/useInvestments.js:112` | `useUpdateInvestment()` | `investmentsAPI.update()` | `PUT /investments/:id` ✅ |
| `hooks/useInvestments.js:126` | `useDeleteInvestment()` | `investmentsAPI.delete()` | `DELETE /investments/:id` ✅ |

### ❌ Issues Found:

1. **Separate Category Endpoints**
   - Frontend expects: `/investments/stocks`, `/investments/mutual-funds`, `/investments/crypto`
   - API contract uses: `/investments?type=stock`, `/investments?type=mutual_fund`, `/investments?type=crypto`

### ✅ Required Fixes:

#### Fix: Update API service to use query parameters
**File:** `src/services/api.js`
**Lines:** 204-232
**Change:**

```javascript
// BEFORE:
// Get mutual funds
getMutualFunds: async () => {
  if (MOCK_MODE) {
    await simulateDelay(350);
    return mockResponse(mockInvestments.mutualFunds);
  }
  const response = await apiClient.get('/investments/mutual-funds');
  return response.data;
},

// Get stocks
getStocks: async () => {
  if (MOCK_MODE) {
    await simulateDelay(350);
    return mockResponse(mockInvestments.stocks);
  }
  const response = await apiClient.get('/investments/stocks');
  return response.data;
},

// Get crypto
getCrypto: async () => {
  if (MOCK_MODE) {
    await simulateDelay(350);
    return mockResponse(mockInvestments.crypto);
  }
  const response = await apiClient.get('/investments/crypto');
  return response.data;
},

// AFTER (use query parameters):
// Get mutual funds
getMutualFunds: async () => {
  if (MOCK_MODE) {
    await simulateDelay(350);
    return mockResponse(mockInvestments.mutualFunds);
  }
  const response = await apiClient.get('/investments?type=mutual_fund');
  return response.data;
},

// Get stocks
getStocks: async () => {
  if (MOCK_MODE) {
    await simulateDelay(350);
    return mockResponse(mockInvestments.stocks);
  }
  const response = await apiClient.get('/investments?type=stock');
  return response.data;
},

// Get crypto
getCrypto: async () => {
  if (MOCK_MODE) {
    await simulateDelay(350);
    return mockResponse(mockInvestments.crypto);
  }
  const response = await apiClient.get('/investments?type=crypto');
  return response.data;
},
```

---

## 🔍 CATEGORY 4: Market Data APIs

### Current Status: ⚠️ 3 Undocumented Endpoints

### Where Used in Frontend:

| Hook File | Function | API Service Call | Backend Endpoint Expected |
|-----------|----------|-----------------|--------------------------|
| `hooks/useMarketData.js:20` | `useMarketIndices()` | `marketDataAPI.getIndices()` | `GET /market/indices` ✅ |
| `hooks/useMarketData.js:51` | `useTopGainers()` | `marketDataAPI.getTopGainers(limit)` | `GET /market/gainers?limit=` ✅ |
| `hooks/useMarketData.js:66` | `useTopLosers()` | `marketDataAPI.getTopLosers(limit)` | `GET /market/losers?limit=` ✅ |
| `hooks/useMarketData.js:81` | `useSectorPerformance()` | `marketDataAPI.getSectorPerformance()` | `GET /market/sectors` ❌ |
| `hooks/useMarketData.js:95` | `useStockQuote()` | `marketDataAPI.getQuote(symbol)` | `GET /market/quote/:symbol` ✅ |
| `hooks/useMarketData.js:112` | `useCryptoMarket()` | `marketDataAPI.getCryptoMarket()` | `GET /market/crypto` ❌ |
| `hooks/useMarketData.js:127` | `useForexRates()` | `marketDataAPI.getForexRates()` | `GET /market/forex` ❌ |

### ❌ Issues Found:

1. **GET `/market/sectors`** - Not in API contract
2. **GET `/market/crypto`** - Not in API contract
3. **GET `/market/forex`** - Not in API contract

### ✅ Required Fixes:

#### Option A: Add to API Contract (RECOMMENDED)
**File:** `Spark-Investment-Frontend/docs/API_SPECIFICATION.md`
**Location:** After line 665 (Market Data section)
**Add:**

```markdown
### GET /market/sectors
**Description:** Get sector-wise performance data

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sectors": [
      {
        "name": "IT",
        "change": 1.25,
        "changePercent": 0.85,
        "topGainer": "TCS",
        "topLoser": "WIPRO"
      }
    ]
  }
}
```

### GET /market/crypto
**Description:** Get cryptocurrency market overview

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "cryptos": [
      {
        "symbol": "BTC",
        "name": "Bitcoin",
        "price": 4500000,
        "change": 50000,
        "changePercent": 1.12,
        "volume": "25.5B"
      }
    ]
  }
}
```

### GET /market/forex
**Description:** Get forex exchange rates

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "rates": [
      {
        "pair": "USD/INR",
        "rate": 83.25,
        "change": 0.15,
        "changePercent": 0.18
      }
    ]
  }
}
```
```

#### Option B: Remove from Frontend
**File:** `src/services/api.js`
**Action:** Comment out or remove lines 300-344

---

## 🔍 CATEGORY 5: AI Analysis APIs

### Current Status: ⚠️ 4 Structure Misalignments

### Where Used in Frontend:

| Hook File | Function | API Service Call | Backend Endpoint Expected |
|-----------|----------|-----------------|--------------------------|
| `hooks/useAI.js:18` | `usePortfolioInsights()` | `aiAPI.getPortfolioInsights()` | `GET /ai/insights` ✅ |
| `hooks/useAI.js:36` | `useAIRecommendations()` | `aiAPI.getRecommendations()` | `GET /ai/recommendations` ❌ |
| `hooks/useAI.js:54` | `useRiskAnalysis()` | `aiAPI.getRiskAnalysis()` | `GET /ai/risk-analysis` ❌ |
| `hooks/useAI.js:69` | `useMarketSentiment()` | `aiAPI.getMarketSentiment()` | `GET /ai/market-sentiment` ⚠️ |
| `hooks/useAI.js:84` | `useQuickInsights()` | `aiAPI.getQuickInsights()` | `GET /ai/quick-insights` ❌ |
| `hooks/useAI.js:98` | `useAIChat()` | `aiAPI.chat(message)` | `POST /ai/chat` ❌ |
| `hooks/useAI.js:117` | `useInvestmentAnalysis()` | `aiAPI.getInvestmentAnalysis(id)` | `GET /ai/investments/:id/analysis` ✅ |

### ❌ Issues Found:

1. **GET `/ai/recommendations`** - API contract includes in `/ai/insights` response
2. **GET `/ai/risk-analysis`** - API contract includes in `/ai/insights` response
3. **GET `/ai/market-sentiment`** - API contract path is `/ai/sentiment` (different)
4. **GET `/ai/quick-insights`** - Not in API contract
5. **POST `/ai/chat`** - Not in API contract

### ✅ Required Fixes:

#### Fix 1: Update market sentiment path
**File:** `src/services/api.js`
**Line:** 387
**Change:**

```javascript
// BEFORE:
getMarketSentiment: async () => {
  if (MOCK_MODE) {
    await simulateDelay(600);
    return mockResponse(mockAIAnalysis.marketSentiment);
  }
  const response = await apiClient.get('/ai/market-sentiment');
  return response.data;
},

// AFTER:
getMarketSentiment: async () => {
  if (MOCK_MODE) {
    await simulateDelay(600);
    return mockResponse(mockAIAnalysis.marketSentiment);
  }
  // Changed path to match API contract
  const response = await apiClient.get('/ai/sentiment');
  return response.data;
},
```

#### Fix 2: Update hooks to extract from insights (RECOMMENDED)
**File:** `src/hooks/useAI.js`
**Lines:** 30-60
**Change:**

```javascript
// Option 1: Make recommendations extract from insights
export const useAIRecommendations = () => {
  const insightsQuery = usePortfolioInsights();

  return {
    data: insightsQuery.data?.recommendations,
    isLoading: insightsQuery.isLoading,
    isError: insightsQuery.isError,
    refetch: insightsQuery.refetch,
  };
};

// Option 2: Make risk analysis extract from insights
export const useRiskAnalysis = () => {
  const insightsQuery = usePortfolioInsights();

  return {
    data: {
      riskScore: insightsQuery.data?.riskScore,
      riskLevel: insightsQuery.data?.riskLevel,
      volatility: insightsQuery.data?.volatility,
    },
    isLoading: insightsQuery.isLoading,
    isError: insightsQuery.isError,
    refetch: insightsQuery.refetch,
  };
};
```

#### Fix 3: Add missing endpoints to API contract OR remove from frontend
**Decision Required:** Should `/ai/chat` and `/ai/quick-insights` be implemented in backend?

If YES - Add to API contract:
```markdown
### POST /ai/chat
**Request:**
```json
{
  "message": "Should I invest in TCS?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Based on current analysis...",
    "timestamp": "2024-11-17T10:30:00Z",
    "suggestions": ["Check risk analysis", "View portfolio insights"]
  }
}
```
```

If NO - Remove from `src/services/api.js` lines 392-413 and hooks

---

## 🔍 CATEGORY 6: Trading APIs

### Current Status: ❌ Major Path Misalignments

### Where Used in Frontend:

| Hook File | Function | API Service Call | Backend Endpoint Expected |
|-----------|----------|-----------------|--------------------------|
| `hooks/useTrading.js:18` | `useTradeHistory()` | `tradingAPI.getTradeHistory(limit)` | `GET /trading/history?limit=` ⚠️ |
| `hooks/useTrading.js:35` | `usePendingOrders()` | `tradingAPI.getPendingOrders()` | `GET /trading/pending` ⚠️ |
| `hooks/useTrading.js:76` | `useExecuteTrade()` | `tradingAPI.executeTrade(data)` | `POST /trading/execute` ⚠️ |
| `hooks/useTrading.js:113` | `useCancelOrder()` | `tradingAPI.cancelOrder(id)` | `DELETE /trading/orders/:id` ✅ |

### ❌ Issues Found:

1. **POST `/trading/execute`** → Should be **POST `/trading/orders`**
2. **GET `/trading/history`** → Should be **GET `/trading/orders?status=executed`**
3. **GET `/trading/pending`** → Should be **GET `/trading/positions`** (different concept)

### ✅ Required Fixes:

**File:** `src/services/api.js`
**Lines:** 452-495
**Change ALL trading endpoints:**

```javascript
// ===================================
// Trading API (UPDATED TO MATCH API CONTRACT)
// ===================================
export const tradingAPI = {
  // Execute trade (RENAMED)
  placeOrder: async (orderData) => {  // Changed from executeTrade
    if (MOCK_MODE) {
      await simulateDelay(1500);
      return mockResponse({
        success: true,
        orderId: `ORD${Date.now()}`,
        status: 'pending',
        message: 'Order placed successfully',
      });
    }
    // Changed endpoint path
    const response = await apiClient.post('/trading/orders', orderData);
    return response.data;
  },

  // Get order history (UPDATED)
  getOrderHistory: async (filters = {}) => {  // Changed from getTradeHistory
    if (MOCK_MODE) {
      await simulateDelay(400);
      return mockResponse(mockTransactions.transactions);
    }
    // Changed endpoint path and added filters
    const response = await apiClient.get('/trading/orders', { params: filters });
    return response.data;
  },

  // Get pending orders → Open positions (RENAMED)
  getOpenPositions: async () => {  // Changed from getPendingOrders
    if (MOCK_MODE) {
      await simulateDelay(350);
      return mockResponse([]);
    }
    // Changed endpoint path
    const response = await apiClient.get('/trading/positions');
    return response.data;
  },

  // Get specific order
  getOrder: async (orderId) => {  // NEW
    if (MOCK_MODE) {
      await simulateDelay(300);
      return mockResponse({ orderId, status: 'executed' });
    }
    const response = await apiClient.get(`/trading/orders/${orderId}`);
    return response.data;
  },

  // Cancel order (ALREADY CORRECT)
  cancelOrder: async (orderId) => {
    if (MOCK_MODE) {
      await simulateDelay(800);
      return mockResponse({ success: true, message: 'Order cancelled' });
    }
    const response = await apiClient.delete(`/trading/orders/${orderId}`);
    return response.data;
  },
};
```

**File:** `src/hooks/useTrading.js`
**Update all hook calls:**

```javascript
// Line 18: Update hook name and call
export const useOrderHistory = (filters = {}) => {  // Renamed
  const setTradeHistory = useStore((state) => state.setTradeHistory);

  return useQuery({
    queryKey: ['trading', 'orders', filters],  // Changed key
    queryFn: async () => {
      const response = await tradingAPI.getOrderHistory(filters);  // Changed call
      setTradeHistory(response.data);
      return response.data;
    },
    staleTime: 60000,
  });
};

// Line 29: Rename to positions
export const useOpenPositions = () => {  // Renamed
  const setPendingOrders = useStore((state) => state.setPendingOrders);

  return useQuery({
    queryKey: ['trading', 'positions'],  // Changed key
    queryFn: async () => {
      const response = await tradingAPI.getOpenPositions();  // Changed call
      setPendingOrders(response.data);
      return response.data;
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
};

// Line 46: Rename to place order
export const usePlaceOrder = () => {  // Renamed from useExecuteTrade
  const queryClient = useQueryClient();
  // ... rest of code

  return useMutation({
    mutationFn: async (orderData) => {  // Changed param name
      // ... safety checks ...

      return await tradingAPI.placeOrder({  // Changed call
        ...orderData,
        paperTrade: settings.trading.paperTradingMode,
      });
    },
    onSuccess: (data) => {
      // ... existing code ...
      queryClient.invalidateQueries({ queryKey: ['trading', 'positions'] });  // Changed key
      queryClient.invalidateQueries({ queryKey: ['trading', 'orders'] });  // Changed key
      // ... rest of code
    },
  });
};
```

---

## 🔍 CATEGORY 7: Transactions APIs

### Current Status: ⚠️ 2 Method Misalignments

### Where Used in Frontend:

| Hook File | Function | API Service Call | Backend Endpoint Expected |
|-----------|----------|-----------------|--------------------------|
| `hooks/useTrading.js:134` | `useTransactions()` | `transactionsAPI.getAll(filters)` | `GET /transactions` ✅ |
| `hooks/useTrading.js:151` | `useTransactionSummary()` | `transactionsAPI.getSummary(period)` | `GET /transactions/summary` ❌ |
| `hooks/useTrading.js:164` | `useExportTransactions()` | `transactionsAPI.export(format, filters)` | `GET /transactions/export` ⚠️ |

### ❌ Issues Found:

1. **GET `/transactions/summary`** - Not in API contract
2. **GET `/transactions/export`** - Should be **POST `/transactions/export`** (async)

### ✅ Required Fixes:

#### Fix: Update export to POST method
**File:** `src/services/api.js`
**Lines:** 523-532
**Change:**

```javascript
// BEFORE:
export: async (format = 'csv', filters = {}) => {
  if (MOCK_MODE) {
    await simulateDelay(1000);
    return mockResponse({ downloadUrl: '#', message: 'Export ready' });
  }
  const response = await apiClient.get(`/transactions/export?format=${format}`, {
    params: filters,
  });
  return response.data;
},

// AFTER:
export: async (format = 'csv', filters = {}) => {
  if (MOCK_MODE) {
    await simulateDelay(1000);
    return mockResponse({
      success: true,
      message: 'Export initiated',
      data: {
        exportId: 'exp_' + Date.now(),
        status: 'pending',
        estimatedTime: 30
      }
    });
  }
  // Changed to POST method for async operation
  const response = await apiClient.post('/transactions/export', {
    format,
    from: filters.from,
    to: filters.to,
    filters: { type: filters.type, platform: filters.platform }
  });
  return response.data;
},

// ADD: Download export result
downloadExport: async (exportId) => {
  if (MOCK_MODE) {
    return mockResponse({ downloadUrl: '#' });
  }
  const response = await apiClient.get(`/transactions/export/${exportId}/download`);
  return response.data;
},
```

**File:** `src/hooks/useTrading.js`
**Lines:** 162-176
**Update hook:**

```javascript
export const useExportTransactions = () => {
  return useMutation({
    mutationFn: ({ format, filters }) => transactionsAPI.export(format, filters),
    onSuccess: (data) => {
      // Now it's async, so show different message
      if (data.data.status === 'pending') {
        toast.success('Export initiated! You will be notified when ready.');
        // Could poll for completion or use WebSocket
      } else {
        toast.success('Export ready! Starting download...');
        if (data.data.downloadUrl && data.data.downloadUrl !== '#') {
          window.open(data.data.downloadUrl, '_blank');
        }
      }
    },
    onError: (error) => {
      toast.error(`Export failed: ${error.message}`);
    },
  });
};
```

---

## 🔍 CATEGORY 8: Auto-Invest APIs

### Current Status: ⚠️ Strategy CRUD Clarification Needed

### Where Used in Frontend:

| Hook File | Function | API Service Call | Backend Endpoint Expected |
|-----------|----------|-----------------|--------------------------|
| `hooks/useAutoInvest.js:14` | `useStrategies()` | `autoInvestAPI.getStrategies()` | `GET /auto-invest/strategies` ✅ |
| `hooks/useAutoInvest.js:28` | `useBacktestResults()` | `autoInvestAPI.getBacktestResults(id)` | `GET /auto-invest/backtest/:id` ⚠️ |
| `hooks/useAutoInvest.js:44` | `useSIPRecommendations()` | `autoInvestAPI.getSIPRecommendations()` | `GET /auto-invest/sip-recommendations` ❌ |
| `hooks/useAutoInvest.js:59` | `useCreateStrategy()` | `autoInvestAPI.createStrategy()` | `POST /auto-invest/strategies` ⚠️ |
| `hooks/useAutoInvest.js:82` | `useUpdateStrategy()` | `autoInvestAPI.updateStrategy()` | `PUT /auto-invest/strategies/:id` ⚠️ |
| `hooks/useAutoInvest.js:111` | `useDeleteStrategy()` | `autoInvestAPI.deleteStrategy()` | `DELETE /auto-invest/strategies/:id` ⚠️ |

### ❌ Issues Found:

1. **Strategy CRUD** - API contract shows subscribing to predefined strategies, frontend allows creating/updating/deleting custom strategies
2. **Backtest endpoint** - API contract uses `POST /auto-invest/strategies/:id/backtest` (async), frontend uses `GET /auto-invest/backtest/:id`
3. **SIP Recommendations** - Not in API contract

### ✅ Required Fixes:

#### Decision Required:
**Question:** Can users create custom auto-invest strategies, or only subscribe to predefined ones?

**If ONLY Subscribe (API Contract Approach):**

**File:** `src/services/api.js`
**Lines:** 550-580
**Remove or update:**

```javascript
// REMOVE these methods:
// - createStrategy (line 550)
// - updateStrategy (line 564)
// - deleteStrategy (line 574)

// ADD subscribe method instead:
subscribe: async (strategyId, subscriptionData) => {
  if (MOCK_MODE) {
    await simulateDelay(1000);
    return mockResponse({
      success: true,
      message: 'Subscription successful',
      data: { planId: 'plan_' + Date.now() }
    });
  }
  const response = await apiClient.post('/auto-invest/subscribe', {
    strategyId,
    ...subscriptionData
  });
  return response.data;
},

// ADD plans management:
getPlans: async () => {
  if (MOCK_MODE) {
    await simulateDelay(400);
    return mockResponse({ plans: [] });
  }
  const response = await apiClient.get('/auto-invest/plans');
  return response.data;
},

pauseResumePlan: async (planId, action) => {
  if (MOCK_MODE) {
    await simulateDelay(600);
    return mockResponse({ success: true });
  }
  const response = await apiClient.patch(`/auto-invest/plans/${planId}`, { action });
  return response.data;
},

cancelPlan: async (planId, sellHoldings = false) => {
  if (MOCK_MODE) {
    await simulateDelay(800);
    return mockResponse({ success: true });
  }
  const response = await apiClient.delete(`/auto-invest/plans/${planId}`, {
    data: { sellHoldings }
  });
  return response.data;
},
```

**If ALLOW Custom Strategies:**
Add these endpoints to API contract.

---

## 🔍 CATEGORY 9: Settings APIs

### Current Status: ⚠️ 2 Endpoint Overlaps

### Where Used in Frontend:

| Hook File | Function | API Service Call | Backend Endpoint Expected |
|-----------|----------|-----------------|--------------------------|
| `hooks/useSettings.js:16` | `useProfile()` | `settingsAPI.getProfile()` | `GET /settings/profile` ✅ |
| `hooks/useSettings.js:28` | `useUpdateProfile()` | `settingsAPI.updateProfile()` | `PUT /settings/profile` ✅ |
| `hooks/useSettings.js:48` | `usePreferences()` | `settingsAPI.getPreferences()` | `GET /settings/preferences` ❌ |
| `hooks/useSettings.js:60` | `useUpdatePreferences()` | `settingsAPI.updatePreferences()` | `PUT /settings/preferences` ❌ |
| `hooks/useSettings.js:80` | `useConnectedAccounts()` | `settingsAPI.getConnectedAccounts()` | `GET /settings/accounts` ⚠️ |
| `hooks/useSettings.js:94` | `useNotificationSettings()` | `settingsAPI.getNotifications()` | `GET /settings/notifications` ✅ |
| `hooks/useSettings.js:106` | `useUpdateNotificationSettings()` | `settingsAPI.updateNotifications()` | `PUT /settings/notifications` ✅ |

### ❌ Issues Found:

1. **GET/PUT `/settings/preferences`** - API contract includes preferences in `/settings/profile` response
2. **GET `/settings/accounts`** - Duplicate of `/portfolio/platforms`

### ✅ Required Fixes:

#### Fix 1: Update preferences to use profile
**File:** `src/hooks/useSettings.js`
**Lines:** 44-71
**Change:**

```javascript
// Make preferences extract from profile
export const usePreferences = () => {
  const profileQuery = useProfile();

  return {
    data: profileQuery.data?.preferences,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    refetch: profileQuery.refetch,
  };
};

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates) => {
      // Update entire profile with new preferences
      const response = await settingsAPI.updateProfile({
        preferences: updates
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'profile'] });
      toast.success('Preferences updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update preferences: ' + error.message);
    },
  });
};
```

**File:** `src/services/api.js`
**Lines:** 629-646
**Remove or make alias:**

```javascript
// Option 1: Remove completely
// DELETE getPreferences() and updatePreferences()

// Option 2: Make alias (better for backward compatibility)
getPreferences: async () => {
  const response = await this.getProfile();
  return { data: response.data.preferences };
},

updatePreferences: async (updates) => {
  return await this.updateProfile({ preferences: updates });
},
```

#### Fix 2: Connected accounts - use portfolio platforms
**File:** `src/hooks/useSettings.js`
**Lines:** 76-85
**Change:**

```javascript
// Import from portfolio hook instead
import { useConnectedPlatforms } from './usePortfolio';

// Then alias it
export const useConnectedAccounts = useConnectedPlatforms;
```

**File:** `src/services/api.js`
**Lines:** 649-656
**Remove:**

```javascript
// DELETE getConnectedAccounts()
// This duplicates portfolioAPI.getPlatforms()
```

---

## 🔍 CATEGORY 10: Goals APIs

### Current Status: ❌ COMPLETELY MISSING

### Where Used in Frontend:
**NOWHERE!** Goals API is not implemented in frontend at all.

### ❌ Issues Found:

1. **No Goals API in `src/services/api.js`**
2. **No Goals hooks in `src/hooks/`**
3. **Goals page exists but uses mock data directly**

### ✅ Required Fixes:

#### Fix: Add complete Goals API

**File:** `src/services/api.js`
**Location:** After line 676 (after settingsAPI, before export)
**Add:**

```javascript
// ===================================
// Goals API (NEW - MISSING IN FRONTEND)
// ===================================
export const goalsAPI = {
  // Get all goals
  getAll: async (filters = {}) => {
    if (MOCK_MODE) {
      await simulateDelay(400);
      return mockResponse({ goals: [], summary: {} });
    }
    const response = await apiClient.get('/goals', { params: filters });
    return response.data;
  },

  // Get goal by ID
  getById: async (id) => {
    if (MOCK_MODE) {
      await simulateDelay(300);
      return mockResponse({ id, name: 'Retirement Fund', progress: 25 });
    }
    const response = await apiClient.get(`/goals/${id}`);
    return response.data;
  },

  // Create goal
  create: async (goalData) => {
    if (MOCK_MODE) {
      await simulateDelay(1000);
      return mockResponse({
        success: true,
        message: 'Goal created successfully',
        data: { id: 'goal_' + Date.now(), ...goalData }
      });
    }
    const response = await apiClient.post('/goals', goalData);
    return response.data;
  },

  // Update goal
  update: async (id, updates) => {
    if (MOCK_MODE) {
      await simulateDelay(800);
      return mockResponse({ success: true, message: 'Goal updated successfully' });
    }
    const response = await apiClient.put(`/goals/${id}`, updates);
    return response.data;
  },

  // Delete goal
  delete: async (id) => {
    if (MOCK_MODE) {
      await simulateDelay(600);
      return mockResponse({ success: true, message: 'Goal deleted successfully' });
    }
    const response = await apiClient.delete(`/goals/${id}`);
    return response.data;
  },

  // Add contribution to goal
  addContribution: async (id, contributionData) => {
    if (MOCK_MODE) {
      await simulateDelay(800);
      return mockResponse({
        success: true,
        message: 'Contribution added successfully',
        data: { goalId: id, newCurrentAmount: 100000, progress: 30 }
      });
    }
    const response = await apiClient.post(`/goals/${id}/contributions`, contributionData);
    return response.data;
  },
};
```

**Update export at bottom:**
```javascript
// Line 682-692
export default {
  portfolio: portfolioAPI,
  investments: investmentsAPI,
  market: marketDataAPI,
  ai: aiAPI,
  trading: tradingAPI,
  transactions: transactionsAPI,
  autoInvest: autoInvestAPI,
  settings: settingsAPI,
  goals: goalsAPI,  // ADD THIS
  auth: authAPI,     // ADD THIS (from category 1)
};
```

**Create new hook file:**
**File:** `src/hooks/useGoals.js` (NEW FILE)

```javascript
// ===================================
// useGoals Hook (NEW)
// ===================================
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsAPI } from '../services/api';
import toast from 'react-hot-toast';

// Get all goals
export const useGoals = (filters = {}) => {
  return useQuery({
    queryKey: ['goals', filters],
    queryFn: async () => {
      const response = await goalsAPI.getAll(filters);
      return response.data;
    },
    staleTime: 300000, // 5 minutes
  });
};

// Get single goal
export const useGoal = (id) => {
  return useQuery({
    queryKey: ['goal', id],
    queryFn: async () => {
      const response = await goalsAPI.getById(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 300000,
  });
};

// Create goal
export const useCreateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goalData) => goalsAPI.create(goalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Goal created successfully! 🎯');
    },
    onError: (error) => {
      toast.error('Failed to create goal: ' + error.message);
    },
  });
};

// Update goal
export const useUpdateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }) => goalsAPI.update(id, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['goal', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Goal updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update goal: ' + error.message);
    },
  });
};

// Delete goal
export const useDeleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => goalsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Goal deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete goal: ' + error.message);
    },
  });
};

// Add contribution
export const useAddContribution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ goalId, amount, date, note }) =>
      goalsAPI.addContribution(goalId, { amount, date, note }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['goal', variables.goalId] });
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Contribution added! 💰');
    },
    onError: (error) => {
      toast.error('Failed to add contribution: ' + error.message);
    },
  });
};
```

---

## 📊 Summary of All Required Changes

### Files to Modify:

1. **`src/services/api.js`** - 15 changes
   - Add authAPI (new section)
   - Add goalsAPI (new section)
   - Update portfolioAPI.connectPlatform() path
   - Update investmentsAPI category methods (3 methods)
   - Update aiAPI.getMarketSentiment() path
   - Update tradingAPI methods (4 methods)
   - Update transactionsAPI.export() to POST
   - Update autoInvestAPI (if subscribe-only model)
   - Remove/update settingsAPI overlaps (2 methods)
   - Update token key in interceptor

2. **`src/contexts/AuthContext.jsx`** - 1 major change
   - Integrate authAPI for all auth methods

3. **`src/hooks/usePortfolio.js`** - 1 change
   - Update useAssetAllocation to extract from summary

4. **`src/hooks/useInvestments.js`** - No changes (API service handles it)

5. **`src/hooks/useAI.js`** - 2 changes
   - Update useAIRecommendations to extract from insights
   - Update useRiskAnalysis to extract from insights

6. **`src/hooks/useTrading.js`** - 4 changes
   - Rename useExecuteTrade → usePlaceOrder
   - Rename useTradeHistory → useOrderHistory
   - Rename usePendingOrders → useOpenPositions
   - Update query keys

7. **`src/hooks/useSettings.js`** - 2 changes
   - Update usePreferences to use profile
   - Update useConnectedAccounts to alias portfolio platforms

8. **`src/hooks/useGoals.js`** - NEW FILE
   - Create complete Goals hooks

9. **`Spark-Investment-Frontend/docs/API_SPECIFICATION.md`** - Optional
   - Add missing endpoints OR accept frontend changes

---

## ✅ Quick Action Checklist

- [ ] Add authAPI to api.js
- [ ] Add goalsAPI to api.js
- [ ] Fix token key in api.js interceptor
- [ ] Update AuthContext to use authAPI
- [ ] Update portfolio connect path
- [ ] Update investments category endpoints to use query params
- [ ] Update AI market sentiment path
- [ ] Update AI hooks to extract from insights
- [ ] Rename and update all trading endpoints
- [ ] Update transactions export to POST
- [ ] Update settings hooks to avoid duplicates
- [ ] Create useGoals.js hook file
- [ ] Test all changes with MOCK_MODE=true
- [ ] Update API contract documentation

---

**Total Changes Required:** ~30 modifications across 9 files
**New Files:** 1 (useGoals.js)
**Estimated Time:** 4-6 hours

