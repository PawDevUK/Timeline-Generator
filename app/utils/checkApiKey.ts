import { NextRequest } from 'next/server';

export default function checkApiKey(request: NextRequest, apiKey: string | undefined): boolean {
	const requestApiKey = request.headers.get('x-api-key');
	return requestApiKey === apiKey;
}
