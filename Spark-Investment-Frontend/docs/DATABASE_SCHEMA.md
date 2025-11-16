# Database Schema - Spark Investment Platform
## Complete Database Structure & Relationships

**Version:** 1.0
**Last Updated:** November 2024
**Database:** PostgreSQL 15+ (Primary), Redis (Cache), MongoDB (Logs - Optional)
**Total Tables:** 18 core tables

---

## Table of Contents
1. [Database Design Principles](#database-design-principles)
2. [Entity Relationship Diagram](#entity-relationship-diagram)
3. [Table Schemas](#table-schemas)
4. [Indexes](#indexes)
5. [Constraints & Validations](#constraints--validations)
6. [Data Retention Policies](#data-retention-policies)
7. [Backup Strategy](#backup-strategy)

---

## Database Design Principles

### 1. Normalization
- **3rd Normal Form (3NF)** for transactional data
- **Denormalization** for read-heavy analytics tables
- **Separate tables** for historical data

### 2. Security
- **Encryption at rest** for sensitive columns (PAN, API keys)
- **Row-level security** for multi-tenant data isolation
- **Audit triggers** on all write operations
- **Soft deletes** to maintain data integrity

### 3. Performance
- **Proper indexing** on foreign keys and query patterns
- **Partitioning** for large tables (transactions, market_data)
- **Caching layer** (Redis) for hot data
- **Read replicas** for analytics queries

### 4. Scalability
- **UUID primary keys** for distributed systems
- **Sharding strategy** ready (by user_id)
- **Archival process** for old data
- **Connection pooling** support

---

## Entity Relationship Diagram

```
users (1) ─────< (M) investments
  │                     │
  │                     └─── (M) investment_holdings (1) ───< (M) transactions
  │
  ├─── (M) goals
  │         └─── (M) goal_contributions
  │
  ├─── (M) auto_invest_plans
  │         └─── (M) plan_executions
  │
  ├─── (M) trading_orders
  │         └─── (M) order_executions
  │
  ├─── (M) platform_connections
  │         └─── (M) sync_logs
  │
  ├─── (1) user_preferences
  ├─── (1) user_security
  ├─── (M) user_sessions
  ├─── (M) user_notifications
  └─── (M) audit_logs

securities (M) ───< (1) market_data (real-time prices)
  │
  └─── (M) ai_analyses
```

---

## Table Schemas

### 1. users
**Purpose:** Core user account information

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,  -- bcrypt hash
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(15),
  dob DATE,
  pan_card VARCHAR(20) UNIQUE, -- Encrypted
  kyc_status VARCHAR(20) DEFAULT 'incomplete',
  -- incomplete|pending|verified|rejected
  annual_income VARCHAR(50),
  risk_profile VARCHAR(20) DEFAULT 'moderate',
  -- conservative|moderate|aggressive
  investment_goals TEXT[], -- ARRAY type
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'active',
  -- active|suspended|deleted
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL -- Soft delete
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status) WHERE status = 'active';
CREATE INDEX idx_users_kyc_status ON users(kyc_status);
```

---

### 2. user_security
**Purpose:** Security settings and 2FA configuration

```sql
CREATE TABLE user_security (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_method VARCHAR(20), -- sms|email|authenticator_app
  two_factor_secret VARCHAR(255), -- Encrypted (for TOTP)
  backup_codes TEXT[], -- Encrypted array of backup codes
  biometric_enabled BOOLEAN DEFAULT false,
  biometric_type VARCHAR(20), -- fingerprint|face_id
  session_timeout_minutes INT DEFAULT 30,
  login_alerts_enabled BOOLEAN DEFAULT true,
  failed_login_attempts INT DEFAULT 0,
  account_locked_until TIMESTAMP NULL,
  last_password_change TIMESTAMP,
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

CREATE INDEX idx_user_security_user_id ON user_security(user_id);
```

---

### 3. user_sessions
**Purpose:** Track active user sessions for security

```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE, -- Hashed JWT token
  refresh_token_hash VARCHAR(255) UNIQUE,
  device_type VARCHAR(20), -- mobile|desktop|tablet
  device_name VARCHAR(255),
  browser VARCHAR(100),
  os VARCHAR(100),
  ip_address INET,
  location VARCHAR(255), -- City, Country
  is_trusted_device BOOLEAN DEFAULT false,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked BOOLEAN DEFAULT false
);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token_hash ON user_sessions(token_hash);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
```

---

### 4. user_preferences
**Purpose:** User UI/UX preferences and notification settings

```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Display Preferences
  theme VARCHAR(10) DEFAULT 'light', -- light|dark|auto
  language VARCHAR(5) DEFAULT 'en', -- en|hi|mr|ta|te|bn
  currency VARCHAR(3) DEFAULT 'INR',
  timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
  date_format VARCHAR(20) DEFAULT 'DD/MM/YYYY',
  number_format VARCHAR(20) DEFAULT 'indian',
  default_view VARCHAR(50) DEFAULT 'dashboard',
  chart_type VARCHAR(20) DEFAULT 'line',
  data_refresh_interval INT DEFAULT 60, -- seconds
  items_per_page INT DEFAULT 20,

  -- Email Notifications
  email_market_alerts BOOLEAN DEFAULT true,
  email_price_alerts BOOLEAN DEFAULT true,
  email_portfolio_updates BOOLEAN DEFAULT true,
  email_transaction_confirmations BOOLEAN DEFAULT true,
  email_monthly_reports BOOLEAN DEFAULT true,
  email_ai_recommendations BOOLEAN DEFAULT true,
  email_news_digest BOOLEAN DEFAULT false,

  -- SMS Notifications
  sms_transaction_alerts BOOLEAN DEFAULT true,
  sms_security_alerts BOOLEAN DEFAULT true,
  sms_login_alerts BOOLEAN DEFAULT true,
  sms_payment_reminders BOOLEAN DEFAULT false,

  -- Push Notifications
  push_market_movements BOOLEAN DEFAULT true,
  push_goal_milestones BOOLEAN DEFAULT true,
  push_auto_invest_executions BOOLEAN DEFAULT true,
  push_portfolio_changes BOOLEAN DEFAULT true,
  push_daily_summary BOOLEAN DEFAULT false,

  -- Notification Frequency
  price_alert_frequency VARCHAR(20) DEFAULT 'instant',
  portfolio_update_frequency VARCHAR(20) DEFAULT 'daily',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
```

---

### 5. platform_connections
**Purpose:** Store connected trading platform credentials

```sql
CREATE TABLE platform_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- zerodha|groww|upstox|binance
  status VARCHAR(20) DEFAULT 'connected',
  -- connected|disconnected|syncing|error
  api_key VARCHAR(255) NOT NULL, -- Encrypted
  api_secret VARCHAR(255) NOT NULL, -- Encrypted
  additional_auth JSONB, -- Platform-specific auth data
  last_synced TIMESTAMP,
  sync_frequency_minutes INT DEFAULT 60,
  auto_sync_enabled BOOLEAN DEFAULT true,
  holdings_count INT DEFAULT 0,
  total_value DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  disconnected_at TIMESTAMP NULL
);

CREATE INDEX idx_platform_connections_user_id ON platform_connections(user_id);
CREATE INDEX idx_platform_connections_platform ON platform_connections(platform);
CREATE UNIQUE INDEX idx_platform_connections_user_platform
  ON platform_connections(user_id, platform) WHERE status = 'connected';
```

---

### 6. sync_logs
**Purpose:** Track platform data synchronization attempts

```sql
CREATE TABLE sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES platform_connections(id) ON DELETE CASCADE,
  sync_type VARCHAR(50) NOT NULL, -- manual|auto|scheduled
  status VARCHAR(20) NOT NULL, -- pending|in_progress|completed|failed
  holdings_fetched INT DEFAULT 0,
  transactions_fetched INT DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  duration_seconds INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sync_logs_connection_id ON sync_logs(connection_id);
CREATE INDEX idx_sync_logs_status ON sync_logs(status);
CREATE INDEX idx_sync_logs_created_at ON sync_logs(created_at DESC);
```

---

### 7. securities
**Purpose:** Master table for all tradable securities

```sql
CREATE TABLE securities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  isin VARCHAR(20) UNIQUE,
  type VARCHAR(20) NOT NULL, -- stock|mutual_fund|etf|crypto|bond
  exchange VARCHAR(50), -- NSE|BSE|NASDAQ|BINANCE
  sector VARCHAR(100),
  industry VARCHAR(100),
  market_cap DECIMAL(20, 2),
  currency VARCHAR(3) DEFAULT 'INR',
  lot_size INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB, -- Additional platform-specific data
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_securities_symbol ON securities(symbol);
CREATE INDEX idx_securities_type ON securities(type);
CREATE INDEX idx_securities_sector ON securities(sector);
CREATE INDEX idx_securities_is_active ON securities(is_active);
```

---

### 8. market_data
**Purpose:** Real-time and historical price data (partitioned by date)

```sql
CREATE TABLE market_data (
  id UUID DEFAULT gen_random_uuid(),
  security_id UUID NOT NULL REFERENCES securities(id) ON DELETE CASCADE,
  timestamp TIMESTAMP NOT NULL,
  open DECIMAL(15, 4),
  high DECIMAL(15, 4),
  low DECIMAL(15, 4),
  close DECIMAL(15, 4),
  volume BIGINT,
  bid DECIMAL(15, 4),
  ask DECIMAL(15, 4),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (security_id, timestamp)
) PARTITION BY RANGE (timestamp);

-- Create monthly partitions
CREATE TABLE market_data_2024_11 PARTITION OF market_data
  FOR VALUES FROM ('2024-11-01') TO ('2024-12-01');

CREATE INDEX idx_market_data_security_timestamp
  ON market_data(security_id, timestamp DESC);
CREATE INDEX idx_market_data_timestamp ON market_data(timestamp DESC);
```

---

### 9. investments
**Purpose:** User's investment holdings (aggregated view)

```sql
CREATE TABLE investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  security_id UUID NOT NULL REFERENCES securities(id) ON DELETE RESTRICT,
  platform_connection_id UUID REFERENCES platform_connections(id) ON DELETE SET NULL,
  symbol VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL,
  quantity DECIMAL(15, 6) NOT NULL, -- Supports fractional shares
  avg_buy_price DECIMAL(15, 4) NOT NULL,
  invested_amount DECIMAL(15, 2) NOT NULL, -- Total invested
  current_price DECIMAL(15, 4),
  current_value DECIMAL(15, 2),
  returns DECIMAL(15, 2),
  returns_percentage DECIMAL(10, 4),
  day_change DECIMAL(15, 2),
  day_change_percentage DECIMAL(10, 4),
  sector VARCHAR(100),
  purchase_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- active|sold|closed
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_security_id ON investments(security_id);
CREATE INDEX idx_investments_platform_connection_id ON investments(platform_connection_id);
CREATE INDEX idx_investments_type ON investments(type);
CREATE INDEX idx_investments_status ON investments(status);
```

---

### 10. investment_holdings
**Purpose:** Detailed transaction-level holdings (for FIFO/LIFO calculation)

```sql
CREATE TABLE investment_holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investment_id UUID NOT NULL REFERENCES investments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transaction_date DATE NOT NULL,
  quantity DECIMAL(15, 6) NOT NULL,
  price DECIMAL(15, 4) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  type VARCHAR(10) NOT NULL, -- buy|sell
  remaining_quantity DECIMAL(15, 6) NOT NULL, -- For FIFO
  fees DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_investment_holdings_investment_id ON investment_holdings(investment_id);
CREATE INDEX idx_investment_holdings_user_id ON investment_holdings(user_id);
CREATE INDEX idx_investment_holdings_transaction_date ON investment_holdings(transaction_date);
```

---

### 11. transactions
**Purpose:** All financial transactions (buy, sell, dividend, etc.)

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  investment_id UUID REFERENCES investments(id) ON DELETE SET NULL,
  security_id UUID REFERENCES securities(id) ON DELETE SET NULL,
  type VARCHAR(20) NOT NULL,
  -- buy|sell|sip|dividend|bonus|split|interest
  asset_name VARCHAR(255) NOT NULL,
  symbol VARCHAR(50),
  platform VARCHAR(50) NOT NULL,
  quantity DECIMAL(15, 6),
  price DECIMAL(15, 4),
  amount DECIMAL(15, 2) NOT NULL,
  fees DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  gst DECIMAL(10, 2) DEFAULT 0,
  net_amount DECIMAL(15, 2) NOT NULL, -- amount ± fees ± tax
  status VARCHAR(20) NOT NULL DEFAULT 'completed',
  -- completed|pending|failed|cancelled
  transaction_id VARCHAR(255), -- External platform transaction ID
  payment_method VARCHAR(50),
  payment_reference VARCHAR(255),
  description TEXT,
  metadata JSONB, -- Additional platform-specific data
  transaction_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (transaction_date);

-- Create yearly partitions
CREATE TABLE transactions_2024 PARTITION OF transactions
  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_date ON transactions(transaction_date DESC);
CREATE INDEX idx_transactions_platform ON transactions(platform);
```

---

### 12. goals
**Purpose:** User's financial goals

```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  -- retirement|house|education|wedding|emergency|custom
  target_amount DECIMAL(15, 2) NOT NULL,
  current_amount DECIMAL(15, 2) DEFAULT 0,
  target_date DATE NOT NULL,
  start_date DATE NOT NULL,
  monthly_contribution DECIMAL(10, 2) DEFAULT 0,
  priority VARCHAR(20) DEFAULT 'medium',
  -- critical|high|medium|low
  status VARCHAR(20) DEFAULT 'active',
  -- active|achieved|paused|cancelled
  description TEXT,
  risk_profile VARCHAR(20) DEFAULT 'moderate',
  expected_returns DECIMAL(5, 2) DEFAULT 12.00, -- percentage
  investment_mix JSONB, -- {"equity": 60, "debt": 30, "gold": 10}
  linked_investment_ids UUID[],
  achieved_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_goals_category ON goals(category);
CREATE INDEX idx_goals_target_date ON goals(target_date);
```

---

### 13. goal_contributions
**Purpose:** Track manual contributions to goals

```sql
CREATE TABLE goal_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  source VARCHAR(50) DEFAULT 'manual',
  -- manual|auto|investment_returns|dividend
  contribution_date DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_goal_contributions_goal_id ON goal_contributions(goal_id);
CREATE INDEX idx_goal_contributions_user_id ON goal_contributions(user_id);
CREATE INDEX idx_goal_contributions_date ON goal_contributions(contribution_date);
```

---

### 14. auto_invest_strategies
**Purpose:** Pre-defined auto-invest strategies

```sql
CREATE TABLE auto_invest_strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  risk_level VARCHAR(20) NOT NULL, -- very_high|high|medium|low
  expected_returns DECIMAL(5, 2), -- Annual percentage
  min_investment DECIMAL(10, 2) NOT NULL,
  allocation JSONB NOT NULL,
  -- {"stocks": 50, "mutual_funds": 30, "etfs": 20}
  rebalancing_frequency VARCHAR(20) DEFAULT 'quarterly',
  -- monthly|quarterly|yearly
  ai_confidence DECIMAL(5, 2),
  is_active BOOLEAN DEFAULT true,
  popularity_score INT DEFAULT 0, -- User subscription count
  backtesting_data JSONB, -- Historical performance data
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_auto_invest_strategies_risk_level ON auto_invest_strategies(risk_level);
CREATE INDEX idx_auto_invest_strategies_is_active ON auto_invest_strategies(is_active);
```

---

### 15. auto_invest_plans
**Purpose:** User's active auto-invest subscriptions

```sql
CREATE TABLE auto_invest_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  strategy_id UUID NOT NULL REFERENCES auto_invest_strategies(id) ON DELETE RESTRICT,
  status VARCHAR(20) DEFAULT 'active',
  -- active|paused|cancelled|completed
  monthly_investment DECIMAL(10, 2) NOT NULL,
  execution_day INT NOT NULL CHECK (execution_day BETWEEN 1 AND 28),
  auto_rebalance BOOLEAN DEFAULT true,
  invested_amount DECIMAL(15, 2) DEFAULT 0, -- Total invested
  current_value DECIMAL(15, 2) DEFAULT 0,
  returns DECIMAL(15, 2) DEFAULT 0,
  returns_percentage DECIMAL(10, 4) DEFAULT 0,
  linked_goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
  start_date DATE NOT NULL,
  next_execution_date DATE,
  last_execution_date DATE,
  pause_reason TEXT,
  paused_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_auto_invest_plans_user_id ON auto_invest_plans(user_id);
CREATE INDEX idx_auto_invest_plans_strategy_id ON auto_invest_plans(strategy_id);
CREATE INDEX idx_auto_invest_plans_status ON auto_invest_plans(status);
CREATE INDEX idx_auto_invest_plans_next_execution ON auto_invest_plans(next_execution_date);
```

---

### 16. plan_executions
**Purpose:** Log each auto-invest plan execution

```sql
CREATE TABLE plan_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES auto_invest_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  execution_date DATE NOT NULL,
  amount_invested DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  -- completed|failed|partial|pending
  orders_placed INT DEFAULT 0,
  orders_executed INT DEFAULT 0,
  allocation_details JSONB, -- Detailed breakdown
  error_message TEXT,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_plan_executions_plan_id ON plan_executions(plan_id);
CREATE INDEX idx_plan_executions_user_id ON plan_executions(user_id);
CREATE INDEX idx_plan_executions_date ON plan_executions(execution_date DESC);
```

---

### 17. trading_orders
**Purpose:** All trading orders (buy/sell)

```sql
CREATE TABLE trading_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  security_id UUID NOT NULL REFERENCES securities(id) ON DELETE RESTRICT,
  symbol VARCHAR(50) NOT NULL,
  type VARCHAR(20) NOT NULL, -- market|limit|stop_loss|bracket
  side VARCHAR(10) NOT NULL, -- buy|sell
  quantity DECIMAL(15, 6) NOT NULL,
  filled_quantity DECIMAL(15, 6) DEFAULT 0,
  price DECIMAL(15, 4), -- NULL for market orders
  avg_execution_price DECIMAL(15, 4),
  total_cost DECIMAL(15, 2),
  fees DECIMAL(10, 2),
  platform VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  -- pending|placed|partially_filled|executed|cancelled|rejected
  validity VARCHAR(20) DEFAULT 'day', -- day|ioc|gtc
  stop_loss DECIMAL(15, 4),
  target_price DECIMAL(15, 4),
  platform_order_id VARCHAR(255), -- External order ID
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  placed_at TIMESTAMP,
  executed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_trading_orders_user_id ON trading_orders(user_id);
CREATE INDEX idx_trading_orders_security_id ON trading_orders(security_id);
CREATE INDEX idx_trading_orders_status ON trading_orders(status);
CREATE INDEX idx_trading_orders_created_at ON trading_orders(created_at DESC);
```

---

### 18. ai_analyses
**Purpose:** Store AI analysis results (cached)

```sql
CREATE TABLE ai_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  security_id UUID REFERENCES securities(id) ON DELETE CASCADE,
  analysis_type VARCHAR(50) NOT NULL,
  -- portfolio_insight|investment_analysis|sentiment|recommendation
  recommendation VARCHAR(20), -- strong_buy|buy|hold|sell|strong_sell
  confidence DECIMAL(5, 2),
  target_price DECIMAL(15, 4),
  stop_loss DECIMAL(15, 4),
  health_score DECIMAL(5, 2),
  valuation_score DECIMAL(5, 2),
  risk_score DECIMAL(5, 2),
  technical_indicators JSONB,
  fundamentals JSONB,
  pros TEXT[],
  cons TEXT[],
  explanation TEXT,
  sector_analysis JSONB,
  predictions JSONB,
  benchmark_comparison JSONB,
  expires_at TIMESTAMP NOT NULL, -- Cache expiry
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_analyses_user_id ON ai_analyses(user_id);
CREATE INDEX idx_ai_analyses_security_id ON ai_analyses(security_id);
CREATE INDEX idx_ai_analyses_type ON ai_analyses(analysis_type);
CREATE INDEX idx_ai_analyses_expires_at ON ai_analyses(expires_at);
```

---

### 19. audit_logs
**Purpose:** Complete audit trail for compliance

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  -- login|logout|create_investment|place_order|etc.
  entity_type VARCHAR(50), -- user|investment|order|transaction
  entity_id UUID,
  changes JSONB, -- Old and new values
  ip_address INET,
  user_agent TEXT,
  device_type VARCHAR(20),
  location VARCHAR(255),
  status VARCHAR(20) DEFAULT 'success', -- success|failed
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (created_at);

-- Create monthly partitions for audit logs
CREATE TABLE audit_logs_2024_11 PARTITION OF audit_logs
  FOR VALUES FROM ('2024-11-01 00:00:00') TO ('2024-12-01 00:00:00');

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
```

---

### 20. user_notifications
**Purpose:** In-app notification system

```sql
CREATE TABLE user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  -- price_alert|goal_milestone|order_executed|market_update
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  icon VARCHAR(50),
  link VARCHAR(255), -- Deep link to relevant page
  is_read BOOLEAN DEFAULT false,
  priority VARCHAR(20) DEFAULT 'normal', -- high|normal|low
  metadata JSONB,
  read_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX idx_user_notifications_is_read ON user_notifications(user_id, is_read);
CREATE INDEX idx_user_notifications_created_at ON user_notifications(created_at DESC);
```

---

## Indexes

### Primary Indexes (Already Defined Above)
- All primary keys have implicit B-tree indexes
- Foreign keys have indexes for join performance
- Frequently queried columns have indexes

### Additional Composite Indexes

```sql
-- User investments lookup
CREATE INDEX idx_investments_user_status_type
  ON investments(user_id, status, type);

-- Transaction queries
CREATE INDEX idx_transactions_user_date_type
  ON transactions(user_id, transaction_date DESC, type);

-- Goals progress tracking
CREATE INDEX idx_goals_user_status_date
  ON goals(user_id, status, target_date);

-- Auto-invest execution queries
CREATE INDEX idx_plan_executions_plan_date
  ON plan_executions(plan_id, execution_date DESC);

-- Market data lookup
CREATE INDEX idx_market_data_security_timestamp_desc
  ON market_data(security_id, timestamp DESC);

-- Audit queries
CREATE INDEX idx_audit_logs_user_action_date
  ON audit_logs(user_id, action, created_at DESC);
```

### Partial Indexes (For Specific Queries)

```sql
-- Active investments only
CREATE INDEX idx_investments_active
  ON investments(user_id) WHERE status = 'active';

-- Pending orders only
CREATE INDEX idx_trading_orders_pending
  ON trading_orders(user_id, created_at DESC) WHERE status IN ('pending', 'placed');

-- Unread notifications only
CREATE INDEX idx_notifications_unread
  ON user_notifications(user_id, created_at DESC) WHERE is_read = false;
```

---

## Constraints & Validations

### Check Constraints

```sql
-- Ensure positive amounts
ALTER TABLE investments
  ADD CONSTRAINT check_investments_quantity_positive
  CHECK (quantity > 0);

ALTER TABLE transactions
  ADD CONSTRAINT check_transactions_amount_positive
  CHECK (amount >= 0);

ALTER TABLE goals
  ADD CONSTRAINT check_goals_target_positive
  CHECK (target_amount > 0);

-- Ensure valid percentages
ALTER TABLE ai_analyses
  ADD CONSTRAINT check_ai_confidence_range
  CHECK (confidence >= 0 AND confidence <= 100);

-- Ensure valid dates
ALTER TABLE goals
  ADD CONSTRAINT check_goals_target_future
  CHECK (target_date > start_date);

-- Ensure valid order quantities
ALTER TABLE trading_orders
  ADD CONSTRAINT check_orders_quantity_positive
  CHECK (quantity > 0);

ALTER TABLE trading_orders
  ADD CONSTRAINT check_orders_filled_quantity
  CHECK (filled_quantity <= quantity);
```

### Unique Constraints

```sql
-- Prevent duplicate platform connections
ALTER TABLE platform_connections
  ADD CONSTRAINT unique_user_platform_active
  UNIQUE (user_id, platform)
  WHERE status = 'connected';

-- Ensure unique security symbols
ALTER TABLE securities
  ADD CONSTRAINT unique_symbol
  UNIQUE (symbol);

-- Prevent duplicate goal names per user
ALTER TABLE goals
  ADD CONSTRAINT unique_user_goal_name
  UNIQUE (user_id, name)
  WHERE deleted_at IS NULL;
```

---

## Data Retention Policies

### Retention Periods

| Table | Retention Period | Archive Strategy |
|-------|------------------|------------------|
| **users** | Indefinite | Soft delete |
| **user_sessions** | 90 days | Hard delete after expiry |
| **transactions** | 7 years | Partition by year, archive old partitions |
| **market_data** | 5 years | Partition by month, archive after 2 years |
| **audit_logs** | 3 years | Partition by month, archive old data |
| **ai_analyses** | 90 days | Delete expired cache |
| **user_notifications** | 30 days | Hard delete after 30 days |
| **sync_logs** | 6 months | Hard delete old logs |

### Archival Process

```sql
-- Example: Archive old transactions to cold storage
-- Run monthly via cron job
CREATE TABLE transactions_archive (LIKE transactions INCLUDING ALL);

-- Move data older than 5 years
INSERT INTO transactions_archive
SELECT * FROM transactions
WHERE transaction_date < CURRENT_DATE - INTERVAL '5 years';

-- Drop old partition
DROP TABLE transactions_2020;
```

---

## Backup Strategy

### 1. Full Database Backup
- **Frequency:** Daily at 2:00 AM IST
- **Retention:** 30 days
- **Tool:** `pg_dump` with compression
- **Storage:** AWS S3 / Google Cloud Storage

```bash
# Automated backup script
pg_dump -Fc -Z9 spark_investment_db > backup_$(date +%Y%m%d).dump
aws s3 cp backup_$(date +%Y%m%d).dump s3://spark-backups/daily/
```

### 2. Incremental Backup
- **Frequency:** Every 6 hours
- **Tool:** WAL (Write-Ahead Logging) archiving
- **Retention:** 7 days

### 3. Point-in-Time Recovery
- **Enabled:** Yes
- **Recovery Window:** 7 days
- **Method:** WAL replay

### 4. Replica Configuration
- **Primary:** Production database (read-write)
- **Replica 1:** Read replica for analytics (read-only)
- **Replica 2:** Hot standby for failover

### 5. Backup Testing
- **Frequency:** Monthly
- **Process:** Restore backup to staging environment
- **Validation:** Run integrity checks and sample queries

---

## Database Migrations

### Migration Tool
**Recommended:** Flyway or Liquibase

### Migration Naming Convention
```
V{version}__{description}.sql

Examples:
V1__create_users_table.sql
V2__create_investments_table.sql
V3__add_goals_table.sql
V4__add_indexes_to_transactions.sql
```

### Migration Best Practices
1. **Always forward-only** - Never modify existing migrations
2. **Test migrations** on staging before production
3. **Backup before migration** - Automatic backup before running
4. **Rollback plan** - Document rollback steps for each migration
5. **Monitor performance** - Watch for slow migrations on large tables

---

## Performance Optimization

### 1. Connection Pooling
```javascript
// Example with node-postgres
const pool = new Pool({
  max: 20,                // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### 2. Query Optimization
- Use `EXPLAIN ANALYZE` for slow queries
- Avoid `SELECT *`, specify columns
- Use `LIMIT` for large result sets
- Leverage indexes for WHERE clauses

### 3. Materialized Views (For Analytics)
```sql
-- Portfolio summary materialized view
CREATE MATERIALIZED VIEW mv_portfolio_summary AS
SELECT
  user_id,
  SUM(invested_amount) as total_invested,
  SUM(current_value) as total_current_value,
  SUM(returns) as total_returns
FROM investments
WHERE status = 'active'
GROUP BY user_id;

-- Refresh daily
CREATE UNIQUE INDEX ON mv_portfolio_summary(user_id);
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_portfolio_summary;
```

### 4. Partitioning Strategy
- **transactions:** Partition by year
- **market_data:** Partition by month
- **audit_logs:** Partition by month
- Automatically create new partitions via cron job

### 5. Vacuum & Analyze
```sql
-- Schedule regular maintenance
VACUUM ANALYZE transactions;
VACUUM ANALYZE investments;
REINDEX INDEX CONCURRENTLY idx_transactions_user_date_type;
```

---

## Security Best Practices

### 1. Encryption
```sql
-- Install pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypt sensitive columns
UPDATE users
SET pan_card = pgp_sym_encrypt(pan_card, 'encryption_key');

-- Decrypt when needed
SELECT pgp_sym_decrypt(pan_card, 'encryption_key') FROM users;
```

### 2. Row-Level Security (RLS)
```sql
-- Enable RLS on investments table
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own investments
CREATE POLICY investments_isolation_policy ON investments
  FOR ALL
  USING (user_id = current_user_id());
```

### 3. Database Roles
```sql
-- Read-only role for analytics
CREATE ROLE analytics_read WITH LOGIN PASSWORD 'secure_password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics_read;

-- Application role with limited permissions
CREATE ROLE app_user WITH LOGIN PASSWORD 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
REVOKE ALL ON user_security FROM app_user; -- Restricted table
```

### 4. Audit Triggers
```sql
-- Automatic audit logging trigger
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, entity_type, entity_id, changes)
  VALUES (
    current_user_id(),
    TG_OP,
    TG_TABLE_NAME,
    NEW.id,
    jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to sensitive tables
CREATE TRIGGER audit_investments
AFTER INSERT OR UPDATE OR DELETE ON investments
FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
```

---

## Monitoring & Alerts

### Key Metrics to Monitor

1. **Database Performance**
   - Query response time (p50, p95, p99)
   - Connection pool utilization
   - Cache hit ratio
   - Index usage statistics

2. **Storage**
   - Database size growth
   - Table sizes
   - Index sizes
   - Disk space usage

3. **Replication Lag**
   - Primary to replica delay
   - Alert if > 5 seconds

4. **Query Performance**
   - Slow queries (> 1 second)
   - Most frequent queries
   - Missing index warnings

### Monitoring Tools
- **PostgreSQL Stats:** pg_stat_statements extension
- **Metrics:** Prometheus + Grafana
- **APM:** New Relic / DataDog
- **Logs:** ELK Stack (Elasticsearch, Logstash, Kibana)

---

## Database Initialization Script

```sql
-- Initial setup script
-- Run this after creating the database

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create enums (optional, can use VARCHAR with CHECK constraints)
CREATE TYPE user_status_enum AS ENUM ('active', 'suspended', 'deleted');
CREATE TYPE kyc_status_enum AS ENUM ('incomplete', 'pending', 'verified', 'rejected');
CREATE TYPE risk_profile_enum AS ENUM ('conservative', 'moderate', 'aggressive');

-- Set timezone
SET timezone = 'Asia/Kolkata';

-- Create tables (run all CREATE TABLE statements from above)
-- Create indexes (run all CREATE INDEX statements from above)
-- Create constraints (run all ALTER TABLE statements from above)

-- Insert initial data
INSERT INTO auto_invest_strategies (name, description, risk_level, expected_returns, min_investment, allocation)
VALUES
('Aggressive Growth', 'High risk, high returns strategy', 'high', 20.00, 10000, '{"stocks": 50, "mutual_funds": 25, "crypto": 25}'),
('Balanced Wealth Builder', 'Moderate risk with balanced returns', 'medium', 15.00, 5000, '{"stocks": 35, "mutual_funds": 40, "etfs": 15, "crypto": 10}'),
('Conservative Income', 'Low risk, steady returns', 'low', 10.00, 3000, '{"debt": 50, "etfs": 30, "stocks": 20}'),
('Crypto Maximalist', 'Very high risk, crypto-focused', 'very_high', 30.00, 5000, '{"crypto": 70, "stocks": 10, "mutual_funds": 10, "etfs": 10}');

-- Create admin user (update password hash)
INSERT INTO users (email, password_hash, name, kyc_status, status)
VALUES ('admin@sparkinvestment.com', '$2b$10$...', 'Admin User', 'verified', 'active');

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO app_user;
```

---

## Common Queries

### 1. Get User Portfolio Summary
```sql
SELECT
  u.id,
  u.name,
  COUNT(i.id) as total_investments,
  SUM(i.invested_amount) as total_invested,
  SUM(i.current_value) as current_value,
  SUM(i.returns) as total_returns,
  (SUM(i.returns) / NULLIF(SUM(i.invested_amount), 0) * 100) as returns_percentage
FROM users u
LEFT JOIN investments i ON i.user_id = u.id AND i.status = 'active'
WHERE u.id = $1
GROUP BY u.id, u.name;
```

### 2. Get Top Performing Investments
```sql
SELECT
  symbol,
  name,
  returns_percentage,
  returns,
  current_value
FROM investments
WHERE user_id = $1 AND status = 'active'
ORDER BY returns_percentage DESC
LIMIT 10;
```

### 3. Calculate Goal Progress
```sql
SELECT
  g.*,
  (current_amount / NULLIF(target_amount, 0) * 100) as progress_percentage,
  (target_amount - current_amount) as remaining_amount,
  EXTRACT(MONTH FROM AGE(target_date, CURRENT_DATE)) as months_remaining
FROM goals g
WHERE user_id = $1 AND status = 'active';
```

---

**End of Database Schema Documentation**

For related documentation, see:
- API Specification: `API_SPECIFICATION.md`
- Security Guide: `SECURITY_GUIDE.md`
- AI/ML Requirements: `AI_ML_REQUIREMENTS.md`
