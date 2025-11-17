# Frontend API Contract
**Quick Reference Guide for Frontend Integration**

**Version:** 1.0
**Base URL:** `http://localhost:5000/api` (Development)
**Base URL:** `https://api.sparkinvestment.com/v1` (Production)
**Authentication:** JWT Bearer Token (except signup/login)

---

## Authentication Endpoints

### 1. User Signup
**Endpoint:** `POST /auth/signup`
**Authentication:** None
**Description:** Register a new user account

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "phone": "9876543210",
  "acceptedTerms": true
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "John Doe",
      "kycStatus": "incomplete",
      "createdAt": "2024-11-17T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "VAL_002",
    "message": "Invalid email format",
    "field": "email",
    "timestamp": "2024-11-17T10:30:00.000Z"
  }
}
```

**Error Response (409 Conflict):**
```json
{
  "success": false,
  "error": {
    "code": "DUP_001",
    "message": "Email already exists",
    "field": "email",
    "timestamp": "2024-11-17T10:30:00.000Z"
  }
}
```

---

### 2. User Login
**Endpoint:** `POST /auth/login`
**Authentication:** None
**Description:** Authenticate user and get access token

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "rememberMe": false
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "9876543210",
      "kycStatus": "verified",
      "preferences": {
        "theme": "light",
        "language": "en",
        "currency": "INR"
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_001",
    "message": "Invalid credentials",
    "timestamp": "2024-11-17T10:30:00.000Z"
  }
}
```

**Error Response (403 Forbidden - Account Locked):**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_004",
    "message": "Account locked due to multiple failed login attempts. Please try again after 30 minutes.",
    "timestamp": "2024-11-17T10:30:00.000Z"
  }
}
```

---

### 3. Logout
**Endpoint:** `POST /auth/logout`
**Authentication:** Required
**Headers:** `Authorization: Bearer <token>`

**Request:** (No body required)

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 4. Refresh Token
**Endpoint:** `POST /auth/refresh`
**Authentication:** Refresh Token
**Headers:** `Authorization: Bearer <refreshToken>`

**Request:** (No body required)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Portfolio Endpoints

### 5. Get Portfolio Summary
**Endpoint:** `GET /portfolio/summary`
**Authentication:** Required
**Headers:** `Authorization: Bearer <token>`
**Description:** Fetch user's complete portfolio overview

**Request:** (No body required)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalInvested": 500000.00,
    "currentValue": 625000.00,
    "totalReturns": 125000.00,
    "returnsPercentage": 25.00,
    "dayChange": 5000.00,
    "dayChangePercentage": 0.80,
    "assetAllocation": {
      "equity": 60.00,
      "debt": 25.00,
      "gold": 10.00,
      "crypto": 5.00
    },
    "platformBreakdown": [
      {
        "platform": "Zerodha",
        "invested": 300000.00,
        "currentValue": 375000.00,
        "returns": 75000.00,
        "returnsPercentage": 25.00
      },
      {
        "platform": "Groww",
        "invested": 200000.00,
        "currentValue": 250000.00,
        "returns": 50000.00,
        "returnsPercentage": 25.00
      }
    ],
    "lastUpdated": "2024-11-17T10:30:00.000Z"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_002",
    "message": "Token expired",
    "timestamp": "2024-11-17T10:30:00.000Z"
  }
}
```

---

### 6. Get Portfolio Performance
**Endpoint:** `GET /portfolio/performance?period=1M&interval=day`
**Authentication:** Required
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:**
- `period` (optional): `1W`, `1M`, `3M`, `6M`, `1Y`, `3Y`, `5Y`, `All` (default: `1M`)
- `interval` (optional): `day`, `week`, `month` (default: `day`)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "period": "1M",
    "data": [
      {
        "date": "2024-10-17",
        "invested": 500000.00,
        "currentValue": 510000.00,
        "returns": 10000.00
      },
      {
        "date": "2024-10-18",
        "invested": 500000.00,
        "currentValue": 515000.00,
        "returns": 15000.00
      },
      {
        "date": "2024-11-17",
        "invested": 500000.00,
        "currentValue": 625000.00,
        "returns": 125000.00
      }
    ],
    "cagr": 28.50,
    "sharpeRatio": 1.85,
    "maxDrawdown": -8.50,
    "volatility": 15.20
  }
}
```

---

## Investment Endpoints

### 7. Get All Investments
**Endpoint:** `GET /investments?page=1&limit=50&type=stock&status=active`
**Authentication:** Required
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:**
- `platform` (optional): Filter by platform
- `type` (optional): `stock`, `mutual_fund`, `etf`, `crypto`
- `status` (optional): `active`, `sold`
- `sort` (optional): `returns`, `value`, `date`
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50, max: 100)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "investments": [
      {
        "id": "inv_550e8400-e29b-41d4-a716",
        "name": "Reliance Industries Ltd.",
        "symbol": "RELIANCE",
        "type": "stock",
        "platform": "Zerodha",
        "quantity": 50,
        "avgBuyPrice": 2500.00,
        "currentPrice": 2750.00,
        "invested": 125000.00,
        "currentValue": 137500.00,
        "returns": 12500.00,
        "returnsPercentage": 10.00,
        "dayChange": 250.00,
        "dayChangePercentage": 0.18,
        "sector": "Energy",
        "purchaseDate": "2024-01-15",
        "lastUpdated": "2024-11-17T10:30:00.000Z"
      },
      {
        "id": "inv_661f9511-f3ac-52e5-b827",
        "name": "Tata Consultancy Services",
        "symbol": "TCS",
        "type": "stock",
        "platform": "Groww",
        "quantity": 30,
        "avgBuyPrice": 3200.00,
        "currentPrice": 3600.00,
        "invested": 96000.00,
        "currentValue": 108000.00,
        "returns": 12000.00,
        "returnsPercentage": 12.50,
        "dayChange": -180.00,
        "dayChangePercentage": -0.50,
        "sector": "IT",
        "purchaseDate": "2024-02-20",
        "lastUpdated": "2024-11-17T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 50,
      "totalPages": 1
    },
    "summary": {
      "totalInvestments": 25,
      "totalInvested": 500000.00,
      "totalCurrentValue": 625000.00,
      "totalReturns": 125000.00
    }
  }
}
```

---

### 8. Add Manual Investment
**Endpoint:** `POST /investments`
**Authentication:** Required
**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "name": "HDFC Bank Ltd.",
  "symbol": "HDFCBANK",
  "type": "stock",
  "platform": "Zerodha",
  "quantity": 100,
  "buyPrice": 1650.00,
  "purchaseDate": "2024-11-01",
  "isin": "INE040A01034",
  "sector": "Banking"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Investment added successfully",
  "data": {
    "id": "inv_772g0622-g4bd-63f6-c938",
    "name": "HDFC Bank Ltd.",
    "symbol": "HDFCBANK",
    "type": "stock",
    "platform": "Zerodha",
    "quantity": 100,
    "avgBuyPrice": 1650.00,
    "currentPrice": 1680.00,
    "invested": 165000.00,
    "currentValue": 168000.00,
    "returns": 3000.00,
    "returnsPercentage": 1.82,
    "sector": "Banking",
    "purchaseDate": "2024-11-01",
    "lastUpdated": "2024-11-17T10:30:00.000Z"
  }
}
```

---

## Market Data Endpoints

### 9. Get Market Indices
**Endpoint:** `GET /market/indices`
**Authentication:** Required
**Headers:** `Authorization: Bearer <token>`

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "indices": [
      {
        "name": "NIFTY 50",
        "value": 19500.50,
        "change": 125.30,
        "changePercentage": 0.65,
        "high": 19550.00,
        "low": 19400.00,
        "open": 19420.00,
        "close": 19375.20,
        "lastUpdated": "2024-11-17T10:30:00.000Z"
      },
      {
        "name": "SENSEX",
        "value": 65200.75,
        "change": 420.50,
        "changePercentage": 0.65,
        "high": 65300.00,
        "low": 65000.00,
        "open": 65100.00,
        "close": 64780.25,
        "lastUpdated": "2024-11-17T10:30:00.000Z"
      }
    ]
  }
}
```

---

## AI Analysis Endpoints

### 10. Get Portfolio AI Insights
**Endpoint:** `GET /ai/insights`
**Authentication:** Required
**Headers:** `Authorization: Bearer <token>`

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "portfolioHealth": {
      "score": 85,
      "grade": "A",
      "description": "Your portfolio is well-diversified with strong growth potential"
    },
    "diversificationScore": 82,
    "riskScore": 65,
    "riskLevel": "moderate",
    "volatility": 15.20,
    "topHoldings": [
      {
        "symbol": "RELIANCE",
        "percentage": 15.50
      },
      {
        "symbol": "TCS",
        "percentage": 12.30
      }
    ],
    "sectorExposure": {
      "IT": 25.50,
      "Banking": 20.00,
      "Energy": 18.50,
      "Healthcare": 12.00,
      "Others": 24.00
    },
    "recommendations": {
      "rebalancing": "Consider reducing IT sector exposure by 5%",
      "riskAdjustment": "Portfolio risk is aligned with your moderate risk profile",
      "opportunities": [
        "Add exposure to pharmaceutical sector",
        "Consider increasing debt allocation for stability"
      ]
    },
    "generatedAt": "2024-11-17T10:30:00.000Z"
  }
}
```

---

## Goals Endpoints

### 11. Get All Goals
**Endpoint:** `GET /goals?status=active`
**Authentication:** Required
**Headers:** `Authorization: Bearer <token>`

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "goals": [
      {
        "id": "goal_883h1733-h5ce-74g7-d049",
        "name": "Retirement Fund",
        "category": "retirement",
        "targetAmount": 10000000.00,
        "currentAmount": 2500000.00,
        "targetDate": "2045-12-31",
        "startDate": "2024-01-01",
        "monthlyContribution": 25000.00,
        "priority": "critical",
        "status": "active",
        "description": "Build retirement corpus for peaceful retirement",
        "progress": 25.00,
        "remainingAmount": 7500000.00,
        "monthsRemaining": 252,
        "requiredSIP": 25000.00,
        "projectedAmount": 10500000.00,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-11-17T10:30:00.000Z"
      }
    ],
    "summary": {
      "totalGoals": 5,
      "activeGoals": 4,
      "achievedGoals": 1,
      "totalTargetAmount": 15000000.00,
      "totalCurrentAmount": 3500000.00,
      "totalMonthlyContribution": 40000.00,
      "overallProgress": 23.33
    }
  }
}
```

---

## Trading Endpoints

### 12. Place Order
**Endpoint:** `POST /trading/orders`
**Authentication:** Required
**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "symbol": "INFY",
  "type": "limit",
  "side": "buy",
  "quantity": 10,
  "price": 1450.00,
  "platform": "Zerodha",
  "validity": "day"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "orderId": "order_994i2844-i6df-85h8-e15a",
    "status": "placed",
    "symbol": "INFY",
    "type": "limit",
    "side": "buy",
    "quantity": 10,
    "price": 1450.00,
    "estimatedCost": 14500.00,
    "timestamp": "2024-11-17T10:30:00.000Z"
  }
}
```

---

## Common HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| `200` | OK | Successful GET/PUT/PATCH |
| `201` | Created | Successful POST |
| `400` | Bad Request | Invalid request |
| `401` | Unauthorized | Missing/invalid token |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource not found |
| `422` | Validation Error | Invalid input data |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Server Error | Internal error |

---

## Frontend Integration Guide

### Setting Up Axios Instance

```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          headers: { Authorization: `Bearer ${refreshToken}` }
        });

        localStorage.setItem('accessToken', response.data.data.token);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${response.data.data.token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

### Example API Calls

```javascript
// Login
const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  localStorage.setItem('accessToken', response.data.token);
  localStorage.setItem('refreshToken', response.data.refreshToken);
  return response.data.user;
};

// Get Portfolio
const getPortfolio = async () => {
  const response = await apiClient.get('/portfolio/summary');
  return response.data;
};

// Add Investment
const addInvestment = async (investmentData) => {
  const response = await apiClient.post('/investments', investmentData);
  return response.data;
};
```

---

**End of Frontend API Contract**
