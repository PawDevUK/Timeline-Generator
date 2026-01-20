import { NextResponse } from 'next/server';
import OpenAI from 'openai';
<<<<<<< HEAD:app/api/chatGPT/route.ts
import { systemPrompt, getUserPrompt } from './prompts';
import { format } from 'date-fns';

const openai = new OpenAI({ apiKey: process.env.CHATGPT_API || '' });

type CommitInput = {
	repo?: string;
	author?: string | null;
	date?: string;
	message?: string;
};
=======
import { systemPrompt, getUserPrompt } from '../prompts';
import { format, compareAsc } from 'date-fns';

const openai = new OpenAI({ apiKey: process.env.CHATGPT_API || '' });

async function fetchJson(url: string) {
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
	}
	return res.json();
}

// function getDate(year: number, month: number, day: number) {
// 	return format(new Date(year, month, day), 'MM/dd/yyyy');
// }
>>>>>>> f7f4fe0dd441d105fe2050d1dafeb8748eb691f2:app/api/chatGPT/getRepoAllArticles/route.ts

function extractJsonFromCodeFence(text: string) {
	const fenceRegex = /```(?:json)?\s*([\s\S]*?)```/i;
	const match = text.match(fenceRegex);
	return match ? match[1].trim() : null;
}

function findBalancedBracesJSON(text: string) {
	const firstIndex = text.indexOf('{');
	if (firstIndex === -1) return null;
	let depth = 0;
	for (let i = firstIndex; i < text.length; i++) {
		const ch = text[i];
		if (ch === '{') depth++;
		if (ch === '}') depth--;
		if (depth === 0) {
			return text.substring(firstIndex, i + 1);
		}
	}
	return null;
}

function tryParseJSON(c: string): unknown | null {
	if (!c) return null;
	try {
		return JSON.parse(c);
	} catch {
		const fenced = extractJsonFromCodeFence(c);
		if (fenced) {
			try {
				return JSON.parse(fenced);
			} catch {}
		}
		const sub = findBalancedBracesJSON(c);
		if (sub) {
			try {
				return JSON.parse(sub);
			} catch {}
		}
		return null;
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json().catch(() => null);
		const commits = (body?.commits ?? []) as CommitInput[];
		const titleHint = (body?.titleHint as string) || (body?.repo as string) || '';
		const tone = (body?.tone as string) || 'professional';
		const length = (body?.length as string) || 'short';
		const dateInput = (body?.date as string) || null;

		if (!Array.isArray(commits) || commits.length === 0) {
			return NextResponse.json({ error: 'Missing or empty commits array' }, { status: 400 });
		}

		// Normalize commits
		const normalized = commits
			.filter((c) => c && (c.message || c.repo || c.author || c.date))
			.map((c) => ({
				repo: c.repo || titleHint || 'repo',
				author: c.author ?? null,
				date: c.date || '',
				message: c.message || '',
			}));

		if (normalized.length === 0) {
			return NextResponse.json({ error: 'No usable commits provided' }, { status: 400 });
		}

		const date =
			dateInput ||
			(() => {
				const d = normalized[0]?.date ? new Date(normalized[0].date) : new Date();
				return isNaN(d.getTime()) ? '' : format(d, 'MM/dd/yyyy');
			})();

		const bullets = normalized.map((c, i) => {
			const timeStr = c.date ? new Date(c.date).toLocaleTimeString() : '';
			return `${i + 1}. [${c.repo}] ${c.message} (${c.author || 'unknown'}${timeStr ? ` - ${timeStr}` : ''})`;
		});

		const completion = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: getUserPrompt(titleHint, date || '', tone || '', length || '', bullets) },
			],
			max_tokens: 800,
			temperature: 0.2,
		});

		const content = completion.choices?.[0]?.message?.content ?? '';
		const parsed = tryParseJSON(content);

		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
			const combinedDesc = normalized.map((c) => `- [${c.repo}] ${c.message} (${c.author || 'unknown'})`).join('\n');
			const fallbackArticle = {
				title: titleHint,
				date: date,
				description: `Unable to parse AI response; fallback summary generated from commits:\n${combinedDesc}`,
			};
			return NextResponse.json({ commits: normalized, article: fallbackArticle, rawAI: content });
		}

		const article = parsed as { title?: string; date?: string; description?: string };
		if (!article.title) article.title = titleHint;
		if (!article.date) article.date = date;
		if (!article.description) article.description = '';

		return NextResponse.json({ article });
	} catch (error: unknown) {
		console.error('Error in POST /api/chatGPT:', error);
		const message = error instanceof Error ? error.message : 'Unknown error';
		const stack = error instanceof Error ? error.stack : undefined;
		return NextResponse.json({ error: message, details: stack }, { status: 500 });
	}
}
