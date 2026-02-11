# API Endpoint Security Options

## Current State

Your Next.js application has multiple API endpoints that need protection:

- Authentication endpoints (`/api/auth/*`)
- GitHub integration endpoints (`/api/gitHub/*`)
- Repository management (`/api/repositories/*`)
- Timeline data (`/api/timeline`)

You already have NextAuth configured, which provides a solid foundation for authentication.

## Security Implementation Options

### 1. **NextAuth Session Validation (Recommended)**

Leverage your existing NextAuth setup to protect routes.

**Pros:**

- Already integrated in your project
- Consistent with authentication flow
- Built-in session management
- Easy to implement

**Implementation:**

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }
  
  // Your protected logic here
}
```

**Apply to:** All `/api/gitHub/*`, `/api/repositories/*`, `/api/timeline` routes

---

### 2. **Middleware-Based Protection**

Use Next.js middleware to protect routes globally.

**Pros:**

- Centralized security logic
- Runs before route handlers
- Can protect multiple routes at once
- No code duplication

**Implementation:**
Update your `middleware.ts`:

```typescript
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  const { pathname } = request.nextUrl;

  // Protected API routes
  const protectedApiRoutes = [
    "/api/gitHub",
    "/api/repositories",
    "/api/timeline",
  ];

  const isProtectedRoute = protectedApiRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/gitHub/:path*",
    "/api/repositories/:path*",
    "/api/timeline/:path*",
  ],
};
```

---

### 3. **Custom Authentication Helper/Wrapper**

Create a reusable helper function to wrap protected routes.

**Pros:**

- Consistent error handling
- Easy to add additional checks (roles, permissions)
- Centralized logic updates
- Type-safe

**Implementation:**

```typescript
// lib/auth/withAuth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";

type Handler = (
  req: Request,
  context?: any,
  session?: any
) => Promise<Response>;

export function withAuth(handler: Handler) {
  return async (req: Request, context?: any) => {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    return handler(req, context, session);
  };
}
```

**Usage:**

```typescript
export const GET = withAuth(async (req, context, session) => {
  // Your protected logic
  // session.user is guaranteed to exist
});
```

---

### 4. **API Key Authentication**

For external services or programmatic access.

**Pros:**

- Good for service-to-service communication
- No user session required
- Can be revoked/rotated

**Cons:**

- Requires key management
- Not suitable for user-facing endpoints

**Implementation:**

```typescript
export async function GET(req: Request) {
  const apiKey = req.headers.get("x-api-key");
  
  if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
    return NextResponse.json(
      { error: "Invalid API key" },
      { status: 403 }
    );
  }
  
  // Your logic
}
```

---

### 5. **Rate Limiting**

Prevent abuse and DoS attacks.

**Pros:**

- Prevents brute force attacks
- Protects against abuse
- Reduces server load

**Implementation Options:**

- **Upstash Rate Limit**: Redis-based, serverless-friendly
- **Next.js Edge Rate Limiting**: Using Vercel KV
- **Custom in-memory solution**: For simple cases

**Example with Upstash:**

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

export async function GET(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }
  
  // Your logic
}
```

---

### 6. **Role-Based Access Control (RBAC)**

For different permission levels.

**Pros:**

- Granular control
- Scalable for teams
- Supports different user types

**Implementation:**

```typescript
// Extend your user model with roles
interface User {
  id: string;
  email: string;
  role: "admin" | "user" | "viewer";
}

// Helper function
function hasPermission(session: any, requiredRole: string) {
  const roleHierarchy = { admin: 3, user: 2, viewer: 1 };
  return roleHierarchy[session.user.role] >= roleHierarchy[requiredRole];
}

// Usage in route
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!hasPermission(session, "admin")) {
    return NextResponse.json(
      { error: "Forbidden - Admin access required" },
      { status: 403 }
    );
  }
  
  // Delete logic
}
```

---

### 7. **CORS Configuration**

Control which origins can access your API.

**Pros:**

- Prevents unauthorized cross-origin requests
- Simple to configure

**Implementation:**

```typescript
// middleware.ts or in route handlers
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  const allowedOrigins = [
    "https://yourdomain.com",
    process.env.NODE_ENV === "development" ? "http://localhost:3000" : "",
  ].filter(Boolean);

  const origin = request.headers.get("origin");
  
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }
  
  return response;
}
```

---

## Recommended Implementation Strategy

### Phase 1: Immediate Protection (Priority: HIGH)

1. **Implement NextAuth Session Validation** on all sensitive endpoints
2. **Add Middleware Protection** for `/api/gitHub/*`, `/api/repositories/*`, `/api/timeline`
3. **Configure CORS** to allow only your domain

### Phase 2: Enhanced Security (Priority: MEDIUM)

4. **Implement Rate Limiting** on auth endpoints and GitHub API routes
2. **Create Auth Wrapper** (`withAuth` helper) for cleaner code
3. **Add Request Logging** for security monitoring

### Phase 3: Advanced Features (Priority: LOW)

7. **Implement RBAC** if you need different permission levels
2. **Add API Keys** for any external integrations
3. **Implement Request Validation** using Zod or similar

---

## Specific Endpoints to Protect

### Critical (Must Protect)

- ✅ `/api/gitHub/*` - All GitHub operations
- ✅ `/api/repositories/*` - Repository management
- ✅ `/api/timeline` - User timeline data

### Already Protected

- `/api/auth/*` - Handled by NextAuth

### Consider Public

- `/api/auth/login` - POST (needs to be public)
- `/api/auth/register` - POST (needs to be public)

---

## Code Examples for Your Routes

### Example 1: Protecting GitHub Routes

```typescript
// app/api/gitHub/getUserRepoList/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  // Existing logic...
}
```

### Example 2: Protecting Repository Routes

```typescript
// app/api/repositories/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }
  
  // Ensure user can only create their own repositories
  const body = await req.json();
  if (body.userId !== session.user.id) {
    return new Response("Forbidden", { status: 403 });
  }
  
  // Existing logic...
}
```

---

## Environment Variables Needed

```env
# Already have these
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# For rate limiting (optional)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# For API keys (optional)
API_SECRET_KEY=your-api-secret-key
```

---

## Testing Checklist

- [ ] Unauthenticated requests to protected endpoints return 401
- [ ] Authenticated requests to protected endpoints work correctly
- [ ] Session expiration is handled properly
- [ ] Rate limiting prevents abuse (if implemented)
- [ ] CORS blocks unauthorized origins
- [ ] Error messages don't leak sensitive information

---

## Additional Security Best Practices

1. **Input Validation**: Use Zod to validate all request bodies
2. **SQL Injection Prevention**: Use Drizzle ORM properly (you're already doing this)
3. **XSS Prevention**: Sanitize user inputs
4. **HTTPS Only**: Ensure all production traffic uses HTTPS
5. **Security Headers**: Add security headers in middleware
6. **Error Handling**: Don't expose stack traces in production
7. **Audit Logging**: Log all sensitive operations

---

## Next Steps

1. Review which endpoints currently lack authentication
2. Choose implementation approach (recommend: Middleware + Session validation)
3. Update routes with authentication checks
4. Test thoroughly with both authenticated and unauthenticated requests
5. Monitor logs for unauthorized access attempts
6. Consider adding rate limiting to prevent abuse

---

## Questions to Consider

- Do you need different permission levels (admin vs user)?
- Will you have external services accessing your API?
- What's your expected request volume for rate limiting?
- Are there any endpoints that should remain public?
