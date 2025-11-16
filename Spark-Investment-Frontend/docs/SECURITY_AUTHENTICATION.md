# Security & Authentication Guide
## Comprehensive Security Implementation for Spark Investment Platform

**Version:** 1.0
**Last Updated:** November 2024
**Classification:** CONFIDENTIAL - Internal Use Only

---

## Table of Contents
1. [Authentication System](#authentication-system)
2. [Authorization & Access Control](#authorization--access-control)
3. [Data Security](#data-security)
4. [API Security](#api-security)
5. [Platform Integration Security](#platform-integration-security)
6. [Threat Protection](#threat-protection)
7. [Compliance & Auditing](#compliance--auditing)
8. [Incident Response](#incident-response)

---

## Authentication System

### 1. JWT Token Implementation

**Access Token (Short-lived):**
```javascript
{
  "alg": "RS256",  // RSA with SHA-256
  "typ": "JWT"
}

// Payload
{
  "sub": "user_uuid",
  "email": "user@example.com",
  "role": "user|admin",
  "iat": 1234567890,
  "exp": 1234567890 + 86400,  // 24 hours
  "jti": "unique_token_id"
}
```

**Refresh Token (Long-lived):**
- Expires: 30 days
- Stored in database (hashed)
- Rotated on every use
- Invalidated on logout

**Implementation:**
```javascript
// Generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role
    },
    PRIVATE_KEY,
    {
      algorithm: 'RS256',
      expiresIn: '24h',
      jti: uuidv4()
    }
  );

  const refreshToken = jwt.sign(
    { sub: user.id },
    REFRESH_PRIVATE_KEY,
    {
      algorithm: 'RS256',
      expiresIn: '30d',
      jti: uuidv4()
    }
  );

  return { accessToken, refreshToken };
};
```

**Security Measures:**
- Use RSA-256 (asymmetric) instead of HMAC (symmetric)
- Store private keys in environment variables or HSM
- Never expose private keys in logs or code
- Rotate keys every 90 days

---

### 2. Two-Factor Authentication (2FA)

**Methods Supported:**
1. **SMS OTP** - 6-digit code, valid 10 minutes
2. **Email OTP** - 6-digit code, valid 10 minutes
3. **Authenticator App** - TOTP (RFC 6238) with 30-second interval

**TOTP Implementation:**
```javascript
const speakeasy = require('speakeasy');

// Generate secret for new user
const secret = speakeasy.generateSecret({
  name: `Spark Investment (${user.email})`,
  length: 32
});

// Store encrypted: user_security.two_factor_secret
await encryptAndStore(secret.base32);

// Verify code
const isValid = speakeasy.totp.verify({
  secret: decryptedSecret,
  encoding: 'base32',
  token: userProvidedCode,
  window: 1  // Allow 1 step before/after (±30s)
});
```

**Backup Codes:**
- Generate 10 backup codes on 2FA setup
- Each code usable once
- Store hashed (bcrypt)
- Display only once

---

### 3. Password Security

**Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character
- Not in common password lists (check against HaveIBeenPwned)

**Hashing:**
```javascript
const bcrypt = require('bcrypt');

// Hash password (cost factor: 12)
const hashedPassword = await bcrypt.hash(password, 12);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);
```

**Password Reset Flow:**
1. User requests reset → Generate secure token (crypto.randomBytes(32))
2. Store token hash + expiry (15 minutes) in database
3. Send reset link via email: `/reset-password?token=...`
4. Verify token + expiry before allowing password change
5. Invalidate token after use

---

### 4. Session Management

**Session Storage:**
- Store session data in Redis (fast access)
- Key: `session:{token_hash}`
- Value: JSON with user data, device info
- TTL: Token expiry time

**Session Security:**
```javascript
// Track sessions in database
INSERT INTO user_sessions (
  user_id, token_hash, refresh_token_hash,
  device_type, browser, os, ip_address, location
) VALUES (...);

// Detect suspicious activity
if (newLoginLocation !== lastLoginLocation) {
  sendSecurityAlert(user.email);
}

// Allow session revocation
DELETE FROM user_sessions WHERE id = session_id;
```

**Concurrent Session Limits:**
- Max 5 active sessions per user
- Auto-logout oldest session if limit exceeded
- Show "Active Sessions" in settings

---

## Authorization & Access Control

### 1. Role-Based Access Control (RBAC)

**Roles:**
```javascript
const roles = {
  USER: {
    permissions: [
      'read:own_portfolio',
      'write:own_investments',
      'execute:own_trades',
      'read:market_data'
    ]
  },
  PREMIUM_USER: {
    inherits: 'USER',
    permissions: [
      'access:ai_analysis',
      'access:auto_invest',
      'access:advanced_charts'
    ]
  },
  ADMIN: {
    permissions: [
      'read:all_users',
      'write:all_data',
      'delete:any_resource',
      'access:admin_panel'
    ]
  }
};
```

**Middleware:**
```javascript
const requirePermission = (permission) => {
  return async (req, res, next) => {
    const user = req.user; // From JWT
    const userRole = user.role;

    if (!hasPermission(userRole, permission)) {
      return res.status(403).json({
        error: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Usage
app.post('/ai/analysis',
  authenticateJWT,
  requirePermission('access:ai_analysis'),
  handleAIAnalysis
);
```

### 2. Resource Ownership Verification

**Always verify user owns requested resource:**
```javascript
// BAD - No ownership check
app.get('/investments/:id', async (req, res) => {
  const investment = await Investment.findById(req.params.id);
  res.json(investment);
});

// GOOD - Verify ownership
app.get('/investments/:id', async (req, res) => {
  const investment = await Investment.findOne({
    id: req.params.id,
    user_id: req.user.id  // Ownership check
  });

  if (!investment) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json(investment);
});
```

---

## Data Security

### 1. Encryption at Rest

**Sensitive Fields to Encrypt:**
- PAN card numbers
- Bank account numbers
- API keys (platform connections)
- API secrets
- Backup codes

**Implementation (AES-256):**
```javascript
const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // 32 bytes
const IV_LENGTH = 16;

function encrypt(plaintext) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
}

function decrypt(encryptedData) {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    KEY,
    Buffer.from(encryptedData.iv, 'hex')
  );

  decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

**PostgreSQL pgcrypto Alternative:**
```sql
-- Encrypt
UPDATE users
SET pan_card = pgp_sym_encrypt(pan_card, 'encryption_key');

-- Decrypt
SELECT pgp_sym_decrypt(pan_card::bytea, 'encryption_key') FROM users;
```

### 2. Data Masking

**Mask sensitive data in responses:**
```javascript
function maskPAN(pan) {
  return pan.replace(/^(.{4})(.*)(.{4})$/, '$1****$3');
  // ABCD1234E → ABCD****234E
}

function maskEmail(email) {
  const [local, domain] = email.split('@');
  return `${local.charAt(0)}***@${domain}`;
  // john@example.com → j***@example.com
}

function maskPhone(phone) {
  return phone.replace(/(\d{2})(\d{6})(\d{2})/, '$1******$3');
  // 9876543210 → 98******10
}
```

### 3. Encryption in Transit

**HTTPS/TLS Requirements:**
- TLS 1.2 minimum (TLS 1.3 preferred)
- Valid SSL certificate (Let's Encrypt or commercial)
- HSTS header: `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- Disable weak ciphers

**Nginx Configuration:**
```nginx
server {
  listen 443 ssl http2;
  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;

  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;
  ssl_prefer_server_ciphers on;

  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Frame-Options "DENY" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;
}
```

---

## API Security

### 1. Rate Limiting

**Implementation (Redis-based):**
```javascript
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');

// Auth endpoints: Stricter limits
const authLimiter = rateLimit({
  store: new RedisStore({ client: redisClient }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour
  message: 'Too many login attempts, please try again later',
  keyGenerator: (req) => req.ip
});

// General API: Moderate limits
const apiLimiter = rateLimit({
  store: new RedisStore({ client: redisClient }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || req.ip
});

app.use('/api/auth/login', authLimiter);
app.use('/api/', apiLimiter);
```

### 2. Input Validation & Sanitization

**Use validation library (Joi/Yup):**
```javascript
const Joi = require('joi');

const investmentSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required(),
  symbol: Joi.string().trim().uppercase().max(50).required(),
  quantity: Joi.number().positive().required(),
  buyPrice: Joi.number().positive().required(),
  purchaseDate: Joi.date().max('now').required()
});

// Validate request body
app.post('/investments', async (req, res) => {
  const { error, value } = investmentSchema.validate(req.body);

  if (error) {
    return res.status(422).json({
      error: 'Validation error',
      details: error.details
    });
  }

  // Proceed with sanitized data (value)
  const investment = await createInvestment(value);
  res.status(201).json(investment);
});
```

**SQL Injection Prevention:**
```javascript
// BAD - Vulnerable to SQL injection
const query = `SELECT * FROM users WHERE email = '${email}'`;

// GOOD - Parameterized query
const query = 'SELECT * FROM users WHERE email = $1';
const result = await db.query(query, [email]);
```

### 3. CORS Configuration

**Whitelist allowed origins:**
```javascript
const cors = require('cors');

const whitelist = [
  'https://sparkinvestment.com',
  'https://www.sparkinvestment.com',
  'http://localhost:3000', // Development
];

app.use(cors({
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 4. CSRF Protection

**Implementation:**
```javascript
const csrf = require('csurf');

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: true, // HTTPS only
    sameSite: 'strict'
  }
});

// Send CSRF token to client
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Verify CSRF token on state-changing requests
app.post('/api/investments', csrfProtection, handleCreateInvestment);
```

**Frontend (Axios):**
```javascript
// Get CSRF token on app load
const { data } = await axios.get('/api/csrf-token');
const csrfToken = data.csrfToken;

// Include in all POST/PUT/DELETE requests
axios.post('/api/investments', data, {
  headers: {
    'X-CSRF-Token': csrfToken
  }
});
```

---

## Platform Integration Security

### 1. API Key Storage

**Never store plain-text API keys:**
```javascript
// Encrypt before storing
const encryptedKey = encrypt(apiKey);
const encryptedSecret = encrypt(apiSecret);

await db.query(`
  INSERT INTO platform_connections (user_id, platform, api_key, api_secret)
  VALUES ($1, $2, $3, $4)
`, [userId, platform, encryptedKey, encryptedSecret]);

// Decrypt when using
const decryptedKey = decrypt(storedKey);
const decryptedSecret = decrypt(storedSecret);
```

### 2. OAuth 2.0 Flow (for platforms supporting it)

**Zerodha Kite Connect Example:**
```javascript
// Step 1: Redirect user to authorization
const authUrl = `https://kite.zerodha.com/connect/login?
api_key=${API_KEY}&redirect_uri=${REDIRECT_URI}`;

// Step 2: Handle callback with request_token
app.get('/auth/zerodha/callback', async (req, res) => {
  const { request_token } = req.query;

  // Step 3: Exchange for access_token
  const response = await axios.post('https://api.kite.trade/session/token', {
    api_key: API_KEY,
    request_token: request_token,
    checksum: generateChecksum(API_KEY, request_token, API_SECRET)
  });

  const { access_token } = response.data;

  // Store encrypted
  await storeEncryptedToken(req.user.id, 'zerodha', access_token);

  res.redirect('/dashboard');
});
```

### 3. Webhook Verification

**Verify webhooks from external platforms:**
```javascript
function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const expectedSignature = hmac.update(payload).digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

app.post('/webhooks/zerodha', (req, res) => {
  const signature = req.headers['x-zerodha-signature'];
  const payload = JSON.stringify(req.body);

  if (!verifyWebhookSignature(payload, signature, WEBHOOK_SECRET)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Process webhook
  handleZerodhaWebhook(req.body);
  res.status(200).send('OK');
});
```

---

## Threat Protection

### 1. Brute Force Protection

**Track failed login attempts:**
```javascript
const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 30;

async function checkLoginAttempts(email) {
  const user = await User.findOne({ email });

  if (user.account_locked_until && user.account_locked_until > new Date()) {
    throw new Error('Account locked. Try again later.');
  }

  if (user.failed_login_attempts >= MAX_ATTEMPTS) {
    await User.update(
      { id: user.id },
      { account_locked_until: new Date(Date.now() + LOCK_DURATION_MINUTES * 60000) }
    );
    throw new Error('Account locked due to too many failed attempts.');
  }
}

async function recordFailedLogin(email) {
  await User.increment('failed_login_attempts', { where: { email } });
}

async function resetFailedLogins(userId) {
  await User.update(
    { id: userId },
    { failed_login_attempts: 0, account_locked_until: null }
  );
}
```

### 2. XSS Prevention

**Sanitize user inputs:**
```javascript
const DOMPurify = require('isomorphic-dompurify');

function sanitizeHTML(dirty) {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href']
  });
}

// Sanitize before storing
const cleanDescription = sanitizeHTML(req.body.description);
```

**Set secure headers:**
```javascript
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'");
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});
```

### 3. Bot Protection (Captcha)

**Integrate Google reCAPTCHA:**
```javascript
const axios = require('axios');

async function verifyRecaptcha(token) {
  const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
    params: {
      secret: process.env.RECAPTCHA_SECRET,
      response: token
    }
  });

  return response.data.success && response.data.score > 0.5;
}

// On signup/login
app.post('/auth/signup', async (req, res) => {
  const { recaptchaToken } = req.body;

  if (!await verifyRecaptcha(recaptchaToken)) {
    return res.status(400).json({ error: 'Captcha verification failed' });
  }

  // Proceed with signup
});
```

---

## Compliance & Auditing

### 1. Audit Logging

**Log all critical actions:**
```javascript
async function logAuditEvent(userId, action, entityType, entityId, changes, req) {
  await db.query(`
    INSERT INTO audit_logs (
      user_id, action, entity_type, entity_id, changes,
      ip_address, user_agent, device_type, location
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  `, [
    userId,
    action,
    entityType,
    entityId,
    JSON.stringify(changes),
    req.ip,
    req.headers['user-agent'],
    detectDeviceType(req.headers['user-agent']),
    await getLocationFromIP(req.ip)
  ]);
}

// Usage
await logAuditEvent(
  req.user.id,
  'create_investment',
  'investment',
  investment.id,
  { new: investment },
  req
);
```

### 2. Data Privacy (GDPR/DPDP)

**User Rights:**
- Right to access data (export)
- Right to rectification (update)
- Right to erasure (delete)
- Right to data portability

**Implementation:**
```javascript
// Export user data
app.get('/api/user/export', async (req, res) => {
  const userId = req.user.id;

  const userData = await User.findById(userId);
  const investments = await Investment.find({ user_id: userId });
  const transactions = await Transaction.find({ user_id: userId });
  const goals = await Goal.find({ user_id: userId });

  const exportData = {
    personal_info: userData,
    investments,
    transactions,
    goals
  };

  res.attachment('user_data.json');
  res.json(exportData);
});

// Delete user data (GDPR right to erasure)
app.delete('/api/user/account', async (req, res) => {
  const userId = req.user.id;

  // Soft delete
  await User.update({ id: userId }, {
    status: 'deleted',
    deleted_at: new Date(),
    email: `deleted_${userId}@deleted.com` // Anonymize
  });

  // Cascade soft delete related data
  await Investment.update({ user_id: userId }, { deleted_at: new Date() });

  res.json({ message: 'Account deleted successfully' });
});
```

### 3. SEBI Compliance

**Trading Limits (as per SEBI guidelines):**
```javascript
const DAILY_TRADING_LIMIT = 100000; // ₹1 lakh

async function checkTradingLimits(userId, orderAmount) {
  const today = new Date().toISOString().split('T')[0];

  const dailyTotal = await db.query(`
    SELECT COALESCE(SUM(total_cost), 0) as total
    FROM trading_orders
    WHERE user_id = $1
      AND DATE(created_at) = $2
      AND status IN ('executed', 'partially_filled')
  `, [userId, today]);

  if (dailyTotal.rows[0].total + orderAmount > DAILY_TRADING_LIMIT) {
    throw new Error('Daily trading limit exceeded');
  }
}
```

---

## Incident Response

### 1. Security Incident Checklist

**If breach detected:**
1. **Contain:** Immediately revoke compromised tokens/sessions
2. **Assess:** Determine scope of breach (affected users, data exposed)
3. **Notify:** Inform affected users within 72 hours (GDPR/DPDP)
4. **Remediate:** Patch vulnerability, force password resets
5. **Document:** Record incident details, timeline, actions taken
6. **Review:** Post-mortem analysis, update security measures

### 2. Monitoring & Alerts

**Set up alerts for:**
- Multiple failed login attempts (>5 in 10 minutes)
- Unusual API usage patterns
- Large data exports
- Trading orders exceeding limits
- Database access from unknown IPs
- Error rate spikes

**Tools:**
- Logging: Winston / Bunyan
- Monitoring: Prometheus + Grafana
- APM: New Relic / DataDog
- Security: Snyk / Dependabot

---

## Security Checklist

**Before Production Launch:**

- [ ] All secrets in environment variables (not in code)
- [ ] HTTPS/TLS enabled with valid certificate
- [ ] JWT tokens properly implemented (RS256)
- [ ] 2FA available for users
- [ ] Passwords hashed with bcrypt (cost factor ≥12)
- [ ] Sensitive data encrypted at rest
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (sanitization + CSP headers)
- [ ] CORS properly configured (whitelist)
- [ ] CSRF protection enabled
- [ ] Audit logging for critical actions
- [ ] Session management secure
- [ ] API keys encrypted in database
- [ ] Webhook signature verification
- [ ] Error messages don't expose sensitive info
- [ ] Database connection pooling configured
- [ ] Regular security audits scheduled
- [ ] Incident response plan documented
- [ ] GDPR/DPDP compliance measures implemented

---

**End of Security & Authentication Guide**

For related documentation, see:
- API Specification: `API_SPECIFICATION.md`
- Database Schema: `DATABASE_SCHEMA.md`
