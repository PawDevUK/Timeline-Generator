import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../db/db';
import { Article } from '../../db/models/article.model';
import { AddArticle } from '../../db/articles.db';

// POST - Generate article from GitHub commits and save to DB
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { user, repo, year, month, day } = body;

		// Validate required fields
		if (!user || !repo || !year || !month || !day) {
			return NextResponse.json({ error: 'Missing required fields: user, repo, year, month, day' }, { status: 400 });
		}

		// Step 1: Fetch commits from GitHub
		const commitsUrl = `http://localhost:3000/api/getRepoCommits?user=${user}&repo=${repo}&year=${year}&month=${month}&day=${day}`;
		const commitsResponse = await fetch(commitsUrl);

		if (!commitsResponse.ok) {
			return NextResponse.json({ error: 'Failed to fetch commits' }, { status: 500 });
		}

		const commitsData = await commitsResponse.json();
		if (!commitsData || !Array.isArray(commitsData) || commitsData.length === 0) {
			return NextResponse.json({ error: 'No commits found for the specified date' }, { status: 404 });
		}

		// Step 2: Generate summary using ChatGPT
		const chatGPTUrl = new URL(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/chatGPT`);
		chatGPTUrl.searchParams.append('user', user);
		chatGPTUrl.searchParams.append('repo', repo);
		chatGPTUrl.searchParams.append('year', year);
		chatGPTUrl.searchParams.append('month', month);
		chatGPTUrl.searchParams.append('day', day);

		const chatGPTResponse = await fetch(chatGPTUrl.toString());

		if (!chatGPTResponse.ok) {
			const errorText = await chatGPTResponse.text();
			console.error('ChatGPT API error:', errorText);
			return NextResponse.json({ error: 'Failed to generate summary', details: errorText }, { status: 500 });
		}

		const summaryData = await chatGPTResponse.json();
		const { title, description, date } = summaryData.article;

		// Step 3: Save to database
		await dbConnect();
		const result = await AddArticle(Article, {
			title: title,
			date: date,
			description: description,
		});

		if (!result.success) {
			return NextResponse.json({ error: result.error }, { status: 500 });
		}

		return NextResponse.json(
			{
				message: 'Article generated and saved successfully',
				article: result.data,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error in POST /api/articles/generate:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
