import { NextRequest, NextResponse } from 'next/server';
import { getRepoAllArticles } from '@/app/lib/chatGPT/getRepoAllArticles';

// POST - Generate article from GitHub commits and save to DB
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { user, repo } = body;

		if (!user || !repo) {
			return NextResponse.json({ error: 'Missing required fields: user, repo' }, { status: 400 });
		}

		const result = await getRepoAllArticles(user, repo);

		if (!result.success) {
			return NextResponse.json({ error: result.error }, { status: 500 });
		}

		const repository = {
			name: repo,
			user,
			articles: result.articles,
			createdAt: new Date(),
		};

		return NextResponse.json({ repository }, { status: 200 });
	} catch (error) {
		console.error('Error in POST /api/articles/generate:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
