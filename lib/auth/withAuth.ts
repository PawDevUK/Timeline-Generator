import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { NextResponse } from 'next/server';

type Handler = (req: Request, context?: any, authData?: { user: any; authType: 'session' | 'apikey' }) => Promise<Response>;

/**
 * Authentication wrapper that supports both:
 * 1. NextAuth session-based auth (for main app)
 * 2. API key authentication (for external apps like portfolio)
 */
export function withAuth(handler: Handler) {
	return async (req: Request, context?: any) => {
		// Check for API key first (for external applications)
		const apiKey = req.headers.get('x-api-key');

		if (apiKey) {
			// Validate API key
			const validApiKeys = process.env.API_KEYS?.split(',') || [];

			if (!validApiKeys.includes(apiKey)) {
				return NextResponse.json({ error: 'Invalid API key' }, { status: 403 });
			}

			// API key is valid - extract user info if provided
			const userId = req.headers.get('x-user-id');

			return handler(req, context, {
				user: { id: userId },
				authType: 'apikey',
			});
		}

		// Fall back to session-based authentication
		const session = await getServerSession(authOptions);

		if (!session || !session.user) {
			return NextResponse.json({ error: 'Unauthorized - Please login or provide valid API key' }, { status: 401 });
		}

		return handler(req, context, {
			user: session.user,
			authType: 'session',
		});
	};
}

/**
 * API key only authentication (no session fallback)
 * Use this for endpoints that should only be accessed via API key
 */
export function withApiKey(handler: Handler) {
	return async (req: Request, context?: any) => {
		const apiKey = req.headers.get('x-api-key');

		if (!apiKey) {
			return NextResponse.json({ error: 'API key required' }, { status: 401 });
		}

		const validApiKeys = process.env.API_KEYS?.split(',') || [];

		if (!validApiKeys.includes(apiKey)) {
			return NextResponse.json({ error: 'Invalid API key' }, { status: 403 });
		}

		const userId = req.headers.get('x-user-id');

		return handler(req, context, {
			user: { id: userId },
			authType: 'apikey',
		});
	};
}
