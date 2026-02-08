import { NextRequest, NextResponse } from 'next/server';
import { createRepository } from './createRepo';
import { GetAllRepositories } from '@/app/api/db/repository.db';
import { dbConnect } from '../db/db';

export const maxDuration = 300; // 5 minutes timeout

export async function POST(request: NextRequest) {
	try {
		// Parse and validate request body
		let body;
		try {
			body = await request.json();
		} catch (parseError) {
			console.error('Error parsing request JSON:', parseError);
			return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
		}

		const { user, repo } = body;

		// Validate required fields
		if (!user || typeof user !== 'string' || user.trim() === '') {
			console.error('Invalid or missing user field:', user);
			return NextResponse.json({ error: 'Missing or invalid required field: user (must be non-empty string)' }, { status: 400 });
		}

		if (!repo || typeof repo !== 'string' || repo.trim() === '') {
			console.error('Invalid or missing repo field:', repo);
			return NextResponse.json({ error: 'Missing or invalid required field: repo (must be non-empty string)' }, { status: 400 });
		}

		const trimmedUser = user.trim();
		const trimmedRepo = repo.trim();

		console.log(`Generating articles for user: ${trimmedUser}, repo: ${trimmedRepo}`);

		// Start the process without awaiting
		createRepository(trimmedUser, trimmedRepo)
			.then((result) => console.log(`Completed: ${result.data.articles.length} articles`))
			.catch((err) => console.error('Background generation failed:', err));

		// Return immediately
		return NextResponse.json(
			{
				message: 'Article generation started',
				status: 'processing',
			},
			{ status: 202 },
		); // 202 Accepted
	} catch (error) {
		console.error('Unexpected error in POST /api/articles/generate:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json({ error: `Internal server error: ${errorMessage}` }, { status: 500 });
	}
}

export async function GET() {
	await dbConnect();
	try {
		const result = await GetAllRepositories();
		if (!result.success) {
			return NextResponse.json({ error: result.error }, { status: 500 });
		}
		return NextResponse.json({ articles: result.data }, { status: 200 });
	} catch (error) {
		console.error('Error in GET /api/articles:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
