# Backend API Alignment Report
**Date:** 2024-11-17
**Status:** Backend Not Implemented - Planning Required

---

## Executive Summary

### Current Status
- ✅ **Frontend:** Fully implemented with mock data support
- ✅ **API Contract:** Comprehensive documentation exists
- ❌ **Backend:** NOT IMPLEMENTED (empty folder with only `.gitkeep`)

### Critical Finding
**The backend folder is completely empty.** No API endpoints have been implemented yet. All frontend API calls are currently running in MOCK_MODE.

---

## Frontend API Endpoints Analysis

Based on `/Spark-Investment-Frontend/src/services/api.js`, the frontend expects the following API endpoints:

### 1. Authentication APIs ❌ NOT IMPLEMENTED

**Frontend Implementation:** Mock implementation in `AuthContext.jsx`

| Method | Endpoint | Frontend Status | Backend Status | Priority |
|--------|----------|----------------|----------------|----------|
| POST | `/auth/signup` | Mock | ❌ Missing | HIGH |
| POST | `/auth/login` | Mock | ❌ Missing | HIGH |
| POST | `/auth/logout` | Mock | ❌ Missing | HIGH |
| POST | `/auth/refresh` | Mock | ❌ Missing | HIGH |
| POST | `/auth/forgot-password` | Mock | ❌ Missing | MEDIUM |
| POST | `/auth/reset-password` | Mock | ❌ Missing | MEDIUM |

**Misalignment Issues:**
- Frontend stores tokens in localStorage with keys: `spark_access_token`, `spark_refresh_token`, `spark_user`
- API contract expects JWT with Bearer token in Authorization header
- No OTP verification endpoints implemented in frontend API service (only in AuthContext)

**Backend Requirements:**
```javascript
// Required endpoints to implement:
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

---

### 2. Portfolio APIs ❌ NOT IMPLEMENTED

| Method | Endpoint | Frontend Expects | API Contract | Backend Status | Priority |
|--------|----------|-----------------|--------------|----------------|----------|
| GET | `/portfolio/summary` | ✅ | ✅ | ❌ Missing | HIGH |
| GET | `/portfolio/platforms` | ✅ | ✅ | ❌ Missing | HIGH |
| GET | `/portfolio/performance` | ✅ | ✅ | ❌ Missing | HIGH |
| GET | `/portfolio/allocation` | ✅ | ⚠️ Missing | ❌ Missing | MEDIUM |
| GET | `/portfolio/top-performers` | ✅ | ⚠️ Missing | ❌ Missing | MEDIUM |
| GET | `/portfolio/activity` | ✅ | ⚠️ Missing | ❌ Missing | MEDIUM |
| POST | `/portfolio/connect` | ✅ | ⚠️ Different | ❌ Missing | HIGH |
| DELETE | `/portfolio/platforms/:id` | ✅ | ✅ | ❌ Missing | MEDIUM |

**Misalignment Issues:**

1. **GET `/portfolio/allocation`**
   - Frontend expects this endpoint
   - API contract documents it within `/portfolio/summary` response
   - **Backend Fix:** Either implement as separate endpoint OR update frontend to use summary data

2. **GET `/portfolio/top-performers`**
   - Frontend expects this endpoint
   - API contract does NOT document this
   - **Backend Fix:** Implement new endpoint OR remove from frontend

3. **GET `/portfolio/activity`**
   - Frontend expects this endpoint with `?limit=` query param
   - API contract does NOT document this
   - **Backend Fix:** Implement new endpoint for recent activity

4. **POST `/portfolio/connect`**
   - Frontend uses: `POST /portfolio/connect` with body: `{ platform, credentials }`
   - API contract uses: `POST /platforms/connect` with body: `{ platform, apiKey, apiSecret }`
   - **Backend Fix:** Decide on single endpoint path (recommend `/platforms/connect`)

**Backend Requirements:**
```javascript
// Must implement:
GET  /api/portfolio/summary
GET  /api/portfolio/platforms
GET  /api/portfolio/performance?period={period}&interval={interval}

// Should implement (frontend expects):
GET  /api/portfolio/allocation
GET  /api/portfolio/top-performers
GET  /api/portfolio/activity?limit={limit}

// Alignment needed:
POST /api/portfolio/connect (frontend)
  OR
POST /api/platforms/connect (API contract)
```

---

### 3. Investments APIs ❌ NOT IMPLEMENTED

| Method | Endpoint | Frontend Expects | API Contract | Backend Status | Alignment |
|--------|----------|-----------------|--------------|----------------|-----------|
| GET | `/investments` | ✅ | ✅ | ❌ Missing | ✅ Aligned |
| GET | `/investments/:id` | ✅ | ✅ | ❌ Missing | ✅ Aligned |
| GET | `/investments/mutual-funds` | ✅ | ⚠️ Missing | ❌ Missing | ⚠️ Misaligned |
| GET | `/investments/stocks` | ✅ | ⚠️ Missing | ❌ Missing | ⚠️ Misaligned |
| GET | `/investments/crypto` | ✅ | ⚠️ Missing | ❌ Missing | ⚠️ Misaligned |
| POST | `/investments` | ✅ | ✅ | ❌ Missing | ✅ Aligned |
| PUT | `/investments/:id` | ✅ | ✅ | ❌ Missing | ✅ Aligned |
| DELETE | `/investments/:id` | ✅ | ✅ | ❌ Missing | ✅ Aligned |

**Misalignment Issues:**

1. **Category-Specific Endpoints**
   - Frontend expects: `/investments/mutual-funds`, `/investments/stocks`, `/investments/crypto`
   - API contract uses: `/investments?type=mutual_fund` (query parameter approach)
   - **Backend Fix:** Implement separate endpoints OR update frontend to use query params

**Backend Requirements:**
```javascript
// Core endpoints (aligned):
GET    /api/investments?platform={}&type={}&status={}&page={}&limit={}
GET    /api/investments/:id
POST   /api/investments
PUT    /api/investments/:id
DELETE /api/investments/:id

// Frontend expects (choose one approach):
// Option 1: Separate endpoints
GET /api/investments/mutual-funds
GET /api/investments/stocks
GET /api/investments/crypto

// Option 2: Update frontend to use:
GET /api/investments?type=mutual_fund
GET /api/investments?type=stock
GET /api/investments?type=crypto
```

---

### 4. Market Data APIs ❌ NOT IMPLEMENTED

| Method | Endpoint | Frontend Expects | API Contract | Backend Status | Alignment |
|--------|----------|-----------------|--------------|----------------|-----------|
| GET | `/market/indices` | ✅ | ✅ | ❌ Missing | ✅ Aligned |
| GET | `/market/gainers` | ✅ | ✅ | ❌ Missing | ✅ Aligned |
| GET | `/market/losers` | ✅ | ✅ | ❌ Missing | ✅ Aligned |
| GET | `/market/sectors` | ✅ | ⚠️ Different | ❌ Missing | ⚠️ Misaligned |
| GET | `/market/quote/:symbol` | ✅ | ✅ | ❌ Missing | ✅ Aligned |
| GET | `/market/crypto` | ✅ | ⚠️ Missing | ❌ Missing | ⚠️ Misaligned |
| GET | `/market/forex` | ✅ | ⚠️ Missing | ❌ Missing | ⚠️ Misaligned |

**Misalignment Issues:**

1. **GET `/market/sectors`**
   - Frontend expects: `/market/sectors`
   - API contract does NOT document this endpoint
   - **Backend Fix:** Implement new endpoint for sector performance

2. **GET `/market/crypto`**
   - Frontend expects this for crypto market overview
   - API contract does NOT document this
   - **Backend Fix:** Implement crypto market data endpoint

3. **GET `/market/forex`**
   - Frontend expects this for forex rates
   - API contract does NOT document this
   - **Backend Fix:** Implement forex rates endpoint

**Backend Requirements:**
```javascript
// Aligned endpoints:
GET /api/market/indices
GET /api/market/gainers?limit={}
GET /api/market/losers?limit={}
GET /api/market/quote/:symbol
GET /api/market/history/:symbol?period={}&interval={}

// Frontend expects (not in API contract):
GET /api/market/sectors
GET /api/market/crypto
GET /api/market/forex
```

---

### 5. AI Analysis APIs ❌ NOT IMPLEMENTED

| Method | Endpoint | Frontend Expects | API Contract | Backend Status | Alignment |
|--------|----------|-----------------|--------------|----------------|-----------|
| GET | `/ai/insights` | ✅ | ✅ | ❌ Missing | ✅ Aligned |
| GET | `/ai/recommendations` | ✅ | ⚠️ Missing | ❌ Missing | ⚠️ Misaligned |
| GET | `/ai/risk-analysis` | ✅ | ⚠️ Missing | ❌ Missing | ⚠️ Misaligned |
| GET | `/ai/market-sentiment` | ✅ | ⚠️ Different | ❌ Missing | ⚠️ Misaligned |
| POST | `/ai/chat` | ✅ | ⚠️ Missing | ❌ Missing | ⚠️ Misaligned |
| GET | `/ai/quick-insights` | ✅ | ⚠️ Missing | ❌ Missing | ⚠️ Misaligned |
| GET | `/ai/investments/:id/analysis` | ✅ | ✅ | ❌ Missing | ✅ Aligned |

**Misalignment Issues:**

1. **GET `/ai/recommendations`**
   - Frontend expects separate recommendations endpoint
   - API contract includes recommendations within `/ai/insights` response
   - **Backend Fix:** Either separate endpoint OR update frontend to extract from insights

2. **GET `/ai/risk-analysis`**
   - Frontend expects separate risk analysis endpoint
   - API contract includes risk data within `/ai/insights` response
   - **Backend Fix:** Either separate endpoint OR update frontend to extract from insights

3. **GET `/ai/market-sentiment`**
   - Frontend expects: `/ai/market-sentiment`
   - API contract documents: `/ai/sentiment`
   - **Backend Fix:** Use `/ai/sentiment` and update frontend

4. **POST `/ai/chat`**
   - Frontend implements AI chat interface
   - API contract does NOT document this endpoint
   - **Backend Fix:** Implement chat endpoint with LLM integration

5. **GET `/ai/quick-insights`**
   - Frontend expects quick insights
   - API contract does NOT document this
   - **Backend Fix:** Implement quick insights endpoint OR remove from frontend

**Backend Requirements:**
```javascript
// Aligned:
GET /api/ai/insights
GET /api/ai/investments/:id/analysis

// API contract has (frontend uses different path):
GET /api/ai/sentiment (frontend expects /ai/market-sentiment)

// Frontend expects (not in API contract):
GET  /api/ai/recommendations
GET  /api/ai/risk-analysis
POST /api/ai/chat
GET  /api/ai/quick-insights
```

---

### 6. Trading APIs ❌ NOT IMPLEMENTED

| Method | Endpoint | Frontend Expects | API Contract | Backend Status | Alignment |
|--------|----------|-----------------|--------------|----------------|-----------|
| POST | `/trading/execute` | ✅ | ⚠️ Different | ❌ Missing | ⚠️ Misaligned |
| GET | `/trading/history` | ✅ | ⚠️ Different | ❌ Missing | ⚠️ Misaligned |
| GET | `/trading/pending` | ✅ | ⚠️ Different | ❌ Missing | ⚠️ Misaligned |
| DELETE | `/trading/orders/:id` | ✅ | ✅ | ❌ Missing | ✅ Aligned |

**Misalignment Issues:**

1. **POST `/trading/execute`**
   - Frontend uses: `POST /trading/execute`
   - API contract uses: `POST /trading/orders`
   - **Backend Fix:** Use `/trading/orders` and update frontend

2. **GET `/trading/history`**
   - Frontend uses: `GET /trading/history?limit={}`
   - API contract uses: `GET /trading/orders?from={}&to={}`
   - **Backend Fix:** Use `/trading/orders` with filters and update frontend

3. **GET `/trading/pending`**
   - Frontend uses: `GET /trading/pending`
   - API contract uses: `GET /trading/positions`
   - **Backend Fix:** Clarify if "pending orders" vs "open positions" - likely different concepts

**Backend Requirements:**
```javascript
// API contract (recommended):
POST   /api/trading/orders
GET    /api/trading/orders (with filters)
GET    /api/trading/orders/:id
DELETE /api/trading/orders/:id
GET    /api/trading/positions

// Frontend expects (update frontend to match API contract):
POST   /api/trading/execute → change to /api/trading/orders
GET    /api/trading/history → change to /api/trading/orders
GET    /api/trading/pending → change to /api/trading/positions
```

---

### 7. Transactions APIs ❌ NOT IMPLEMENTED

| Method | Endpoint | Frontend Expects | API Contract | Backend Status | Alignment |
|--------|----------|-----------------|--------------|----------------|-----------|
| GET | `/transactions` | ✅ | ✅ | ❌ Missing | ✅ Aligned |
| GET | `/transactions/summary` | ✅ | ⚠️ Missing | ❌ Missing | ⚠️ Misaligned |
| GET | `/transactions/export` | ✅ | ⚠️ Different | ❌ Missing | ⚠️ Misaligned |

**Misalignment Issues:**

1. **GET `/transactions/summary`**
   - Frontend expects: `GET /transactions/summary?period={}`
   - API contract does NOT document this endpoint
   - **Backend Fix:** Implement summary endpoint

2. **POST `/transactions/export`**
   - Frontend uses: `GET /transactions/export?format={}`
   - API contract uses: `POST /transactions/export`
   - **Backend Fix:** Use POST method (async) as per API contract, update frontend

**Backend Requirements:**
```javascript
// Aligned:
GET /api/transactions (with filters)
GET /api/transactions/:id

// Frontend expects:
GET /api/transactions/summary?period={}

// API contract (update frontend):
POST /api/transactions/export (async operation)
GET  /api/transactions/export/:exportId/download
```

---

### 8. Auto-Invest APIs ❌ NOT IMPLEMENTED

| Method | Endpoint | Frontend Expects | API Contract | Backend Status | Alignment |
|--------|----------|-----------------|--------------|----------------|-----------|
| GET | `/auto-invest/strategies` | ✅ | ✅ | ❌ Missing | ✅ Aligned |
| POST | `/auto-invest/strategies` | ✅ | ⚠️ Different | ❌ Missing | ⚠️ Misaligned |
| PUT | `/auto-invest/strategies/:id` | ✅ | ⚠️ Different | ❌ Missing | ⚠️ Misaligned |
| DELETE | `/auto-invest/strategies/:id` | ✅ | ⚠️ Different | ❌ Missing | ⚠️ Misaligned |
| GET | `/auto-invest/backtest/:id` | ✅ | ⚠️ Different | ❌ Missing | ⚠️ Misaligned |
| GET | `/auto-invest/sip-recommendations` | ✅ | ⚠️ Missing | ❌ Missing | ⚠️ Misaligned |

**Misalignment Issues:**

1. **Strategy CRUD Operations**
   - Frontend allows creating/updating custom strategies
   - API contract focuses on subscribing to predefined strategies
   - **Backend Fix:** Clarify if users can create custom strategies or only subscribe to predefined ones

2. **GET `/auto-invest/backtest/:id`**
   - Frontend uses: `GET /auto-invest/backtest/:strategyId`
   - API contract uses: `POST /auto-invest/strategies/:id/backtest` (async)
   - **Backend Fix:** Use POST for backtest initiation, GET for results

3. **SIP Recommendations**
   - Frontend expects: `GET /auto-invest/sip-recommendations`
   - API contract does NOT document this
   - **Backend Fix:** Implement SIP recommendations endpoint

**Backend Requirements:**
```javascript
// API contract:
GET    /api/auto-invest/strategies
GET    /api/auto-invest/strategies/:id
POST   /api/auto-invest/strategies/:id/backtest (initiate)
GET    /api/auto-invest/backtests/:id (get results)
GET    /api/auto-invest/plans
POST   /api/auto-invest/subscribe
PATCH  /api/auto-invest/plans/:id
DELETE /api/auto-invest/plans/:id

// Frontend expects (clarify requirements):
POST   /api/auto-invest/strategies (create custom?)
PUT    /api/auto-invest/strategies/:id (update custom?)
DELETE /api/auto-invest/strategies/:id (delete custom?)
GET    /api/auto-invest/sip-recommendations
```

---

### 9. Settings APIs ❌ NOT IMPLEMENTED

| Method | Endpoint | Frontend Expects | API Contract | Backend Status | Alignment |
|--------|----------|-----------------|--------------|----------------|-----------|
| GET | `/settings/profile` | ✅ | ✅ | ❌ Missing | ✅ Aligned |
| PUT | `/settings/profile` | ✅ | ✅ | ❌ Missing | ✅ Aligned |
| GET | `/settings/preferences` | ✅ | ⚠️ Missing | ❌ Missing | ⚠️ Misaligned |
| PUT | `/settings/preferences` | ✅ | ⚠️ Missing | ❌ Missing | ⚠️ Misaligned |
| GET | `/settings/accounts` | ✅ | ⚠️ Missing | ❌ Missing | ⚠️ Misaligned |
| GET | `/settings/notifications` | ✅ | ✅ | ❌ Missing | ✅ Aligned |
| PUT | `/settings/notifications` | ✅ | ✅ | ❌ Missing | ✅ Aligned |

**Misalignment Issues:**

1. **Preferences Endpoints**
   - Frontend expects separate `/settings/preferences` endpoint
   - API contract includes preferences in `/settings/profile` response
   - **Backend Fix:** Either separate endpoint OR update frontend to use profile data

2. **Connected Accounts**
   - Frontend expects: `GET /settings/accounts`
   - API contract uses: `GET /portfolio/platforms`
   - **Backend Fix:** Use single source of truth, update frontend

**Backend Requirements:**
```javascript
// Aligned:
GET /api/settings/profile
PUT /api/settings/profile
GET /api/settings/notifications
PUT /api/settings/notifications
GET /api/settings/security
POST /api/settings/security/2fa/enable
DELETE /api/settings/security/devices/:id

// Frontend expects:
GET /api/settings/preferences
PUT /api/settings/preferences
GET /api/settings/accounts → should use /api/portfolio/platforms
```

---

### 10. Goals APIs ⚠️ NOT IN FRONTEND API SERVICE

**Critical Finding:** Goals APIs are documented in API contract but NOT implemented in frontend API service!

| Method | Endpoint | Frontend | API Contract | Backend Status | Priority |
|--------|----------|----------|--------------|----------------|----------|
| GET | `/goals` | ❌ Missing | ✅ | ❌ Missing | HIGH |
| GET | `/goals/:id` | ❌ Missing | ✅ | ❌ Missing | HIGH |
| POST | `/goals` | ❌ Missing | ✅ | ❌ Missing | HIGH |
| PUT | `/goals/:id` | ❌ Missing | ✅ | ❌ Missing | MEDIUM |
| DELETE | `/goals/:id` | ❌ Missing | ✅ | ❌ Missing | MEDIUM |
| POST | `/goals/:id/contributions` | ❌ Missing | ✅ | ❌ Missing | MEDIUM |

**Frontend Fix Required:**
```javascript
// Add to /src/services/api.js:
export const goalsAPI = {
  getAll: async (filters) => { /* ... */ },
  getById: async (id) => { /* ... */ },
  create: async (goalData) => { /* ... */ },
  update: async (id, updates) => { /* ... */ },
  delete: async (id) => { /* ... */ },
  addContribution: async (id, amount) => { /* ... */ },
};
```

---

## Summary of Misalignments

### High Priority Issues (Must Fix Before Backend Implementation)

1. **Authentication Token Management**
   - Frontend uses: `spark_access_token`, `spark_refresh_token`
   - Need to align token refresh flow between frontend and backend

2. **Portfolio Connect Endpoint**
   - Frontend: `POST /portfolio/connect`
   - API Contract: `POST /platforms/connect`
   - **Decision needed:** Choose one path

3. **Trading Endpoints**
   - Frontend: `/trading/execute`, `/trading/history`, `/trading/pending`
   - API Contract: `/trading/orders`, `/trading/positions`
   - **Decision needed:** Update frontend to match API contract

4. **Goals API Missing in Frontend**
   - API contract has full Goals API
   - Frontend has NO Goals API implementation
   - **Action:** Add Goals API to frontend service

### Medium Priority Issues (Can be addressed during implementation)

5. **Investment Category Endpoints**
   - Frontend: `/investments/mutual-funds`, `/investments/stocks`, `/investments/crypto`
   - API Contract: `/investments?type={type}`
   - **Decision:** Choose between separate endpoints vs query params

6. **AI Endpoints Structure**
   - Multiple endpoints in frontend that are combined in API contract
   - **Decision:** Separate or combined response structure

7. **Market Data Additions**
   - Frontend expects: `/market/sectors`, `/market/crypto`, `/market/forex`
   - Not in API contract
   - **Action:** Add to API contract or remove from frontend

### Low Priority Issues (Nice to have)

8. **Export Endpoints**
   - Frontend uses GET, API contract uses POST (async pattern)
   - **Action:** Update frontend to match async pattern

---

## Backend Implementation Checklist

### Phase 1: Core Authentication & Portfolio (Week 1-2)
- [ ] Setup backend project structure (Node.js/Express or Python/FastAPI)
- [ ] Database setup and migrations
- [ ] JWT authentication middleware
- [ ] POST /auth/signup
- [ ] POST /auth/login
- [ ] POST /auth/refresh
- [ ] POST /auth/logout
- [ ] GET /portfolio/summary
- [ ] GET /portfolio/performance
- [ ] GET /portfolio/platforms

### Phase 2: Investments & Market Data (Week 3-4)
- [ ] GET /investments (with filters)
- [ ] GET /investments/:id
- [ ] POST /investments
- [ ] PUT /investments/:id
- [ ] DELETE /investments/:id
- [ ] GET /market/indices
- [ ] GET /market/gainers
- [ ] GET /market/losers
- [ ] GET /market/quote/:symbol
- [ ] External market data API integration

### Phase 3: AI Analysis (Week 5-6)
- [ ] GET /ai/insights
- [ ] GET /ai/investments/:id/analysis
- [ ] GET /ai/sentiment
- [ ] LLM integration for AI features
- [ ] Implement AI recommendation engine

### Phase 4: Trading & Transactions (Week 7-8)
- [ ] POST /trading/orders
- [ ] GET /trading/orders
- [ ] GET /trading/positions
- [ ] DELETE /trading/orders/:id
- [ ] GET /transactions (with filters)
- [ ] GET /transactions/:id
- [ ] POST /transactions/export

### Phase 5: Goals & Auto-Invest (Week 9-10)
- [ ] Complete Goals API endpoints (all CRUD)
- [ ] Add Goals API to frontend service
- [ ] GET /auto-invest/strategies
- [ ] GET /auto-invest/strategies/:id
- [ ] POST /auto-invest/strategies/:id/backtest
- [ ] GET /auto-invest/plans
- [ ] POST /auto-invest/subscribe
- [ ] PATCH /auto-invest/plans/:id

### Phase 6: Settings & Platform Integration (Week 11-12)
- [ ] GET/PUT /settings/profile
- [ ] GET/PUT /settings/notifications
- [ ] GET /settings/security
- [ ] POST /platforms/connect
- [ ] DELETE /platforms/:id
- [ ] POST /platforms/:id/sync
- [ ] Platform API integrations (Zerodha, Groww, etc.)

---

## Recommended Actions

### Immediate Actions (Before Starting Backend Development)

1. **Decision Meeting Required:**
   - Finalize endpoint paths (especially trading, portfolio connect)
   - Decide on investment category endpoint structure
   - Clarify auto-invest strategy creation permissions
   - Review Goals API requirements and add to frontend

2. **Frontend Updates Needed:**
   ```javascript
   // Update these paths in frontend:
   /trading/execute → /trading/orders
   /trading/history → /trading/orders
   /portfolio/connect → /platforms/connect
   /ai/market-sentiment → /ai/sentiment

   // Add missing Goals API service
   // Add missing endpoints to API contract:
   - /market/sectors
   - /market/crypto
   - /market/forex
   - /ai/chat
   - /ai/quick-insights
   ```

3. **API Contract Updates:**
   - Add missing endpoints that frontend uses
   - Clarify async vs sync operations
   - Document WebSocket events for real-time updates

4. **Backend Project Setup:**
   - Choose tech stack (Node.js/Express, Python/FastAPI, Go)
   - Setup database (PostgreSQL for main data, Redis for caching)
   - Configure CI/CD pipeline
   - Setup development, staging, production environments

---

## Conclusion

**Status:** The backend is completely unimplemented. Approximately **70-80 API endpoints** need to be built based on the API contract and frontend requirements.

**Estimated Development Time:** 10-12 weeks for full implementation (with a team of 2-3 backend developers)

**Next Steps:**
1. Conduct alignment meeting to finalize endpoint paths
2. Update frontend API paths based on decisions
3. Begin Phase 1 implementation (Auth + Portfolio core features)
4. Implement endpoints iteratively in phases
5. Setup automated testing for each endpoint
6. Deploy backend and switch frontend from MOCK_MODE to real API

---

**Document Version:** 1.0
**Last Updated:** 2024-11-17
