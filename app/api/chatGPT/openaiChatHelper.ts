// openaiChatHelper.ts
type TimelineArticle = {
	title: string;
	date: string;
	summary: string;
	bullets: string[];
	highlights?: string[];
	tags?: string[];
	estimated_reading_time_minutes?: number;
	tone?: 'neutral' | 'professional' | 'casual' | 'enthusiastic';
	length?: 'short' | 'medium' | 'long';
};

const FUNCTION_SCHEMA = {
	name: 'generate_timeline_article',
	description: 'Produce a short, human-friendly timeline article from compact bullets/notes. Return a JSON object matching the parameters.',
	parameters: {
		type: 'object',
		properties: {
			title: { type: 'string', description: 'Concise title for the article (5-10 words).' },
			date: { type: 'string', description: 'ISO date for the article (YYYY-MM-DD).' },
			summary: { type: 'string', description: 'A short summary paragraph (40-80 words).' },
			bullets: { type: 'array', items: { type: 'string' }, description: 'Compact bullet points (1-sentence each).' },
			highlights: { type: 'array', items: { type: 'string' }, description: '1-3 notable highlights.' },
			tags: { type: 'array', items: { type: 'string' }, description: 'Suggested short tags or labels (max 6).' },
			estimated_reading_time_minutes: { type: 'integer', description: 'Estimated reading time in minutes.' },
			tone: { type: 'string', enum: ['neutral', 'professional', 'casual', 'enthusiastic'] },
			length: { type: 'string', enum: ['short', 'medium', 'long'] },
		},
		required: ['title', 'date', 'summary', 'bullets'],
	},
};

async function callChatCompletionWithFunction({
	apiKey,
	model = 'gpt-4o-mini',
	systemPrompt,
	userPrompt,
	bullets,
	date,
	tone = 'professional',
	length = 'short',
	maxTokens = 500,
}: {
	apiKey: string;
	model?: string;
	systemPrompt: string;
	userPrompt: string; // include bullets/metadata
	bullets: string[];
	date: string; // YYYY-MM-DD
	tone?: string;
	length?: string;
	maxTokens?: number;
}): Promise<{ article?: TimelineArticle; raw?: any; fallbackText?: string }> {
	const endpoint = 'https://api.openai.com/v1/chat/completions';

	const messages = [
		{ role: 'system', content: systemPrompt },
		{
			role: 'user',
			content: `${userPrompt}\n\nMetadata:\n- date: ${date}\n- tone: ${tone}\n- length: ${length}\n\nBullets:\n${bullets.map((b, i) => `${i + 1}. ${b}`).join('\n')}`,
		},
	];

	const body = {
		model,
		messages,
		functions: [FUNCTION_SCHEMA],
		function_call: 'auto', // prefer function result if model decides to call it
		max_tokens: maxTokens,
		temperature: 0.1,
	};

	const res = await fetch(endpoint, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});

	if (!res.ok) {
		const txt = await res.text();
		throw new Error(`OpenAI API error ${res.status}: ${txt}`);
	}

	const j = await res.json();

	const choice = j.choices?.[0];
	const msg = choice?.message;

	// If model returned a function call, parse args
	if (msg?.function_call) {
		try {
			const argsText = msg.function_call.arguments;
			const parsed = JSON.parse(argsText);
			return { article: parsed as TimelineArticle, raw: j };
		} catch (err) {
			return { fallbackText: msg.function_call.arguments, raw: j };
		}
	}

	// Fallback: model returned plain content
	const content = msg?.content;
	if (content) {
		// Try to parse JSON blocks inside content (best-effort)
		const jsonMatch = content.match(/\\{[\\s\\S]*\\}/);
		if (jsonMatch) {
			try {
				const parsed = JSON.parse(jsonMatch[0]);
				return { article: parsed as TimelineArticle, raw: j };
			} catch {}
		}
		return { fallbackText: content, raw: j };
	}

	return { raw: j };
}
