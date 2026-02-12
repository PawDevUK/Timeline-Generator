import OpenAI from 'openai';
import { systemPrompt, getUserPrompt } from './prompts';
import { format } from 'date-fns';

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
	// Input validation
	if (!Array.isArray(commits)) {
		console.error('Invalid commits parameter: not an array');
		throw new Error('Commits parameter must be an array');
	}

	if (!repo || typeof repo !== 'string' || repo.trim() === '') {
		console.error('Invalid repo parameter:', repo);
		throw new Error('Repo parameter must be a non-empty string');
	}

	if (!date || typeof date !== 'string' || date.trim() === '') {
		console.error('Invalid date parameter:', date);
		throw new Error('Date parameter must be a non-empty string');
	}

	const trimmedRepo = repo.trim();
	const trimmedDate = format(new Date(date.trim()), 'dd/MM/yyyy');

	// Check OpenAI API key
	if (!process.env.CHATGPT_API || process.env.CHATGPT_API.trim() === '') {
		console.error('CHATGPT_API environment variable not set');
		throw new Error('OpenAI API key not configured');
	}

	console.log(`Generating article for ${trimmedRepo} on ${trimmedDate} with ${commits.length} commits`);

	if (commits.length === 0) {
		console.log('No commits provided, returning default article');
		return {
			title: `${trimmedRepo} - No Activity`,
			date: trimmedDate,
			description: 'No commits found for this day.',
			createdAt: new Date(),
		};
	}

	// Validate commits structure
	const validCommits = commits.filter((c, index) => {
		if (!c || typeof c !== 'object') {
			console.warn(`Invalid commit at index ${index}:`, c);
			return false;
		}
		return true;
	});

	if (validCommits.length === 0) {
		console.warn('No valid commits after filtering');
		return {
			title: `${trimmedRepo} - Invalid Data`,
			date: trimmedDate,
			description: 'No valid commit data found for this day.',
			createdAt: new Date(),
		};
	}

	try {
		const bullets = validCommits.map((c, i) => {
			try {
				const timeStr = c.date ? new Date(c.date).toLocaleTimeString() : 'unknown time';
				return `${i + 1}. [${c.title || 'unknown'}] ${c.description || 'no description'} (${c.author || 'unknown'} - ${timeStr})`;
			} catch (formatError) {
				console.warn('Error formatting commit bullet:', formatError, c);
				return `${i + 1}. [${c.title || 'unknown'}] ${c.description || 'no description'} (${c.author || 'unknown'} - unknown time)`;
			}
		});

		const titleHint = trimmedRepo;

		console.log(`Calling OpenAI API for ${trimmedDate} with ${bullets.length} bullet points`);

		const completion = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: getUserPrompt(titleHint, trimmedDate, tone, length, bullets) },
			],
			max_tokens: 800,
			temperature: 0.2,
		});

		if (!completion || !completion.choices || completion.choices.length === 0) {
			console.error('Invalid OpenAI API response structure:', completion);
			throw new Error('Invalid response from OpenAI API');
		}

		const content = completion.choices[0]?.message?.content;
		if (!content || typeof content !== 'string') {
			console.error('No content in OpenAI response:', completion.choices[0]);
			throw new Error('No content received from OpenAI API');
		}

		console.log(`Received OpenAI response, parsing JSON...`);

		const parsed = tryParseJSON(content);
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
			console.warn('Failed to parse JSON from OpenAI response, using fallback');
			const combinedDesc = validCommits.map((c) => `- [${c.title || 'unknown'}] ${c.description || 'no description'} (${c.author || 'unknown'})`).join('\n');
			return {
				title: titleHint,
				date: trimmedDate,
				description: `Unable to parse AI response; fallback summary:\n${combinedDesc}`,
				createdAt: new Date(),
			};
		}

		const article = parsed as { title?: string; date?: string; description?: string };
		if (!article.title) article.title = titleHint;
		if (!article.date) article.date = trimmedDate;
		if (!article.description) article.description = '';

		console.log(`Successfully generated article: "${article.title}"`);

		return {
			title: article.title,
			date: article.date,
			description: article.description,
			createdAt: new Date(),
		};
	} catch (error) {
		if (error instanceof Error) {
			if (error.message.includes('rate limit') || error.message.includes('authentication') || error.message.includes('model')) {
				console.error('OpenAI API error:', error.message);
				if (error.message.includes('rate limit')) {
					throw new Error('OpenAI API rate limit exceeded');
				} else if (error.message.includes('authentication')) {
					throw new Error('OpenAI API authentication failed');
				} else if (error.message.includes('model')) {
					throw new Error('OpenAI model not available');
				} else {
					throw new Error(`OpenAI API error: ${error.message}`);
				}
			} else {
				console.error('Unexpected error in generateDayArticle:', error);
				throw new Error(`Unexpected error generating article: ${error.message}`);
			}
		} else {
			console.error('Unknown error in generateDayArticle:', error);
			throw new Error('Unknown error generating article');
		}
	}
}
