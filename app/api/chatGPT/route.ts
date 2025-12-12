import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { systemPrompt, getUserPrompt } from './prompts';

const openai = new OpenAI({ apiKey: process.env.CHATGPT_API || '' });

async function fetchJson(url: string) {
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
	}
	return res.json();
}

function isSameDay(dateStr: string, now = new Date()) {
	const d = new Date(dateStr);
	return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

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

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const user = searchParams.get('user');
		const repo = searchParams.get('repo');
		const since = searchParams.get('since');
		const until = searchParams.get('until');
		const tone = searchParams.get('tone') || 'professional';
		const length = searchParams.get('length') || 'short';

		if (!user) {
			return NextResponse.json({ error: 'Missing user parameter' }, { status: 400 });
		}
		if (!repo) {
			return NextResponse.json({ error: 'Missing repo parameter' }, { status: 400 });
		}

		const origin = new URL(request.url).origin;

		// Use the local getRepoCommits endpoint and filter by the requested date
		const allCommits: Array<{ repo: string; author: string | null; date: string; message: string }> = [];
		const commits = await fetchJson(`${origin}/api/getRepoCommits?user=${user}&repo=${repo}${since ? `&since=${since}` : ''}${until ? `&until=${until}` : ''}`);
		let filterDate: Date | null = null;
		if (since) {
			// Use 'since' as the filter date (YYYY-MM-DD or ISO)
			filterDate = new Date(since);
		}
		if (Array.isArray(commits)) {
			for (const c of commits) {
				if (!c?.date) continue;
				if (!filterDate || isSameDay(c.date, filterDate)) {
					allCommits.push({ repo: c.title || repo, author: c.author || null, date: c.date, message: c.description || '' });
				}
			}
		}

		if (allCommits.length === 0) {
			return NextResponse.json({ summary: 'No commits found for selected date.' });
		}

		// Build bullets
		const bullets = allCommits.map((c, i) => `${i + 1}. [${c.repo}] ${c.message} (${c.author || 'unknown'} - ${new Date(c.date).toLocaleTimeString()})`);

		const titleHint = searchParams.get('title') || repo;
		const dateParam = searchParams.get('date') || '';
		// Use filterDate if available, otherwise fallback to today
		let dateObj: Date;
		if (dateParam) {
			dateObj = new Date(dateParam);
		} else if (since) {
			dateObj = new Date(since);
		} else {
			dateObj = new Date();
		}
		const dateStr = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${String(dateObj.getFullYear()).slice(2)}`;

		const completion = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: getUserPrompt(titleHint, dateStr, tone, length, bullets) },
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
				date: dateStr,
				description: `Unable to parse AI response; fallback summary generated from commits:\n${combinedDesc}`,
			};
			return NextResponse.json({ commits: allCommits, article: fallbackArticle, rawAI: content });
		}

		// Basic validation / normalization
		const article = parsed as { title?: string; date?: string; description?: string };
		if (!article.title) article.title = titleHint;
		if (!article.date) article.date = dateStr;
		if (!article.description) article.description = '';

		return NextResponse.json({ article });
	} catch (error: unknown) {
		console.error('Error in GET /api/chatGPT:', error);
		const message = error instanceof Error ? error.message : 'Unknown error';
		const stack = error instanceof Error ? error.stack : undefined;
		return NextResponse.json({ error: message, details: stack }, { status: 500 });
	}
}
