import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/db';
import { Article } from '@/lib/db/models/article.model';
import { AddArticle, Get_DB_AllArticles } from '@/lib/db/articles.db';

// GET - Get all articles
export async function GET() {
	try {
		await dbConnect();
		const result = await Get_DB_AllArticles(Article);

		if (!result.success) {
			return NextResponse.json({ error: result.error }, { status: 500 });
		}

		return NextResponse.json({ articles: result.data }, { status: 200 });
	} catch (error) {
		console.error('Error in GET /api/articles:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

// POST - Create a new article
export async function POST(request: NextRequest) {
	try {
		await dbConnect();
		const body = await request.json();
		const { title, date, description } = body;

		// Validate required fields
		if (!title || !date || !description) {
			return NextResponse.json({ error: 'Missing required fields: title, date, description' }, { status: 400 });
		}

		const result = await AddArticle(Article, { title, date, description });

		if (!result.success) {
			return NextResponse.json({ error: result.error }, { status: 500 });
		}

		return NextResponse.json({ article: result.data }, { status: 201 });
	} catch (error) {
		console.error('Error in POST /api/articles:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
