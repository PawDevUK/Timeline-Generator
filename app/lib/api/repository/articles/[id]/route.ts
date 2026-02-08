import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../../../api/db/db';
import { Article } from '../../../../../api/db/models/article.model';
import { GetArticle, EditArticle, DeleteArticle } from '../../../../../api/db/articles.db';

// GET - Get single article by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
	try {
		await dbConnect();
		const resolvedParams = params instanceof Promise ? await params : params;
		const { id } = resolvedParams;

		const result = await GetArticle(Article, id);

		if (!result.success) {
			return NextResponse.json({ error: result.error }, { status: result.error === 'Article not found' ? 404 : 500 });
		}

		return NextResponse.json({ article: result.data }, { status: 200 });
	} catch (error) {
		console.error('Error in GET /api/articles/[id]:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

// PUT - Update article by ID
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
	try {
		await dbConnect();
		const resolvedParams = params instanceof Promise ? await params : params;
		const { id } = resolvedParams;
		const body = await request.json();
		const { title, date, description } = body;

		// Create updates object with only provided fields
		const updates: Partial<{ title: string; date: string; description: string }> = {};
		if (title !== undefined) updates.title = title;
		if (date !== undefined) updates.date = date;
		if (description !== undefined) updates.description = description;

		if (Object.keys(updates).length === 0) {
			return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
		}

		const result = await EditArticle(Article, id, updates);

		if (!result.success) {
			return NextResponse.json({ error: result.error }, { status: result.error === 'Article not found' ? 404 : 500 });
		}

		return NextResponse.json({ article: result.data }, { status: 200 });
	} catch (error) {
		console.error('Error in PUT /api/articles/[id]:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

// DELETE - Delete article by ID
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
	try {
		await dbConnect();
		const resolvedParams = params instanceof Promise ? await params : params;
		const { id } = resolvedParams;

		const result = await DeleteArticle(Article, id);

		if (!result.success) {
			return NextResponse.json({ error: result.error }, { status: result.error === 'Article not found' ? 404 : 500 });
		}

		return NextResponse.json({ message: 'Article deleted successfully', article: result.data }, { status: 200 });
	} catch (error) {
		console.error('Error in DELETE /api/articles/[id]:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
