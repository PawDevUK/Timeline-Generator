import axios from 'axios';
import { NextResponse } from 'next/server';
import { GitHubCommit } from '../../../../types/commits.types';

const token = process.env.GITHUB_TOKEN;

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const user = searchParams.get('user');
	const repo = searchParams.get('repo');
	const year = searchParams.get('year');
	const month = searchParams.get('month');
	const day = searchParams.get('day');

	if (!user) {
		return NextResponse.json({ error: 'No user selected.' }, { status: 400 });
	}
	if (!repo) {
		return NextResponse.json({ error: 'No repo selected.' }, { status: 400 });
	}
	if (!year || !month || !day) {
		return NextResponse.json({ error: 'Year, month, and day are required.' }, { status: 400 });
	}

	try {
		const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
		if (token) headers.Authorization = `Bearer ${token}`;

		const response = await axios.get(`https://api.github.com/repos/${user}/${repo}/commits?since=${year}-${month}-${day}T00:00:00Z&until=${year}-${month}-${day}T23:59:59Z`, {
			headers,
		});

		const dayCommits = response.data.map((com: GitHubCommit) => ({
			title: repo,
			author: com.commit?.author?.name,
			date: com.commit?.author?.date,
			description: com.commit?.message,
		}));

		return NextResponse.json(dayCommits);
	} catch (error: unknown) {
		if (axios.isAxiosError(error) && error.response) {
			const status = error.response.status || 500;
			interface GitHubErrorResponse {
				message?: string;
			}
			const message = (error.response.data as GitHubErrorResponse)?.message || error.message || 'GitHub API error';
			console.error(`Error fetching commits for ${user}/${repo}:`, status, message);
			return NextResponse.json({ error: message }, { status });
		}
		console.error('Unexpected error in getRepoDayCommits:', (error as Error).message ?? error);
		const message = error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
