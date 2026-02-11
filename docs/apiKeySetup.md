# API Key Authentication Setup

## Overview

This setup allows your endpoints to accept requests from both:

1. **Your main app** - using NextAuth sessions
2. **External apps (portfolio)** - using API keys

## Setup Instructions

### 1. Add API Keys to Environment Variables

Add to your `.env.local`:

```env
# Comma-separated list of valid API keys
API_KEYS=portfolio_key_abc123xyz,mobile_app_key_def456uvw

# Or for a single key
API_KEYS=your_secure_api_key_here
```

**Generate secure API keys:**

```bash
# Use this command to generate random secure keys
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Update Your Route Handlers

Replace your existing route handlers with the `withAuth` wrapper:

**Before:**

```typescript
export async function GET(req: Request) {
  // Your logic
}
```

**After:**

```typescript
import { withAuth } from "@/lib/auth/withAuth";

export const GET = withAuth(async (req, context, authData) => {
  // authData.user - user information
  // authData.authType - "session" or "apikey"
  
  // Your logic here
  return NextResponse.json({ data: "your data" });
});
```

### 3. Example: Protected GitHub Endpoint

```typescript
// app/api/gitHub/getUserRepoList/route.ts
import { withAuth } from "@/lib/auth/withAuth";
import { NextResponse } from "next/server";

export const GET = withAuth(async (req, context, authData) => {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  
  // You can check auth type if needed
  if (authData?.authType === "apikey") {
    console.log("Request from external API");
  }
  
  // Your existing logic
  const response = await fetch(`https://api.github.com/users/${username}/repos`);
  const repos = await response.json();
  
  return NextResponse.json(repos);
});
```

### 4. Example: Repository Endpoint

```typescript
// app/api/repositories/route.ts
import { withAuth } from "@/lib/auth/withAuth";
import { NextResponse } from "next/server";

export const GET = withAuth(async (req, context, authData) => {
  const userId = authData?.user?.id;
  
  // Fetch repositories for this user
  const repos = await db.query.repositories.findMany({
    where: eq(repositories.userId, userId),
  });
  
  return NextResponse.json(repos);
});

export const POST = withAuth(async (req, context, authData) => {
  const userId = authData?.user?.id;
  const body = await req.json();
  
  // Create repository for authenticated user
  const newRepo = await db.insert(repositories).values({
    ...body,
    userId,
  });
  
  return NextResponse.json(newRepo);
});
```

## Using the API from Your Portfolio

### JavaScript/TypeScript Example

```typescript
const API_BASE_URL = 'https://your-app.vercel.app';
const API_KEY = 'your_secure_api_key_here';

async function fetchUserRepos(username: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/gitHub/getUserRepoList?username=${username}`,
    {
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

async function fetchTimeline(userId: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/timeline`,
    {
      headers: {
        'x-api-key': API_KEY,
        'x-user-id': userId, // Optional: specify user
        'Content-Type': 'application/json',
      },
    }
  );
  
  return response.json();
}

// Usage
try {
  const repos = await fetchUserRepos('username');
  console.log(repos);
} catch (error) {
  console.error('Failed to fetch repos:', error);
}
```

### React Example (Portfolio)

```tsx
// Portfolio component
import { useEffect, useState } from 'react';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY; // Store in env

export function ProjectTimeline() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const response = await fetch('https://your-app.vercel.app/api/timeline', {
          headers: {
            'x-api-key': API_KEY!,
            'x-user-id': 'your-user-id',
          },
        });
        
        const data = await response.json();
        setTimeline(data);
      } catch (error) {
        console.error('Failed to fetch timeline:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTimeline();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {timeline.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}
```

### cURL Example

```bash
# Fetch user repos
curl -X GET 'https://your-app.vercel.app/api/gitHub/getUserRepoList?username=pawel' \
  -H 'x-api-key: your_secure_api_key_here'

# Fetch timeline
curl -X GET 'https://your-app.vercel.app/api/timeline' \
  -H 'x-api-key: your_secure_api_key_here' \
  -H 'x-user-id: user123'

# Create repository
curl -X POST 'https://your-app.vercel.app/api/repositories' \
  -H 'x-api-key: your_secure_api_key_here' \
  -H 'Content-Type: application/json' \
  -d '{"name":"My Repo","url":"https://github.com/user/repo"}'
```

## Security Best Practices

### 1. Keep API Keys Secret

- **Never commit keys to git**
- Store in environment variables
- Use different keys for different environments (dev, staging, prod)
- Use different keys for different apps (portfolio, mobile, etc.)

### 2. Key Rotation

Periodically generate new keys:

```bash
# Generate new key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update .env.local with new key
# Update your portfolio app with new key
# Remove old key after transition period
```

### 3. Rate Limiting

Consider adding rate limits per API key:

```typescript
// lib/auth/rateLimiter.ts
const apiKeyUsage = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(apiKey: string): boolean {
  const now = Date.now();
  const usage = apiKeyUsage.get(apiKey);
  
  if (!usage || usage.resetAt < now) {
    // Reset or create new counter
    apiKeyUsage.set(apiKey, {
      count: 1,
      resetAt: now + 60000, // 1 minute
    });
    return true;
  }
  
  if (usage.count >= 100) { // 100 requests per minute
    return false;
  }
  
  usage.count++;
  return true;
}
```

### 4. Logging and Monitoring

Log API key usage for security monitoring:

```typescript
// In withAuth function
if (apiKey) {
  console.log(`API key access: ${req.url} at ${new Date().toISOString()}`);
}
```

### 5. CORS Configuration

Allow your portfolio domain to access the API:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  const allowedOrigins = [
    'https://your-portfolio.com',
    'https://your-main-app.com',
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
  ].filter(Boolean);

  const origin = request.headers.get('origin');
  
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, x-api-key, x-user-id');
  }
  
  return response;
}
```

## Testing

### Test with Session Auth (Main App)

1. Login to your app normally
2. Make requests - they should work with session cookies

### Test with API Key (Portfolio)

```bash
# Should succeed
curl -X GET 'http://localhost:3000/api/timeline' \
  -H 'x-api-key: your_secure_api_key_here'

# Should fail with 403
curl -X GET 'http://localhost:3000/api/timeline' \
  -H 'x-api-key: wrong_key'

# Should fail with 401
curl -X GET 'http://localhost:3000/api/timeline'
```

## Environment Variables Summary

```env
# .env.local (Your main app)
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
API_KEYS=portfolio_abc123,mobile_def456

# In your portfolio .env.local
NEXT_PUBLIC_API_KEY=portfolio_abc123
NEXT_PUBLIC_API_BASE_URL=https://your-app.vercel.app
```

## Endpoints to Protect

Apply `withAuth` to these endpoints:

- ✅ `/api/gitHub/getUserRepoList` - GET
- ✅ `/api/gitHub/getRepoActiveDays` - GET
- ✅ `/api/gitHub/getRepoAllCommits` - GET
- ✅ `/api/gitHub/getRepoDayCommits` - GET
- ✅ `/api/gitHub/fetchGitHubUserInfo` - GET
- ✅ `/api/repositories` - GET, POST
- ✅ `/api/repositories/articles` - GET, POST
- ✅ `/api/repositories/articles/[id]` - GET, PUT, DELETE
- ✅ `/api/timeline` - GET

Leave public:

- `/api/auth/*` - Handled by NextAuth

## Next Steps

1. ✅ Add `API_KEYS` to your `.env.local`
2. Update your route handlers to use `withAuth`
3. Test with both session and API key
4. Add API key to your portfolio app's environment
5. Configure CORS in middleware
6. Monitor API usage
7. Consider adding rate limiting

## Troubleshooting

**Issue: "Invalid API key" error**

- Check that API_KEYS is set in .env.local
- Verify the key in your request matches exactly
- Check for extra spaces or newlines

**Issue: CORS errors from portfolio**

- Add your portfolio domain to allowed origins in middleware
- Ensure headers include 'x-api-key' in Access-Control-Allow-Headers

**Issue: API key works locally but not in production**

- Add API_KEYS to your Vercel/production environment variables
- Redeploy after adding environment variables
