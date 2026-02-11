import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of allowed origins
const allowedOrigins = [
	'https://pawelsiwek.co.uk',
	'http://localhost:3000', // for local development
];

export function middleware(request: NextRequest) {
	const origin = request.headers.get('origin');

	// Handle preflight requests
	if (request.method === 'OPTIONS') {
		const response = new NextResponse(null, { status: 200 });

		if (origin && allowedOrigins.includes(origin)) {
			response.headers.set('Access-Control-Allow-Origin', origin);
		}

		response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
		response.headers.set('Access-Control-Max-Age', '86400');

		return response;
	}

	// Handle actual requests
	const response = NextResponse.next();

	if (origin && allowedOrigins.includes(origin)) {
		response.headers.set('Access-Control-Allow-Origin', origin);
		response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	}

	return response;
}

// Configure which routes should use this middleware
export const config = {
	matcher: '/api/:path*',
};
