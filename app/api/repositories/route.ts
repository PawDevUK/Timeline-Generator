import { NextRequest, NextResponse } from 'next/server';
import { createRepository } from '@/lib/repositories/createRepo';
import { GetAllRepositories } from '@/lib/db/repository.db';
import checkApiKey from '@/app/utils/checkApiKey';
import { dbConnect } from '@/lib/db/db';
const TLG_API_KEY = process.env.TLG_API_KEY;

export const maxDuration = 300; // 5 minutes timeout

export async function POST(request: NextRequest) {
	if (!checkApiKey(request, TLG_API_KEY)) {
		return NextResponse.json({ error: 'Unauthorized: Invalid API key' }, { status: 401 });
	}

	try {
		let body;
		try {
			body = await request.json();
		} catch (parseError) {
			console.error('Error parsing request JSON:', parseError);
			return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
		}

		const { user, repo } = body;

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

		createRepository(trimmedUser, trimmedRepo)
			.then((result) => console.log(`Completed: ${result.data.TLG.articles.length} articles`))
			.catch((err) => console.error('Background generation failed:', err));

		return NextResponse.json(
			{
				message: 'Article generation started',
				status: 'processing',
			},
			{ status: 202 },
		);
	} catch (error) {
		console.error('Unexpected error in POST /api/articles/generate:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json({ error: `Internal server error: ${errorMessage}` }, { status: 500 });
	}
}

// Gets all repositories from Data Base.
export async function GET() {
	await dbConnect();
	try {
		const result = await GetAllRepositories();
		if (!result.success) {
			return NextResponse.json({ error: result.error }, { status: 500 });
		}
		return NextResponse.json({ repositories: result.data }, { status: 200 });
	} catch (error) {
		console.error('Error in GET /api/articles:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
