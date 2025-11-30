import axios from 'axios';
import { NextResponse } from 'next/server';
import { GitHubCommit } from '../../types/commits.types';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const user = searchParams.get('user');
	const repo = searchParams.get('repo');
	const since = searchParams.get('since');
	const until = searchParams.get('until');

	if (!user) {
		return NextResponse.json({ error: 'No user selected.' }, { status: 400 });
	}
	if (!repo) {
		return NextResponse.json({ error: 'No repo selected.' }, { status: 400 });
	}

	try {
		const token = process.env.GITHUB_TOKEN;
		const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
		if (token) headers.Authorization = token;

		const response = await axios.get(`https://api.github.com/repos/${user}/${repo}/commits?since=${since}&until=${until}`, { headers });
		console.log(response);
		const commits = response.data.map((com: GitHubCommit) => ({
			title: repo,
			author: com.commit?.author?.name,
			date: com.commit?.author.date,
			description: com.commit?.message,
		}));

		return NextResponse.json(commits);
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
		console.error('Unexpected error in getRepoCommits:', (error as Error).message ?? error);
		const message = error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
