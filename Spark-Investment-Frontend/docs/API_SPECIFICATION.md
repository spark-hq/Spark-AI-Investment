# API Specification - Spark Investment Backend
## Complete REST API Documentation for Frontend Integration

**Version:** 1.0
**Last Updated:** November 2024
**Base URL:** `https://api.sparkinvestment.com/v1` or `http://localhost:5000/api`
**Protocol:** HTTPS (TLS 1.2+)
**Authentication:** JWT Bearer Token

---

## Table of Contents
1. [Authentication APIs](#1-authentication-apis)
2. [Portfolio APIs](#2-portfolio-apis)
3. [Investment APIs](#3-investment-apis)
4. [Market Data APIs](#4-market-data-apis)
5. [AI Analysis APIs](#5-ai-analysis-apis)
6. [Trading APIs](#6-trading-apis)
7. [Transaction APIs](#7-transaction-apis)
8. [Goals APIs](#8-goals-apis)
9. [Auto-Invest APIs](#9-auto-invest-apis)
10. [Settings APIs](#10-settings-apis)
11. [Platform Integration APIs](#11-platform-integration-apis)
12. [Error Codes](#12-error-codes)

---

## 1. Authentication APIs

### 1.1 User Registration (Signup)
**Endpoint:** `POST /auth/signup`
**Authentication:** None
**Rate Limit:** 5 requests per hour per IP

**Request Body:**
```json
{
  "email": "string (email format, required)",
  "password": "string (min 8 chars, required)",
  "name": "string (required)",
  "phone": "string (10 digits, optional)",
  "dob": "string (YYYY-MM-DD, optional)",
  "acceptedTerms": "boolean (required, must be true)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "string",
      "name": "string",
      "kycStatus": "incomplete|pending|verified",
      "createdAt": "ISO 8601 timestamp"
    },
    "token": "JWT token",
    "refreshToken": "JWT refresh token"
  }
}
```

**Validation Rules:**
- Email must be unique
- Password: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
- Phone: optional, 10 digits (Indian format)
- DOB: optional, user must be 18+ years old

---

### 1.2 User Login
**Endpoint:** `POST /auth/login`
**Authentication:** None
**Rate Limit:** 10 requests per hour per IP

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)",
  "rememberMe": "boolean (optional, default: false)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "string",
      "name": "string",
      "phone": "string",
      "kycStatus": "string",
      "preferences": {
        "theme": "light|dark",
        "language": "en|hi|mr|ta|te|bn",
        "currency": "INR"
      }
    },
    "token": "JWT token (expires in 24h if rememberMe=false, 30d if true)",
    "refreshToken": "JWT refresh token"
  }
}
```

**Security:**
- Failed login attempts tracked
- Account locked after 5 failed attempts (unlock after 30 min)
- Log all login attempts with IP, device, location

---

### 1.3 Forgot Password (OTP Request)
**Endpoint:** `POST /auth/forgot-password`
**Authentication:** None
**Rate Limit:** 3 requests per hour per email

**Request Body:**
```json
{
  "email": "string (required)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "OTP sent to registered email and phone",
  "data": {
    "otpSentTo": "em***@example.com",
    "expiresIn": 600
  }
}
```

**Security:**
- Send 6-digit OTP to email and SMS
- OTP valid for 10 minutes
- Max 3 OTP requests per hour

---

### 1.4 Verify OTP & Reset Password
**Endpoint:** `POST /auth/reset-password`
**Authentication:** None
**Rate Limit:** 5 requests per hour

**Request Body:**
```json
{
  "email": "string (required)",
  "otp": "string (6 digits, required)",
  "newPassword": "string (required)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

### 1.5 Refresh Token
**Endpoint:** `POST /auth/refresh`
**Authentication:** Refresh Token in header
**Rate Limit:** 100 requests per hour

**Request Header:**
```
Authorization: Bearer <refreshToken>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "new JWT token",
    "refreshToken": "new refresh token"
  }
}
```

---

### 1.6 Logout
**Endpoint:** `POST /auth/logout`
**Authentication:** Required
**Rate Limit:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Action:** Invalidate token, remove from whitelist

---

## 2. Portfolio APIs

### 2.1 Get Portfolio Summary
**Endpoint:** `GET /portfolio/summary`
**Authentication:** Required
**Cache:** 5 minutes

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalInvested": "number (INR)",
    "currentValue": "number (INR)",
    "totalReturns": "number (INR)",
    "returnsPercentage": "number (%)",
    "dayChange": "number (INR)",
    "dayChangePercentage": "number (%)",
    "assetAllocation": {
      "equity": "number (%)",
      "debt": "number (%)",
      "gold": "number (%)",
      "crypto": "number (%)"
    },
    "platformBreakdown": [
      {
        "platform": "Zerodha|Groww|Upstox|Binance",
        "invested": "number",
        "currentValue": "number",
        "returns": "number",
        "returnsPercentage": "number"
      }
    ],
    "lastUpdated": "ISO 8601 timestamp"
  }
}
```

---

### 2.2 Get Portfolio Performance
**Endpoint:** `GET /portfolio/performance`
**Authentication:** Required
**Query Parameters:**
- `period`: string (1W|1M|3M|6M|1Y|3Y|5Y|All) - default: 1M
- `interval`: string (day|week|month) - default: day

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "period": "string",
    "data": [
      {
        "date": "YYYY-MM-DD",
        "invested": "number",
        "currentValue": "number",
        "returns": "number"
      }
    ],
    "cagr": "number (%)",
    "sharpeRatio": "number",
    "maxDrawdown": "number (%)",
    "volatility": "number (%)"
  }
}
```

---

### 2.3 Get Connected Platforms
**Endpoint:** `GET /portfolio/platforms`
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "platforms": [
      {
        "id": "uuid",
        "name": "Zerodha|Groww|Upstox|Binance",
        "status": "connected|disconnected|syncing|error",
        "lastSynced": "ISO 8601 timestamp",
        "holdings": "number",
        "value": "number",
        "apiKeyId": "string (masked)"
      }
    ]
  }
}
```

---

### 2.4 Sync Platform Data
**Endpoint:** `POST /portfolio/platforms/:platformId/sync`
**Authentication:** Required
**Rate Limit:** 10 requests per hour per platform

**Response (202 Accepted):**
```json
{
  "success": true,
  "message": "Sync initiated",
  "data": {
    "syncId": "uuid",
    "status": "pending|in_progress",
    "estimatedTime": "number (seconds)"
  }
}
```

**Webhook:** Send POST to `/webhooks/sync-complete` when done

---

## 3. Investment APIs

### 3.1 Get All Investments
**Endpoint:** `GET /investments`
**Authentication:** Required
**Query Parameters:**
- `platform`: string (optional, filter by platform)
- `type`: string (optional, stock|mutual_fund|etf|crypto)
- `status`: string (optional, active|sold)
- `sort`: string (optional, returns|value|date)
- `page`: number (default: 1)
- `limit`: number (default: 50, max: 100)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "investments": [
      {
        "id": "uuid",
        "name": "string",
        "symbol": "string",
        "type": "stock|mutual_fund|etf|crypto",
        "platform": "string",
        "quantity": "number",
        "avgBuyPrice": "number",
        "currentPrice": "number",
        "invested": "number",
        "currentValue": "number",
        "returns": "number",
        "returnsPercentage": "number",
        "dayChange": "number",
        "dayChangePercentage": "number",
        "sector": "string",
        "purchaseDate": "YYYY-MM-DD",
        "lastUpdated": "ISO 8601 timestamp"
      }
    ],
    "pagination": {
      "total": "number",
      "page": "number",
      "limit": "number",
      "totalPages": "number"
    },
    "summary": {
      "totalInvestments": "number",
      "totalInvested": "number",
      "totalCurrentValue": "number",
      "totalReturns": "number"
    }
  }
}
```

---

### 3.2 Get Investment Details
**Endpoint:** `GET /investments/:investmentId`
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "string",
    "symbol": "string",
    "type": "string",
    "isin": "string",
    "platform": "string",
    "quantity": "number",
    "avgBuyPrice": "number",
    "currentPrice": "number",
    "invested": "number",
    "currentValue": "number",
    "returns": "number",
    "returnsPercentage": "number",
    "purchaseDate": "YYYY-MM-DD",
    "holdings": [
      {
        "date": "YYYY-MM-DD",
        "quantity": "number",
        "price": "number",
        "type": "buy|sell"
      }
    ],
    "performance": [
      {
        "date": "YYYY-MM-DD",
        "price": "number",
        "value": "number"
      }
    ],
    "fundamentals": {
      "marketCap": "number",
      "pe": "number",
      "pb": "number",
      "dividend": "number",
      "eps": "number"
    }
  }
}
```

---

### 3.3 Add Manual Investment
**Endpoint:** `POST /investments`
**Authentication:** Required
**Rate Limit:** 20 requests per hour

**Request Body:**
```json
{
  "name": "string (required)",
  "symbol": "string (required)",
  "type": "stock|mutual_fund|etf|crypto (required)",
  "platform": "string (required)",
  "quantity": "number (required, > 0)",
  "buyPrice": "number (required, > 0)",
  "purchaseDate": "YYYY-MM-DD (required)",
  "isin": "string (optional)",
  "sector": "string (optional)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Investment added successfully",
  "data": {
    "id": "uuid",
    "...": "investment object"
  }
}
```

---

### 3.4 Update Investment
**Endpoint:** `PUT /investments/:investmentId`
**Authentication:** Required

**Request Body:** (all fields optional)
```json
{
  "quantity": "number",
  "avgBuyPrice": "number",
  "platform": "string"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Investment updated successfully",
  "data": {
    "...": "updated investment object"
  }
}
```

---

### 3.5 Delete Investment
**Endpoint:** `DELETE /investments/:investmentId`
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Investment deleted successfully"
}
```

**Security:** Soft delete, keep historical data

---

## 4. Market Data APIs

### 4.1 Get Market Indices
**Endpoint:** `GET /market/indices`
**Authentication:** Required
**Cache:** 1 minute
**Rate Limit:** 60 requests per minute

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "indices": [
      {
        "name": "NIFTY 50|SENSEX|NIFTY BANK",
        "value": "number",
        "change": "number",
        "changePercentage": "number",
        "high": "number",
        "low": "number",
        "open": "number",
        "close": "number",
        "lastUpdated": "ISO 8601 timestamp"
      }
    ]
  }
}
```

---

### 4.2 Get Top Gainers
**Endpoint:** `GET /market/gainers`
**Authentication:** Required
**Cache:** 5 minutes
**Query Parameters:**
- `limit`: number (default: 10, max: 50)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "gainers": [
      {
        "symbol": "string",
        "name": "string",
        "price": "number",
        "change": "number",
        "changePercentage": "number",
        "volume": "number",
        "sector": "string"
      }
    ]
  }
}
```

---

### 4.3 Get Top Losers
**Endpoint:** `GET /market/losers`
**Authentication:** Required
**Cache:** 5 minutes
**Query Parameters:**
- `limit`: number (default: 10, max: 50)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "losers": [
      {
        "symbol": "string",
        "name": "string",
        "price": "number",
        "change": "number",
        "changePercentage": "number",
        "volume": "number",
        "sector": "string"
      }
    ]
  }
}
```

---

### 4.4 Get Live Quote
**Endpoint:** `GET /market/quote/:symbol`
**Authentication:** Required
**Cache:** 30 seconds
**Rate Limit:** 100 requests per minute

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "symbol": "string",
    "name": "string",
    "price": "number",
    "open": "number",
    "high": "number",
    "low": "number",
    "close": "number (previous close)",
    "change": "number",
    "changePercentage": "number",
    "volume": "number",
    "bid": "number",
    "ask": "number",
    "lastTradeTime": "ISO 8601 timestamp"
  }
}
```

---

### 4.5 Get Historical Data
**Endpoint:** `GET /market/history/:symbol`
**Authentication:** Required
**Cache:** 1 hour
**Query Parameters:**
- `period`: string (1D|1W|1M|3M|6M|1Y|3Y|5Y|All)
- `interval`: string (1m|5m|15m|1h|1d|1w|1M)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "symbol": "string",
    "period": "string",
    "interval": "string",
    "data": [
      {
        "timestamp": "ISO 8601",
        "open": "number",
        "high": "number",
        "low": "number",
        "close": "number",
        "volume": "number"
      }
    ]
  }
}
```

---

## 5. AI Analysis APIs

### 5.1 Get AI Insights (Portfolio-wide)
**Endpoint:** `GET /ai/insights`
**Authentication:** Required
**Cache:** 1 hour
**Processing Time:** 5-10 seconds

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "portfolioHealth": {
      "score": "number (0-100)",
      "grade": "A+|A|B|C|D|F",
      "description": "string"
    },
    "diversificationScore": "number (0-100)",
    "riskScore": "number (0-100)",
    "riskLevel": "low|moderate|high|very_high",
    "volatility": "number (%)",
    "topHoldings": [
      {
        "symbol": "string",
        "percentage": "number"
      }
    ],
    "sectorExposure": {
      "IT": "number (%)",
      "Banking": "number (%)",
      "...": "..."
    },
    "recommendations": {
      "rebalancing": "string",
      "riskAdjustment": "string",
      "opportunites": ["string"]
    },
    "generatedAt": "ISO 8601 timestamp"
  }
}
```

---

### 5.2 Get AI Analysis for Specific Investment
**Endpoint:** `GET /ai/analysis/:investmentId`
**Authentication:** Required
**Cache:** 30 minutes

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "investmentId": "uuid",
    "symbol": "string",
    "recommendation": "strong_buy|buy|hold|sell|strong_sell",
    "confidence": "number (0-100)",
    "targetPrice": "number",
    "stopLoss": "number",
    "upside": "number (%)",
    "downside": "number (%)",
    "healthScore": "number (0-100)",
    "valuationScore": "number (0-100)",
    "valuation": "undervalued|fair|overvalued",
    "riskScore": "number (0-100)",
    "riskLevel": "low|moderate|high",
    "technicalIndicators": {
      "rsi": "number",
      "macd": "number",
      "sma50": "number",
      "sma200": "number",
      "bollingerBands": {
        "upper": "number",
        "middle": "number",
        "lower": "number"
      }
    },
    "fundamentals": {
      "pe": "number",
      "pb": "number",
      "debtToEquity": "number",
      "roe": "number",
      "eps": "number",
      "dividend": "number"
    },
    "pros": ["string"],
    "cons": ["string"],
    "explanation": "string (detailed AI reasoning)",
    "sectorAnalysis": {
      "sector": "string",
      "sectorGrowth": "number (%)",
      "marketShare": "number (%)",
      "competitivePosition": "leading|strong|average|weak",
      "insights": "string"
    },
    "predictions": [
      {
        "year": "number",
        "priceTarget": "number",
        "confidence": "number"
      }
    ],
    "benchmarkComparison": {
      "NIFTY 50": {
        "performance": "number (%)",
        "comparison": "outperform|inline|underperform",
        "differential": "number (%)"
      }
    },
    "generatedAt": "ISO 8601 timestamp"
  }
}
```

---

### 5.3 Get Market Sentiment
**Endpoint:** `GET /ai/sentiment`
**Authentication:** Required
**Cache:** 15 minutes

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "overall": "bullish|neutral|bearish",
    "score": "number (-100 to 100)",
    "confidence": "number (0-100)",
    "factors": {
      "technical": "bullish|neutral|bearish",
      "fundamental": "bullish|neutral|bearish",
      "news": "bullish|neutral|bearish"
    },
    "newsAnalysis": [
      {
        "headline": "string",
        "sentiment": "positive|neutral|negative",
        "impact": "high|medium|low",
        "source": "string",
        "publishedAt": "ISO 8601"
      }
    ],
    "updatedAt": "ISO 8601 timestamp"
  }
}
```

---

### 5.4 Generate AI Report (Async)
**Endpoint:** `POST /ai/generate-report`
**Authentication:** Required
**Rate Limit:** 5 requests per hour

**Request Body:**
```json
{
  "type": "portfolio|investment",
  "investmentId": "uuid (required if type=investment)",
  "format": "pdf|json"
}
```

**Response (202 Accepted):**
```json
{
  "success": true,
  "message": "Report generation initiated",
  "data": {
    "reportId": "uuid",
    "status": "pending",
    "estimatedTime": "number (seconds)"
  }
}
```

**Check Status:** `GET /ai/reports/:reportId/status`

---

## 6. Trading APIs

### 6.1 Place Order
**Endpoint:** `POST /trading/orders`
**Authentication:** Required
**Rate Limit:** 100 requests per day
**Security:** 2FA required, trading limits enforced

**Request Body:**
```json
{
  "symbol": "string (required)",
  "type": "market|limit (required)",
  "side": "buy|sell (required)",
  "quantity": "number (required, > 0)",
  "price": "number (required if type=limit)",
  "platform": "string (required)",
  "stopLoss": "number (optional)",
  "targetPrice": "number (optional)",
  "validity": "day|ioc|gtc (default: day)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "orderId": "uuid",
    "status": "pending|placed|executed|rejected",
    "symbol": "string",
    "type": "string",
    "side": "string",
    "quantity": "number",
    "price": "number",
    "estimatedCost": "number",
    "timestamp": "ISO 8601"
  }
}
```

**Validation:**
- Check account balance
- Enforce daily trading limits
- Verify market hours
- 2FA verification

---

### 6.2 Get Order Status
**Endpoint:** `GET /trading/orders/:orderId`
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "status": "pending|placed|partially_filled|executed|cancelled|rejected",
    "symbol": "string",
    "type": "market|limit",
    "side": "buy|sell",
    "quantity": "number",
    "filledQuantity": "number",
    "price": "number",
    "avgExecutionPrice": "number",
    "totalCost": "number",
    "fees": "number",
    "platform": "string",
    "createdAt": "ISO 8601",
    "updatedAt": "ISO 8601",
    "executedAt": "ISO 8601 (if executed)"
  }
}
```

---

### 6.3 Get Order History
**Endpoint:** `GET /trading/orders`
**Authentication:** Required
**Query Parameters:**
- `status`: string (optional, filter by status)
- `from`: date (YYYY-MM-DD)
- `to`: date (YYYY-MM-DD)
- `page`: number
- `limit`: number

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "...": "order object"
      }
    ],
    "pagination": {
      "total": "number",
      "page": "number",
      "limit": "number"
    }
  }
}
```

---

### 6.4 Cancel Order
**Endpoint:** `DELETE /trading/orders/:orderId`
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

---

### 6.5 Get Open Positions
**Endpoint:** `GET /trading/positions`
**Authentication:** Required
**Cache:** 1 minute

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "positions": [
      {
        "symbol": "string",
        "quantity": "number",
        "avgEntryPrice": "number",
        "currentPrice": "number",
        "pnl": "number",
        "pnlPercentage": "number",
        "dayPnl": "number",
        "platform": "string",
        "entryDate": "YYYY-MM-DD"
      }
    ],
    "summary": {
      "totalPositions": "number",
      "totalPnl": "number",
      "dayPnl": "number"
    }
  }
}
```

---

## 7. Transaction APIs

### 7.1 Get All Transactions
**Endpoint:** `GET /transactions`
**Authentication:** Required
**Query Parameters:**
- `type`: string (buy|sell|sip|dividend|bonus|split)
- `platform`: string
- `from`: date (YYYY-MM-DD)
- `to`: date (YYYY-MM-DD)
- `minAmount`: number
- `maxAmount`: number
- `status`: string (completed|pending|failed)
- `search`: string (search by asset name)
- `sort`: string (date|amount) - default: date desc
- `page`: number
- `limit`: number

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "type": "buy|sell|sip|dividend|bonus|split",
        "assetName": "string",
        "symbol": "string",
        "platform": "string",
        "quantity": "number",
        "price": "number",
        "amount": "number",
        "fees": "number",
        "tax": "number",
        "netAmount": "number",
        "status": "completed|pending|failed",
        "transactionId": "string (platform txn id)",
        "paymentMethod": "string",
        "date": "YYYY-MM-DD",
        "timestamp": "ISO 8601"
      }
    ],
    "pagination": {
      "total": "number",
      "page": "number",
      "limit": "number"
    },
    "summary": {
      "totalTransactions": "number",
      "totalBuy": "number",
      "totalSell": "number",
      "totalDividend": "number",
      "netCashFlow": "number"
    }
  }
}
```

---

### 7.2 Get Transaction Details
**Endpoint:** `GET /transactions/:transactionId`
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "...": "transaction object with full details",
    "metadata": {
      "ipAddress": "string",
      "device": "string",
      "location": "string"
    },
    "receipt": {
      "downloadUrl": "string (signed URL)"
    }
  }
}
```

---

### 7.3 Export Transactions (CSV/PDF)
**Endpoint:** `POST /transactions/export`
**Authentication:** Required
**Rate Limit:** 10 requests per hour

**Request Body:**
```json
{
  "format": "csv|pdf (required)",
  "from": "YYYY-MM-DD (required)",
  "to": "YYYY-MM-DD (required)",
  "filters": {
    "type": "string (optional)",
    "platform": "string (optional)"
  }
}
```

**Response (202 Accepted):**
```json
{
  "success": true,
  "message": "Export initiated",
  "data": {
    "exportId": "uuid",
    "status": "pending",
    "estimatedTime": "number (seconds)"
  }
}
```

**Download:** `GET /transactions/export/:exportId/download`

---

## 8. Goals APIs

### 8.1 Get All Goals
**Endpoint:** `GET /goals`
**Authentication:** Required
**Query Parameters:**
- `status`: string (active|achieved|paused)
- `category`: string (retirement|house|education|wedding|emergency|custom)
- `sort`: string (priority|date|progress|amount)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "goals": [
      {
        "id": "uuid",
        "name": "string",
        "category": "retirement|house|education|wedding|emergency|custom",
        "targetAmount": "number",
        "currentAmount": "number",
        "targetDate": "YYYY-MM-DD",
        "startDate": "YYYY-MM-DD",
        "monthlyContribution": "number",
        "priority": "critical|high|medium|low",
        "status": "active|achieved|paused",
        "description": "string",
        "riskProfile": "low|moderate|high",
        "expectedReturns": "number (%)",
        "investmentMix": {
          "equity": "number (%)",
          "debt": "number (%)",
          "gold": "number (%)"
        },
        "linkedInvestments": ["uuid"],
        "progress": "number (%)",
        "remainingAmount": "number",
        "monthsRemaining": "number",
        "requiredSIP": "number",
        "projectedAmount": "number",
        "achievedDate": "YYYY-MM-DD (if achieved)",
        "createdAt": "ISO 8601",
        "updatedAt": "ISO 8601"
      }
    ],
    "summary": {
      "totalGoals": "number",
      "activeGoals": "number",
      "achievedGoals": "number",
      "totalTargetAmount": "number",
      "totalCurrentAmount": "number",
      "totalMonthlyContribution": "number",
      "overallProgress": "number (%)"
    }
  }
}
```

---

### 8.2 Get Goal Details
**Endpoint:** `GET /goals/:goalId`
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "...": "goal object with full details",
    "progressHistory": [
      {
        "date": "YYYY-MM-DD",
        "amount": "number"
      }
    ],
    "contributions": [
      {
        "date": "YYYY-MM-DD",
        "amount": "number",
        "source": "manual|auto|investment_returns"
      }
    ],
    "projections": {
      "bestCase": "number",
      "expected": "number",
      "worstCase": "number",
      "probability": "number (%)"
    }
  }
}
```

---

### 8.3 Create Goal
**Endpoint:** `POST /goals`
**Authentication:** Required
**Rate Limit:** 20 requests per hour

**Request Body:**
```json
{
  "name": "string (required)",
  "category": "string (required)",
  "targetAmount": "number (required, > 0)",
  "currentAmount": "number (default: 0)",
  "targetDate": "YYYY-MM-DD (required, future date)",
  "monthlyContribution": "number (required, >= 0)",
  "priority": "critical|high|medium|low (default: medium)",
  "description": "string (required)",
  "expectedReturns": "number (default: 12)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Goal created successfully",
  "data": {
    "id": "uuid",
    "...": "goal object"
  }
}
```

---

### 8.4 Update Goal
**Endpoint:** `PUT /goals/:goalId`
**Authentication:** Required

**Request Body:** (all fields optional)
```json
{
  "name": "string",
  "targetAmount": "number",
  "currentAmount": "number",
  "targetDate": "YYYY-MM-DD",
  "monthlyContribution": "number",
  "priority": "string",
  "status": "active|paused",
  "description": "string"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Goal updated successfully",
  "data": {
    "...": "updated goal object"
  }
}
```

---

### 8.5 Delete Goal
**Endpoint:** `DELETE /goals/:goalId`
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Goal deleted successfully"
}
```

**Security:** Soft delete, archive data

---

### 8.6 Add Manual Contribution
**Endpoint:** `POST /goals/:goalId/contributions`
**Authentication:** Required

**Request Body:**
```json
{
  "amount": "number (required, > 0)",
  "date": "YYYY-MM-DD (optional, default: today)",
  "note": "string (optional)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Contribution added successfully",
  "data": {
    "goalId": "uuid",
    "newCurrentAmount": "number",
    "progress": "number (%)"
  }
}
```

---

## 9. Auto-Invest APIs

### 9.1 Get All Strategies
**Endpoint:** `GET /auto-invest/strategies`
**Authentication:** Required
**Cache:** 1 hour

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "strategies": [
      {
        "id": "uuid",
        "name": "Aggressive Growth|Balanced Wealth Builder|Conservative Income|Crypto Maximalist",
        "description": "string",
        "riskLevel": "very_high|high|medium|low",
        "expectedReturns": "number (%)",
        "minInvestment": "number",
        "allocation": {
          "stocks": "number (%)",
          "mutual_funds": "number (%)",
          "etfs": "number (%)",
          "crypto": "number (%)",
          "debt": "number (%)"
        },
        "aiConfidence": "number (%)",
        "popularity": "number (user count)",
        "backtestResults": {
          "period": "5 years",
          "totalReturn": "number (%)",
          "cagr": "number (%)",
          "sharpeRatio": "number",
          "maxDrawdown": "number (%)",
          "volatility": "number (%)",
          "winRate": "number (%)"
        }
      }
    ]
  }
}
```

---

### 9.2 Get Strategy Details
**Endpoint:** `GET /auto-invest/strategies/:strategyId`
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "...": "strategy object",
    "holdings": [
      {
        "symbol": "string",
        "name": "string",
        "weight": "number (%)",
        "type": "stock|mutual_fund|etf|crypto"
      }
    ],
    "historicalPerformance": [
      {
        "date": "YYYY-MM-DD",
        "value": "number",
        "returns": "number (%)"
      }
    ],
    "rebalancingRules": {
      "frequency": "monthly|quarterly|yearly",
      "threshold": "number (%)"
    }
  }
}
```

---

### 9.3 Backtest Strategy
**Endpoint:** `POST /auto-invest/strategies/:strategyId/backtest`
**Authentication:** Required
**Rate Limit:** 5 requests per hour

**Request Body:**
```json
{
  "initialCapital": "number (required)",
  "period": "1Y|3Y|5Y|10Y (required)",
  "monthlyContribution": "number (optional)"
}
```

**Response (202 Accepted):**
```json
{
  "success": true,
  "message": "Backtest initiated",
  "data": {
    "backtestId": "uuid",
    "status": "pending"
  }
}
```

**Result:** `GET /auto-invest/backtests/:backtestId`

---

### 9.4 Get Active Plans
**Endpoint:** `GET /auto-invest/plans`
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "uuid",
        "strategyId": "uuid",
        "strategyName": "string",
        "status": "active|paused|cancelled",
        "monthlyInvestment": "number",
        "invested": "number",
        "currentValue": "number",
        "returns": "number",
        "returnsPercentage": "number (%)",
        "startDate": "YYYY-MM-DD",
        "nextExecution": "YYYY-MM-DD",
        "executionDay": "number (1-28)",
        "autoRebalance": "boolean",
        "linkedGoalId": "uuid (optional)"
      }
    ]
  }
}
```

---

### 9.5 Subscribe to Strategy
**Endpoint:** `POST /auto-invest/subscribe`
**Authentication:** Required
**Rate Limit:** 10 requests per day

**Request Body:**
```json
{
  "strategyId": "uuid (required)",
  "monthlyInvestment": "number (required, >= minInvestment)",
  "executionDay": "number (1-28, default: 1)",
  "autoRebalance": "boolean (default: true)",
  "linkedGoalId": "uuid (optional)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Subscription successful",
  "data": {
    "planId": "uuid",
    "nextExecution": "YYYY-MM-DD",
    "...": "plan object"
  }
}
```

---

### 9.6 Pause/Resume Plan
**Endpoint:** `PATCH /auto-invest/plans/:planId`
**Authentication:** Required

**Request Body:**
```json
{
  "action": "pause|resume (required)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Plan status updated",
  "data": {
    "status": "active|paused"
  }
}
```

---

### 9.7 Cancel Plan
**Endpoint:** `DELETE /auto-invest/plans/:planId`
**Authentication:** Required

**Request Body:**
```json
{
  "sellHoldings": "boolean (default: false)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Plan cancelled successfully"
}
```

---

## 10. Settings APIs

### 10.1 Get User Profile
**Endpoint:** `GET /settings/profile`
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "string",
      "email": "string",
      "phone": "string",
      "dob": "YYYY-MM-DD",
      "address": {
        "line1": "string",
        "line2": "string",
        "city": "string",
        "state": "string",
        "pincode": "string",
        "country": "India"
      },
      "kycStatus": "incomplete|pending|verified|rejected",
      "panCard": "string (masked)",
      "annualIncome": "string (bracket)",
      "riskProfile": "conservative|moderate|aggressive",
      "investmentGoals": ["retirement", "wealth_creation"],
      "createdAt": "ISO 8601",
      "emailVerified": "boolean",
      "phoneVerified": "boolean"
    }
  }
}
```

---

### 10.2 Update Profile
**Endpoint:** `PUT /settings/profile`
**Authentication:** Required

**Request Body:** (all fields optional)
```json
{
  "name": "string",
  "phone": "string",
  "dob": "YYYY-MM-DD",
  "address": {
    "line1": "string",
    "line2": "string",
    "city": "string",
    "state": "string",
    "pincode": "string"
  },
  "annualIncome": "string",
  "riskProfile": "conservative|moderate|aggressive",
  "investmentGoals": ["string"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "...": "updated user object"
    }
  }
}
```

---

### 10.3 Get Notification Settings
**Endpoint:** `GET /settings/notifications`
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "email": {
      "marketAlerts": "boolean",
      "priceAlerts": "boolean",
      "portfolioUpdates": "boolean",
      "transactionConfirmations": "boolean",
      "monthlyReports": "boolean",
      "aiRecommendations": "boolean",
      "newsDigest": "boolean"
    },
    "sms": {
      "transactionAlerts": "boolean",
      "securityAlerts": "boolean",
      "loginAlerts": "boolean",
      "paymentReminders": "boolean"
    },
    "push": {
      "marketMovements": "boolean",
      "goalMilestones": "boolean",
      "autoInvestExecutions": "boolean",
      "portfolioChanges": "boolean",
      "dailySummary": "boolean"
    },
    "frequency": {
      "priceAlerts": "instant|hourly|daily",
      "portfolioUpdates": "daily|weekly|monthly"
    }
  }
}
```

---

### 10.4 Update Notification Settings
**Endpoint:** `PUT /settings/notifications`
**Authentication:** Required

**Request Body:**
```json
{
  "email": {
    "marketAlerts": "boolean",
    "...": "..."
  },
  "sms": {
    "...": "..."
  },
  "push": {
    "...": "..."
  },
  "frequency": {
    "...": "..."
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Notification settings updated"
}
```

---

### 10.5 Get Security Settings
**Endpoint:** `GET /settings/security`
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "twoFactorAuth": {
      "enabled": "boolean",
      "method": "sms|email|authenticator_app"
    },
    "biometric": {
      "enabled": "boolean",
      "type": "fingerprint|face_id"
    },
    "sessionTimeout": "number (minutes)",
    "trustedDevices": [
      {
        "id": "uuid",
        "name": "string",
        "deviceType": "mobile|desktop|tablet",
        "browser": "string",
        "os": "string",
        "lastUsed": "ISO 8601",
        "isCurrent": "boolean"
      }
    ],
    "loginHistory": [
      {
        "timestamp": "ISO 8601",
        "ipAddress": "string",
        "location": "string",
        "device": "string",
        "status": "success|blocked|failed"
      }
    ],
    "loginAlerts": "boolean"
  }
}
```

---

### 10.6 Enable 2FA
**Endpoint:** `POST /settings/security/2fa/enable`
**Authentication:** Required

**Request Body:**
```json
{
  "method": "sms|email|authenticator_app (required)",
  "phone": "string (required if method=sms)",
  "email": "string (required if method=email)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "2FA enabled successfully",
  "data": {
    "qrCode": "string (base64 if method=authenticator_app)",
    "backupCodes": ["string"] // 10 backup codes
  }
}
```

---

### 10.7 Remove Trusted Device
**Endpoint:** `DELETE /settings/security/devices/:deviceId`
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Device removed successfully"
}
```

---

## 11. Platform Integration APIs

### 11.1 Connect Platform
**Endpoint:** `POST /platforms/connect`
**Authentication:** Required
**Rate Limit:** 5 requests per hour

**Request Body:**
```json
{
  "platform": "zerodha|groww|upstox|binance (required)",
  "apiKey": "string (required)",
  "apiSecret": "string (required)",
  "additionalAuth": "object (platform-specific)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Platform connected successfully",
  "data": {
    "platformId": "uuid",
    "platform": "string",
    "status": "connected",
    "connectedAt": "ISO 8601"
  }
}
```

**Security:**
- Encrypt API keys at rest (AES-256)
- Never log or expose API secrets
- Validate API credentials before storing

---

### 11.2 Disconnect Platform
**Endpoint:** `DELETE /platforms/:platformId`
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Platform disconnected successfully"
}
```

**Action:**
- Revoke API access
- Delete stored credentials
- Keep historical data (soft delete)

---

### 11.3 Sync Platform Holdings
**Endpoint:** `POST /platforms/:platformId/sync`
**Authentication:** Required
**Rate Limit:** 10 requests per hour per platform

**Response (202 Accepted):**
```json
{
  "success": true,
  "message": "Sync initiated",
  "data": {
    "syncId": "uuid",
    "estimatedTime": "number (seconds)"
  }
}
```

**Process:**
1. Fetch holdings from platform API
2. Reconcile with existing data
3. Update prices and values
4. Calculate returns
5. Notify user on completion

---

## 12. Error Codes

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "string (error code)",
    "message": "string (user-friendly message)",
    "details": "string (technical details, optional)",
    "field": "string (field name if validation error)",
    "timestamp": "ISO 8601"
  }
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET/PUT/PATCH request |
| 201 | Created | Successful POST request |
| 202 | Accepted | Async operation initiated |
| 204 | No Content | Successful DELETE request |
| 400 | Bad Request | Invalid request body/parameters |
| 401 | Unauthorized | Missing or invalid auth token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists (duplicate) |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |
| 502 | Bad Gateway | External API error |
| 503 | Service Unavailable | Maintenance mode |

### Application Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `AUTH_001` | 401 | Invalid credentials |
| `AUTH_002` | 401 | Token expired |
| `AUTH_003` | 401 | Token invalid |
| `AUTH_004` | 403 | Account locked (failed login attempts) |
| `AUTH_005` | 403 | Email not verified |
| `AUTH_006` | 403 | 2FA required |
| `AUTH_007` | 400 | Invalid OTP |
| `AUTH_008` | 400 | OTP expired |
| `VAL_001` | 422 | Missing required field |
| `VAL_002` | 422 | Invalid email format |
| `VAL_003` | 422 | Password too weak |
| `VAL_004` | 422 | Invalid date format |
| `VAL_005` | 422 | Amount must be positive |
| `VAL_006` | 422 | Quantity must be positive |
| `RES_001` | 404 | User not found |
| `RES_002` | 404 | Investment not found |
| `RES_003` | 404 | Goal not found |
| `RES_004` | 404 | Order not found |
| `DUP_001` | 409 | Email already exists |
| `DUP_002` | 409 | Investment already exists |
| `LIMIT_001` | 403 | Daily trading limit exceeded |
| `LIMIT_002` | 403 | Insufficient balance |
| `LIMIT_003` | 429 | Rate limit exceeded |
| `MARKET_001` | 400 | Market closed |
| `MARKET_002` | 400 | Symbol not found |
| `PLATFORM_001` | 502 | Platform API error |
| `PLATFORM_002` | 502 | Platform API timeout |
| `AI_001` | 503 | AI service unavailable |
| `AI_002` | 500 | AI analysis failed |
| `SYS_001` | 500 | Database error |
| `SYS_002` | 500 | Internal server error |

---

## Security Best Practices

### 1. Authentication
- Use JWT with RS256 algorithm
- Access token expires in 24h (or as per rememberMe)
- Refresh token expires in 30 days
- Rotate refresh tokens on each use
- Whitelist valid tokens in Redis
- Blacklist tokens on logout

### 2. Authorization
- Implement role-based access control (RBAC)
- Verify user owns requested resources
- Check permissions before every operation

### 3. Rate Limiting
- Implement sliding window rate limiting
- Different limits for auth vs. regular APIs
- Return `Retry-After` header with 429 responses

### 4. Data Protection
- Encrypt sensitive data at rest (PAN, API keys)
- Use HTTPS/TLS for all communications
- Never log sensitive data (passwords, API keys)
- Mask sensitive data in responses

### 5. Input Validation
- Validate all inputs on server-side
- Sanitize inputs to prevent SQL injection
- Use parameterized queries
- Validate file uploads

### 6. API Security
- Require authentication for all protected endpoints
- Implement CORS with whitelist
- Add request signing for critical operations
- Use CSRF tokens for state-changing operations

### 7. Audit Logging
- Log all authentication attempts
- Log all trading operations
- Log all data modifications
- Store logs securely with retention policy

---

## API Integration Checklist

### Frontend Requirements
- [x] Environment configuration (`.env`)
- [x] API base URL configuration
- [x] JWT token management (access + refresh)
- [x] Axios interceptors for auth headers
- [x] Error handling for all HTTP codes
- [x] Loading states for async operations
- [x] Toast notifications for user feedback
- [x] WebSocket connection for real-time updates

### Backend Requirements
- [ ] RESTful API with all endpoints
- [ ] JWT authentication middleware
- [ ] Rate limiting middleware
- [ ] Input validation middleware
- [ ] Error handling middleware
- [ ] CORS configuration
- [ ] Database models and migrations
- [ ] External API integrations (Zerodha, Groww, etc.)
- [ ] WebSocket server
- [ ] Background job processing (sync, backtest)
- [ ] Email service (OTP, notifications)
- [ ] SMS service (OTP, alerts)
- [ ] File storage (receipts, reports)
- [ ] Caching layer (Redis)
- [ ] Logging and monitoring

---

**End of API Specification**

---

For questions or clarifications, refer to:
- Database Schema: `DATABASE_SCHEMA.md`
- Security Guidelines: `SECURITY_GUIDE.md`
- AI/ML Requirements: `AI_ML_REQUIREMENTS.md`
- WebSocket Events: `WEBSOCKET_EVENTS.md`
