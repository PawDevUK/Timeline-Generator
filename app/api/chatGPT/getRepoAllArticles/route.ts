import { NextResponse } from 'next/server';
import OpenAI from 'openai';
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
		const { searchParams } = new URL(request.url);
		const user = searchParams.get('user');
		const repo = searchParams.get('repo');
		const tone = searchParams.get('tone') || 'professional';
		const length = searchParams.get('length') || 'short';

		const dayStr = searchParams.get('day');
		const monthStr = searchParams.get('month');
		const yearStr = searchParams.get('year');

		const day = dayStr ? parseInt(dayStr, 10) : null;
		const month = monthStr ? parseInt(monthStr, 10) : null;
		const year = yearStr ? parseInt(yearStr, 10) : null;

		const params = { user, repo, tone, length, year, month, day };

		for (const [name, value] of Object.entries(params)) {
			if (!value) {
				return NextResponse.json({ error: `Missing ${name} parameter` }, { status: 400 });
			}
		}

		const origin = new URL(request.url).origin;

		// Use the local getRepoCommits endpoint and filter by the requested date
		const allCommits: Array<{ repo: string; author: string | null; date: string; message: string }> = [];
		const commits = await fetchJson(`${origin}/api/getRepoCommits?user=${user}&repo=${repo}&year=${year}&month=${month}&day=${day}`);

		function getDate(year: number, month: number, day: number) {
			return format(new Date(year, month - 1, day), 'MM/dd/yyyy');
		}

		const date = getDate(year!, month!, day!);

		if (Array.isArray(commits)) {
			for (const c of commits) {
				if (!c?.date) continue;
				allCommits.push({ repo: c.title || repo, author: c.author || null, date: c.date, message: c.description || '' });
			}
		}

		if (allCommits.length === 0) {
			return NextResponse.json({ summary: 'No commits found for selected date.' });
		}

		// Build bullets
		const bullets = allCommits.map((c, i) => `${i + 1}. [${c.repo}] ${c.message} (${c.author || 'unknown'} - ${new Date(c.date).toLocaleTimeString()})`);

		const titleHint = searchParams.get('title') || repo || '';

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
			// fallback: construct a minimal article using aggregated commits
			const combinedDesc = allCommits.map((c) => `- [${c.repo}] ${c.message} (${c.author || 'unknown'})`).join('\n');
			const fallbackArticle = {
				title: titleHint,
				date: date,
				description: `Unable to parse AI response; fallback summary generated from commits:\n${combinedDesc}`,
			};
			return NextResponse.json({ commits: allCommits, article: fallbackArticle, rawAI: content });
		}

		// Basic validation / normalization
		const article = parsed as { title?: string; date?: string; description?: string };
		if (!article.title) article.title = titleHint;
		if (!article.date) article.date = date;
		if (!article.description) article.description = '';

		return NextResponse.json({ article });
	} catch (error: unknown) {
		console.error('Error in GET /api/chatGPT:', error);
		const message = error instanceof Error ? error.message : 'Unknown error';
		const stack = error instanceof Error ? error.stack : undefined;
		return NextResponse.json({ error: message, details: stack }, { status: 500 });
	}
}
