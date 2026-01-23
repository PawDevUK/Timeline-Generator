import { NextRequest, NextResponse } from 'next/server';
import { getRepoAllArticles } from '@/app/lib/chatGPT/getRepoAllArticles';

// POST - Generate article from GitHub commits and save to DB
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

		// Call the helper function
		let result;
		try {
			result = await getRepoAllArticles(trimmedUser, trimmedRepo);
		} catch (helperError) {
			console.error('Unexpected error from getRepoAllArticles:', helperError);
			return NextResponse.json({ error: 'Failed to generate articles due to internal error' }, { status: 500 });
		}

		// Check result from helper
		if (!result || typeof result !== 'object') {
			console.error('Invalid result from getRepoAllArticles:', result);
			return NextResponse.json({ error: 'Invalid response from article generation service' }, { status: 500 });
		}

		if (!result.success) {
			console.error('getRepoAllArticles failed:', result.error);
			return NextResponse.json({ error: `Failed to generate articles: ${result.error}` }, { status: 500 });
		}

		if (!Array.isArray(result.articles)) {
			console.error('Invalid articles array from getRepoAllArticles:', result.articles);
			return NextResponse.json({ error: 'Invalid articles data received' }, { status: 500 });
		}

		// Construct repository object
		const repository = {
			name: trimmedRepo,
			user: trimmedUser,
			articles: result.articles,
			createdAt: new Date(),
		};

		console.log(`Successfully generated ${result.articles.length} articles for ${trimmedUser}/${trimmedRepo}`);

		return NextResponse.json({ repository }, { status: 200 });
	} catch (error) {
		console.error('Unexpected error in POST /api/articles/generate:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json({ error: `Internal server error: ${errorMessage}` }, { status: 500 });
	}
}
