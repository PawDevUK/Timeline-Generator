import { NextRequest, NextResponse } from 'next/server';
import { GetAllRepositories } from '@/lib/db/repository.db';
import { dbConnect } from '@/lib/db/db';
import { callOpenAI } from '@/lib/chatGPT/callOpenAI/callOpenAI';
import { systemPrompt, getUserPrompt } from './prompts';
import { Types } from 'mongoose';
const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
import { Repository } from '@/lib/db/models/repository.model';
export async function POST(request: NextRequest) {
	// Function needs to fetch article and send it to OpenAI for validation.
	// With set of rules/prompts it needs check if article is structuree in correct way.
	await dbConnect();
	try {
		const allRepos = await GetAllRepositories();
		if (allRepos.success && allRepos.data) {
			console.log('Fetched Repositories');
			for (const repo of allRepos.data) {
				for (const article of repo.TLG.articles as { _id?: Types.ObjectId; description: string }[]) {
					const openAIresponse = await callOpenAI(getUserPrompt, systemPrompt, article.description);
					const resJson = JSON.parse(openAIresponse);

					if (resJson.articleNeedsUpdate) {
						console.log('Updating article:', resJson);
						await fetch(`${baseUrl}/api/repositories/articles/${article._id}`, {
							method: 'PUT',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								description: resJson.updatedText,
							}),
						}).then((res) => console.log(res));
					}
				}
			}
		}
		if (!allRepos.success) {
			return NextResponse.json({ error: allRepos.error }, { status: 500 });
		}

		return NextResponse.json('All repositories are updated.', { status: 200 });
	} catch (error) {
		console.error('Error in GET /api/timeline:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
