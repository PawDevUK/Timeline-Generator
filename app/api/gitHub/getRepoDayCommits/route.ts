import axios from 'axios';
import { NextResponse } from 'next/server';
import { GitHubCommit } from '../../../types/commits.types';

<<<<<<< HEAD
=======
const token = process.env.GITHUB_TOKEN;

// Add groupCommits:true/false to get commits grouped or list of commits for a day or all of them.
// I need to add functionality to check if groupCommits:true and only user && repo then create the object with grouped commits by days.

>>>>>>> f7f4fe0dd441d105fe2050d1dafeb8748eb691f2
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const user = searchParams.get('user');
	const repo = searchParams.get('repo');
<<<<<<< HEAD
	const year = searchParams.get('year');
	const month = searchParams.get('month');
	const day = searchParams.get('day');
=======
>>>>>>> f7f4fe0dd441d105fe2050d1dafeb8748eb691f2

	if (!user) {
		return NextResponse.json({ error: 'No user selected.' }, { status: 400 });
	}
	if (!repo) {
		return NextResponse.json({ error: 'No repo selected.' }, { status: 400 });
	}

<<<<<<< HEAD
=======
<<<<<<<< HEAD:app/api/gitHub/getRepoCommits/route.ts
>>>>>>> f7f4fe0dd441d105fe2050d1dafeb8748eb691f2
	try {
		const token = process.env.GITHUB_TOKEN;
		const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
		if (token) headers.Authorization = `Bearer ${token}`;
<<<<<<< HEAD
		const response = await axios.get(`https://api.github.com/repos/${user}/${repo}/commits?since=${year}-${month}-${day}T00:00:00Z&until=${year}-${month}-${day}T23:59:59Z`, {
			headers,
		});
		const commits = response.data.map((com: GitHubCommit) => ({
=======

		// Fetch all commits using pagination
		let allCommits: GitHubCommit[] = [];
		let page = 1;
		let hasMore = true;

		while (hasMore) {
			const response = await axios.get(`https://api.github.com/repos/${user}/${repo}/commits`, {
				headers,
				params: {
					per_page: 100, // Maximum allowed per page
					page: page,
				},
			});

			if (response.data.length === 0) {
				hasMore = false;
			} else {
				allCommits = allCommits.concat(response.data);
				page++;

				// If we got less than 100, we've reached the end
				if (response.data.length < 100) {
					hasMore = false;
				}
			}
		}

		const commits = allCommits.map((com: GitHubCommit) => ({
>>>>>>> f7f4fe0dd441d105fe2050d1dafeb8748eb691f2
			title: repo,
			author: com.commit?.author?.name,
			date: com.commit?.author.date,
			description: com.commit?.message,
		}));
<<<<<<< HEAD

		return NextResponse.json(commits);
=======
========
	const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
	if (token) headers.Authorization = `Bearer ${token}`;
>>>>>>>> f7f4fe0dd441d105fe2050d1dafeb8748eb691f2:app/api/gitHub/getRepoDayCommits/route.ts

	const response = await axios.get(`https://api.github.com/repos/${user}/${repo}/commits?since=${year}-${month}-${day}T00:00:00Z&until=${year}-${month}-${day}T23:59:59Z`, {
		headers,
	});

	const dayCommits = response.data.map((com: GitHubCommit) => ({
		title: repo,
		author: com.commit?.author?.name,
		date: com.commit?.author.date,
		description: com.commit?.message,
	}));

	try {
		return NextResponse.json(dayCommits);
>>>>>>> f7f4fe0dd441d105fe2050d1dafeb8748eb691f2
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
