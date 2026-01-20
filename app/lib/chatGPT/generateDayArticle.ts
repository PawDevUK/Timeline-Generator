import OpenAI from 'openai';
import { systemPrompt, getUserPrompt } from './prompts';

const openai = new OpenAI({ apiKey: process.env.CHATGPT_API || '' });

interface Commit {
	title: string;
	author?: string;
	date?: string;
	description?: string;
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

export async function generateDayArticle(commits: Commit[], repo: string, date: string, tone: string = 'professional', length: string = 'short') {
	if (commits.length === 0) {
		return {
			title: `${repo} - No Activity`,
			date,
			description: 'No commits found for this day.',
			createdAt: new Date(),
		};
	}

	const bullets = commits.map((c, i) => `${i + 1}. [${c.title}] ${c.description} (${c.author || 'unknown'} - ${new Date(c.date!).toLocaleTimeString()})`);

	const titleHint = repo;

	const completion = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		messages: [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: getUserPrompt(titleHint, date, tone, length, bullets) },
		],
		max_tokens: 800,
		temperature: 0.2,
	});

	const content = completion.choices?.[0]?.message?.content ?? '';

	const parsed = tryParseJSON(content);
	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		const combinedDesc = commits.map((c) => `- [${c.title}] ${c.description} (${c.author || 'unknown'})`).join('\n');
		return {
			title: titleHint,
			date,
			description: `Unable to parse AI response; fallback summary:\n${combinedDesc}`,
			createdAt: new Date(),
		};
	}

	const article = parsed as { title?: string; date?: string; description?: string };
	if (!article.title) article.title = titleHint;
	if (!article.date) article.date = date;
	if (!article.description) article.description = '';

	return {
		title: article.title,
		date: article.date,
		description: article.description,
		createdAt: new Date(),
	};
}
