import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/db';
import { Repository } from '@/lib/db/models/repository.model';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

// GET - Get single article by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
	try {
		await dbConnect();
		const resolvedParams = params instanceof Promise ? await params : params;
		const { id } = resolvedParams;

		const article = await Repository.findOne(
			{ 'TLG.articles._id': id },
			{
				'TLG.articles.$': 1,
				name: 1,
				owner: 1,
			},
		);

		if (!article) {
			return NextResponse.json({ error: 'No article found' }, { status: 404 });
		}

		return NextResponse.json({ article: article }, { status: 200 });
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

		await Repository.updateOne(
			{
				'TLG.articles._id': id,
			},
			{ $set: { 'TLG.articles.$.description': updates.description, 'TLG.articles.$.createdAt': new Date() } },
		);

		if (Object.keys(updates).length === 0) {
			return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
		}

		return NextResponse.json(
			{
				message: `Article update`,
				payload: updates,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error in PUT /api/articles/[id]:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

// DELETE - Delete article by ID
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user?.isOwner) {
			return NextResponse.json({ error: 'Unauthorized: Owner access required' }, { status: 403 });
		}

		await dbConnect();
		const resolvedParams = params instanceof Promise ? await params : params;
		const { id } = resolvedParams;

		const repository = await Repository.findOne({ 'TLG.articles._id': id });
		if (!repository) {
			return NextResponse.json({ error: 'Article not found' }, { status: 404 });
		}

		const deletedArticle = repository.TLG?.articles?.find((article) => ((article as { _id?: { toString: () => string } })._id?.toString() ?? '') === id);
		repository.TLG.articles = (repository.TLG?.articles ?? []).filter((article) => ((article as { _id?: { toString: () => string } })._id?.toString() ?? '') !== id);

		const uniqueDays = new Set((repository.TLG?.articles ?? []).map((article) => article.date).filter((d): d is string => Boolean(d)));
		repository.TLG.daysActiveCommits = uniqueDays.size;

		await repository.save();

		return NextResponse.json({ message: 'Article deleted successfully', article: deletedArticle ?? null }, { status: 200 });
	} catch (error) {
		console.error('Error in DELETE /api/articles/[id]:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
