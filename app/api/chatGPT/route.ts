import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
	apiKey: process.env.CHATGPT_API || '',
});

export async function GET(request: Request) {
	try {
		// Example: hardcoded prompt and bullets for demo
		const systemPrompt = 'You are a concise technical writer. Output only valid JSON.';
		const userPrompt = 'Please write a short timeline article.';
		const bullets = ['Fix navbar mobile routing issue', 'Add metrics endpoint at api/metrics.js', 'CI build pipeline optimised; ~30% faster'];
		const date = '2025-11-29';
		const tone = 'professional';
		const length = 'short';

		// Call OpenAI Chat Completions
		const completion = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: `${userPrompt}\nDate: ${date}\nTone: ${tone}\nLength: ${length}\nBullets:\n${bullets.map((b, i) => `${i + 1}. ${b}`).join('\n')}` },
			],
			max_tokens: 500,
			temperature: 0.2,
		});

		// Return the result as JSON
		return NextResponse.json({ result: completion.choices[0].message.content });
	} catch (error: any) {
		return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
	}
}
