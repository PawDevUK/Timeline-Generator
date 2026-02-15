# Security and Safety Guidelines for TLG Project

This document outlines best practices and recommendations to keep your project safe and secure, especially as it grows or becomes public.

## 1. API Key Protection
- Secure sensitive endpoints (such as repository creation) with an API key.
- Never expose or log API keys in client-side code or error messages.

## 2. Rate Limiting
- Implement rate limiting to prevent abuse (e.g., limit requests per minute/hour per IP or API key).
- Helps protect against brute-force and denial-of-service attacks.

## 3. Input Validation & Sanitization
- Always validate and sanitize all incoming data.
- Prevents injection attacks and ensures data integrity.

## 4. Secure Sensitive Data
- Do not log sensitive information (API keys, tokens, user data).
- Store secrets in environment variables, not in code or version control.

## 5. HTTPS Only
- Ensure your API is only accessible over HTTPS.
- Protects data in transit from interception.

## 6. CORS Policy
- Restrict allowed origins if your API is accessed from browsers.
- Prevents unauthorized cross-origin requests.

## 7. Database Security
- Use least-privilege database users.
- Use parameterized queries to prevent SQL injection.
- Keep your database server protected from public access.

## 8. Dependency Updates
- Regularly update dependencies to patch known vulnerabilities.
- Use tools like npm audit or yarn audit.

## 9. Error Handling
- Return generic error messages to clients.
- Log detailed errors on the server for debugging.

## 10. Remove Unused Endpoints
- Disable or remove any endpoints you don’t use.
- Reduces attack surface.

## Additional Recommendations (for public/multi-user projects)
- Add authentication (OAuth, NextAuth, etc.) for user-specific actions.
- Implement audit logging and monitoring.
- Regularly review and test your security posture.

---

By following these guidelines, you help ensure your project remains safe, secure, and maintainable as it evolves.