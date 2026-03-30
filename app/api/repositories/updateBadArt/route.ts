import { NextRequest, NextResponse } from 'next/server';
import { GetAllRepositories } from '@/lib/db/repository.db';
import { dbConnect } from '@/lib/db/db';
import { callOpenAI } from '@/lib/chatGPT/callOpenAI/callOpenAI';
import { systemPrompt, getUserPrompt } from './prompts';

export async function POST(request: NextRequest) {
	// Function needs to fetch article and send it to OpenAI for validation.
	// With set of rules/prompts it needs check if article is structuree in correct way.
	await dbConnect();
	try {
		const openAIresponse = await callOpenAI(getUserPrompt, systemPrompt, article);
		console.log(openAIresponse);
		const allRepos = await GetAllRepositories();
		const responsArr = [];
		if (allRepos.success && allRepos.data) {
			console.log('Fetched Repositories');
			for (const repo of allRepos.data) {
				for (const article of repo.TLG.articles) {
					const openAIresponse = await callOpenAI(getUserPrompt, systemPrompt, article.description);
					console.log(openAIresponse);
					responsArr.push(openAIresponse);
				}
			}
		}
		// if (!result.success) {
		// 	return NextResponse.json({ error: result.error }, { status: 500 });
		// }
		// const timeline = combineTimeLine(result.data || []);

		return NextResponse.json(openAIresponse, { status: 200 });
	} catch (error) {
		console.error('Error in GET /api/timeline:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
