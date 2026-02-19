import axios from 'axios';
import { NextResponse } from 'next/server';
import { GitHubCommit } from '@/types/commits.types';

const token = process.env.GITHUB_TOKEN;

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const user = searchParams.get('user');
	const repoName = searchParams.get('repoName');
	const since = searchParams.get('since');
	const until = searchParams.get('until');

	if (!user) {
		return NextResponse.json({ error: 'No user selected.' }, { status: 400 });
	}
	if (!repoName) {
		return NextResponse.json({ error: 'No repoName selected.' }, { status: 400 });
	}
	if (!since || !until) {
		return NextResponse.json({ error: 'since and until are required.' }, { status: 400 });
	}

	try {
		const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
		if (token) headers.Authorization = `Bearer ${token}`;

		const sinceDate = new Date(since);
		const tillNowDate = new Date(until);

		if (Number.isNaN(sinceDate.getTime()) || Number.isNaN(tillNowDate.getTime())) {
			return NextResponse.json({ error: 'Invalid date format. Use ISO date strings for since and until.' }, { status: 400 });
		}

		const sinceUtc = `${sinceDate.getUTCFullYear()}-${String(sinceDate.getUTCMonth() + 1).padStart(2, '0')}-${String(sinceDate.getUTCDate()).padStart(2, '0')}T00:00:00Z`;
		const tillNowUtc = `${tillNowDate.getUTCFullYear()}-${String(tillNowDate.getUTCMonth() + 1).padStart(2, '0')}-${String(tillNowDate.getUTCDate()).padStart(2, '0')}T23:59:59Z`;

		const response = await axios.get(`https://api.github.com/repos/${user}/${repoName}/commits?since=${sinceUtc}&until=${tillNowUtc}`, {
			headers,
		});

		const dayCommits = response.data.map((com: GitHubCommit) => ({
			title: repoName,
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
			console.error(`Error fetching commits for ${user}/${repoName}:`, status, message);
			return NextResponse.json({ error: message }, { status });
		}
		console.error('Unexpected error in getRepoDayCommits:', (error as Error).message ?? error);
		const message = error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
