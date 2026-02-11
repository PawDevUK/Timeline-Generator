# Authentication Mechanisms Explained

## Overview

This document explains how the two authentication methods in your application work and provides a detailed explanation of JWT (JSON Web Tokens).

---

## 1. NextAuth Session-Based Authentication

### How It Works

NextAuth provides session-based authentication using a cookie-based approach with optional JWT tokens.

#### Step-by-Step Flow

```
1. User Login
   ↓
2. Credentials Verified
   ↓
3. Session Created (JWT or Database)
   ↓
4. Session Token Stored in HTTP-Only Cookie
   ↓
5. Browser Automatically Sends Cookie with Each Request
   ↓
6. Server Validates Session
   ↓
7. Access Granted/Denied
```

### Detailed Breakdown

#### Step 1-2: User Login & Verification

```typescript
// When user submits login form
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Server verifies credentials against database
const user = await db.query.users.findFirst({
  where: eq(users.email, email)
});

const isValid = await bcrypt.compare(password, user.password);
```

#### Step 3: Session Creation

NextAuth creates a session in one of two ways:

**Option A: JWT Strategy (Stateless)**

- Creates a signed JWT containing user information
- No database lookup needed for each request
- Faster but less control over session invalidation

**Option B: Database Strategy (Stateful)**

- Stores session in database with expiration
- Each request queries database to validate session
- Slower but allows immediate session invalidation

#### Step 4: Cookie Storage

```http
Set-Cookie: next-auth.session-token=eyJhbGciOiJIUzI1NiIs...; 
  Path=/; 
  HttpOnly; 
  Secure; 
  SameSite=Lax;
  Max-Age=2592000
```

**Cookie Attributes:**

- `HttpOnly`: Prevents JavaScript access (XSS protection)
- `Secure`: Only sent over HTTPS
- `SameSite=Lax`: CSRF protection
- `Max-Age`: Session lifetime (30 days default)

#### Step 5: Automatic Request Authentication

```typescript
// Browser automatically includes cookie
GET /api/repositories
Cookie: next-auth.session-token=eyJhbGciOiJIUzI1NiIs...

// Your route handler
export async function GET(req: Request) {
  // getServerSession reads and validates the cookie
  const session = await getServerSession(authOptions);
  
  // Session object contains user info
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  
  // session.user = { id, email, name, ... }
}
```

#### Step 6: Session Validation

**For JWT Strategy:**

```typescript
// NextAuth does this internally:
1. Extract token from cookie
2. Verify JWT signature using NEXTAUTH_SECRET
3. Check expiration timestamp
4. Return decoded user data if valid
```

**For Database Strategy:**

```typescript
// NextAuth does this internally:
1. Extract session token from cookie
2. Query database for matching session
3. Check if session expired
4. Return user data from session record
```

### Advantages

✅ Automatic cookie handling by browser  
✅ HttpOnly cookies prevent XSS attacks  
✅ Built-in CSRF protection  
✅ Seamless user experience (stays logged in)  
✅ No manual token management needed  

### Disadvantages

❌ Only works in browser (not for external apps)  
❌ Requires same-origin or proper CORS setup  
❌ Cookie size limitations  
❌ Requires server-side session validation  

---

## 2. API Key Authentication

### How It Works

API key authentication is a simple token-based method where clients include a secret key in request headers.

#### Step-by-Step Flow

```
1. Admin Generates API Key
   ↓
2. Key Stored in Environment Variables
   ↓
3. Client Stores Key Securely
   ↓
4. Client Includes Key in Request Header
   ↓
5. Server Validates Key Against Stored Keys
   ↓
6. Access Granted/Denied
```

### Detailed Breakdown

#### Step 1: Key Generation

```bash
# Generate cryptographically secure random key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Output: a7f3d9c2e4b8f1a0d5c7e9b2f4a6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2
```

#### Step 2: Server Storage

```env
# .env.local
API_KEYS=a7f3d9c2e4b8f1a0d5c7e9b2f4a6c8d0,b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8
```

Multiple keys can be stored for different clients:

- `key_1` → Portfolio website
- `key_2` → Mobile app
- `key_3` → Third-party integration

#### Step 3: Client Storage

```typescript
// Portfolio app's .env.local
NEXT_PUBLIC_API_KEY=a7f3d9c2e4b8f1a0d5c7e9b2f4a6c8d0

// Or in backend service
API_KEY=a7f3d9c2e4b8f1a0d5c7e9b2f4a6c8d0
```

#### Step 4: Request with API Key

```typescript
// Client makes request with key in header
const response = await fetch('https://api.example.com/api/timeline', {
  headers: {
    'x-api-key': 'a7f3d9c2e4b8f1a0d5c7e9b2f4a6c8d0',
    'Content-Type': 'application/json'
  }
});
```

```http
GET /api/timeline HTTP/1.1
Host: api.example.com
x-api-key: a7f3d9c2e4b8f1a0d5c7e9b2f4a6c8d0
Content-Type: application/json
```

#### Step 5: Server Validation

```typescript
export function withApiKey(handler: Handler) {
  return async (req: Request, context?: any) => {
    // 1. Extract key from header
    const apiKey = req.headers.get("x-api-key");
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key required" },
        { status: 401 }
      );
    }
    
    // 2. Get valid keys from environment
    const validApiKeys = process.env.API_KEYS?.split(",") || [];
    
    // 3. Check if provided key matches any valid key
    if (!validApiKeys.includes(apiKey)) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 403 }
      );
    }
    
    // 4. Key is valid - proceed with request
    return handler(req, context, {
      user: { id: req.headers.get("x-user-id") },
      authType: "apikey",
    });
  };
}
```

### Advantages

✅ Works from any client (web, mobile, server)  
✅ No cookies or sessions needed  
✅ Simple to implement and understand  
✅ Perfect for server-to-server communication  
✅ Easy to revoke (just remove from env)  
✅ No expiration handling needed  

### Disadvantages

❌ Key must be securely stored by client  
❌ If leaked, provides full access until revoked  
❌ No built-in expiration mechanism  
❌ Less granular control (all-or-nothing access)  
❌ Must be manually included in every request  

---

## 3. JWT (JSON Web Tokens) Explained

### What is JWT?

JWT is an open standard (RFC 7519) for securely transmitting information between parties as a JSON object. It's digitally signed, so it can be verified and trusted.

### JWT Structure

A JWT consists of three parts separated by dots (`.`):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

Header.Payload.Signature
```

#### Part 1: Header

```json
{
  "alg": "HS256",    // Algorithm used for signing
  "typ": "JWT"       // Token type
}
```

Base64URL encoded: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

**Common Algorithms:**

- `HS256` - HMAC with SHA-256 (symmetric)
- `RS256` - RSA with SHA-256 (asymmetric)
- `ES256` - ECDSA with SHA-256 (asymmetric)

#### Part 2: Payload (Claims)

```json
{
  "sub": "1234567890",           // Subject (user ID)
  "name": "John Doe",            // Custom claim
  "email": "john@example.com",   // Custom claim
  "iat": 1516239022,             // Issued at (timestamp)
  "exp": 1516242622              // Expiration (timestamp)
}
```

Base64URL encoded: `eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ`

**Standard Claims:**

- `iss` (issuer) - Who created the token
- `sub` (subject) - Who the token is about
- `aud` (audience) - Who should accept the token
- `exp` (expiration) - When token expires
- `iat` (issued at) - When token was created
- `nbf` (not before) - Token not valid before this time
- `jti` (JWT ID) - Unique identifier for the token

**Custom Claims:**
You can add any custom data: `name`, `email`, `role`, `permissions`, etc.

#### Part 3: Signature

```javascript
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

The signature ensures:

1. The token hasn't been tampered with
2. The token was created by someone with the secret key

### How JWT Works in Practice

#### Creating a JWT

```typescript
import jwt from 'jsonwebtoken';

// 1. Define payload
const payload = {
  sub: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30) // 30 days
};

// 2. Sign token with secret
const token = jwt.sign(
  payload,
  process.env.NEXTAUTH_SECRET, // Secret key
  { algorithm: 'HS256' }
);

// 3. Token returned to client
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0...
```

#### Verifying a JWT

```typescript
import jwt from 'jsonwebtoken';

try {
  // 1. Extract token from request
  const token = req.cookies.get('session-token')?.value;
  
  // 2. Verify signature and decode
  const decoded = jwt.verify(
    token,
    process.env.NEXTAUTH_SECRET
  );
  
  // 3. Check expiration (done automatically by jwt.verify)
  // 4. Use decoded data
  console.log(decoded);
  // {
  //   sub: "12345",
  //   email: "user@example.com",
  //   name: "John Doe",
  //   iat: 1516239022,
  //   exp: 1516242622
  // }
  
} catch (error) {
  if (error.name === 'TokenExpiredError') {
    console.log('Token expired');
  } else if (error.name === 'JsonWebTokenError') {
    console.log('Invalid token');
  }
}
```

### JWT Security Flow

```
1. User Logs In
   ↓
2. Server Creates JWT
   - Adds user data to payload
   - Signs with secret key
   ↓
3. Server Sends JWT to Client
   - As cookie (NextAuth default)
   - Or in response body
   ↓
4. Client Stores JWT
   - Browser: cookie or localStorage
   - Mobile: secure storage
   ↓
5. Client Includes JWT in Requests
   - Cookie: automatic
   - Header: Bearer token
   ↓
6. Server Receives Request
   - Extracts JWT
   - Verifies signature
   - Checks expiration
   ↓
7. If Valid → Access Granted
   If Invalid → 401 Unauthorized
```

### JWT vs Session Comparison

| Feature | JWT | Database Session |
|---------|-----|------------------|
| **Storage** | Stored on client | Stored on server |
| **State** | Stateless | Stateful |
| **Scalability** | Excellent (no DB queries) | Good (requires DB) |
| **Revocation** | Difficult (needs blacklist) | Easy (delete from DB) |
| **Size** | Larger (sent with every request) | Small (just session ID) |
| **Security** | Exposed to client | Server-side only |
| **Expiration** | Built-in (exp claim) | Manual or DB TTL |
| **Cross-domain** | Easy (just send token) | Complex (cookie issues) |

### JWT Security Best Practices

#### 1. Keep Tokens Short-Lived

```typescript
const payload = {
  sub: user.id,
  exp: Math.floor(Date.now() / 1000) + (60 * 15) // 15 minutes
};
```

#### 2. Use HttpOnly Cookies

```typescript
// Prevents JavaScript access (XSS protection)
res.setHeader('Set-Cookie', `token=${jwt}; HttpOnly; Secure; SameSite=Strict`);
```

#### 3. Never Store Sensitive Data

```typescript
// ❌ BAD - Don't put passwords, credit cards, etc.
const payload = {
  sub: user.id,
  password: user.password, // NEVER DO THIS
  creditCard: '1234-5678-9012-3456' // NEVER DO THIS
};

// ✅ GOOD - Only non-sensitive identifiers
const payload = {
  sub: user.id,
  email: user.email,
  role: user.role
};
```

#### 4. Use Strong Secrets

```bash
# Generate strong secret (min 32 characters)
openssl rand -base64 32
# or
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### 5. Implement Token Refresh

```typescript
// Short-lived access token (15 min)
const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' });

// Long-lived refresh token (30 days)
const refreshToken = jwt.sign(payload, secret, { expiresIn: '30d' });

// Store refresh token in database
// Use it to issue new access tokens
```

#### 6. Validate All Claims

```typescript
const decoded = jwt.verify(token, secret);

// Check issuer
if (decoded.iss !== 'your-app.com') {
  throw new Error('Invalid issuer');
}

// Check audience
if (decoded.aud !== 'api.your-app.com') {
  throw new Error('Invalid audience');
}

// Expiration checked automatically by jwt.verify
```

---

## Hybrid Approach: Your Implementation

Your `withAuth` function combines both methods:

```typescript
export function withAuth(handler: Handler) {
  return async (req: Request, context?: any) => {
    // 1. Check for API key first (stateless)
    const apiKey = req.headers.get("x-api-key");
    
    if (apiKey) {
      // Simple string comparison
      const validApiKeys = process.env.API_KEYS?.split(",") || [];
      if (!validApiKeys.includes(apiKey)) {
        return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
      }
      return handler(req, context, { user: { id: userId }, authType: "apikey" });
    }
    
    // 2. Fall back to NextAuth session (JWT or DB-based)
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    return handler(req, context, { user: session.user, authType: "session" });
  };
}
```

### Why This Works Well

**For Your Main App:**

- Uses NextAuth sessions (JWT-based)
- Automatic cookie handling
- Secure, HttpOnly cookies
- Good UX (users stay logged in)

**For Your Portfolio:**

- Uses API keys
- No cookies needed
- Works cross-domain
- Simple integration

### Request Flow Examples

#### Example 1: Main App Request

```
Browser → GET /api/repositories
Cookie: next-auth.session-token=eyJhbGci...
         ↓
withAuth checks for x-api-key → Not found
         ↓
withAuth checks session → Valid JWT
         ↓
User authenticated → Request processed
```

#### Example 2: Portfolio Request

```
Portfolio → GET /api/repositories
Header: x-api-key=a7f3d9c2e4b8f1a0...
         ↓
withAuth checks for x-api-key → Found
         ↓
Validates against API_KEYS → Valid
         ↓
User authenticated → Request processed
```

#### Example 3: Unauthorized Request

```
Attacker → GET /api/repositories
(no cookie, no API key)
         ↓
withAuth checks for x-api-key → Not found
         ↓
withAuth checks session → No session
         ↓
Return 401 Unauthorized
```

---

## Key Takeaways

### Session-Based Auth (NextAuth)

- **Best for**: Browser-based applications, same origin
- **Mechanism**: Signed JWT stored in HttpOnly cookie
- **Validation**: Signature verification + expiration check
- **Security**: HttpOnly, Secure, SameSite cookies

### API Key Auth

- **Best for**: External apps, server-to-server, cross-origin
- **Mechanism**: Secret key in request header
- **Validation**: Simple string comparison
- **Security**: Must be kept secret, HTTPS required

### JWT

- **What**: Self-contained, signed token
- **Structure**: Header.Payload.Signature
- **Purpose**: Securely transmit information between parties
- **Benefits**: Stateless, scalable, verifiable
- **Drawbacks**: Difficult to revoke, exposed to client

### Combined Approach

- Flexibility to support multiple client types
- Security appropriate for each use case
- Simple to maintain and understand
- Scalable and performant

---

## Further Reading

- [JWT.io](https://jwt.io/) - JWT debugger and documentation
- [NextAuth.js Docs](https://next-auth.js.org/) - Complete NextAuth guide
- [OWASP Auth Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) - Security best practices
- [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519) - JWT specification
