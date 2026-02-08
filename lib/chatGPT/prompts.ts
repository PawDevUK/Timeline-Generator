export const systemPrompt = `You are a concise technical writer and JSON formatter. Output only valid JSON and nothing else.
The required JSON schema is:
{
    "title": "string",
    "date": "string",
    "description": "string"
}
Rules:
- Create one summary description of the all commits for this day.
- Use added, updated, removed, corrected without we, he, us.
- Title: use the title hint or repo name; append a concise topic if possible: "Repo - Feature or Fix".
- Description must be a detailed paragraph summarizing the change (what, files/components touched, reason, and impact). Do not invent facts beyond commits. If limited info is provided, state that details were inferred.
- Do not include any commentary, example, or extra text beyond the JSON object.
- Ignore and do not mention any changes to articles.js, package-lock.json, or ReadMe.md even if present in the commit list.
`;

export function getUserPrompt(titleHint: string, dateStr: string, tone: string, length: string, bullets: string[]) {
	return `Create a JSON article following the schema. Title hint: ${titleHint}. Date: ${dateStr}. Tone: ${tone}. Length: ${length}.
Commits (one per line):\n${bullets.join('\n')}`;
}
