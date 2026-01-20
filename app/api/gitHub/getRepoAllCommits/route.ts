import axios from 'axios';
import { NextResponse } from 'next/server';

const token = process.env.GITHUB_TOKEN;

// Add groupCommits:true/false to get commits grouped or list of commits for a day or all of them.
// I need to add functionality to check if groupCommits:true and only user && repo then create the object with grouped commits by days.

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const userParam = searchParams.get('user');
	const repoParam = searchParams.get('repo');
	const maxPagesParam = searchParams.get('maxPages');

	// Sanitize inputs to avoid malformed URLs
	const sanitize = (s: string) => s.replace(/[^A-Za-z0-9._-]/g, '');
	const user = userParam ? sanitize(userParam) : null;
	const repo = repoParam ? sanitize(repoParam) : null;

	if (!user) {
		return NextResponse.json({ error: 'No user selected.' }, { status: 400 });
	}
	if (!repo) {
		return NextResponse.json({ error: 'No repo selected.' }, { status: 400 });
	}

	// This endpoint fetches all commits from inception; no date filters are used.

	const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
	if (token) headers.Authorization = `Bearer ${token}`;

	type FlatCommit = {
		title: string;
		author?: string;
		date?: string;
		description?: string;
	};

	// Minimal shape of the GitHub commits API response needed for our mapping
	interface GitHubCommitApi {
		commit?: {
			author?: { name?: string; date?: string };
			committer?: { date?: string };
			message?: string;
		};
	}

	try {
		const perPage = 100;
		const defaultCap = 100; // safety cap: up to 10,000 commits
		const maxPages = Math.min(Math.max(parseInt(maxPagesParam || String(defaultCap), 10) || defaultCap, 1), 100);

		const allData: GitHubCommitApi[] = [];
		let pagesFetched = 0;
		for (let page = 1; page <= maxPages; page++) {
			const params: Record<string, string> = { per_page: String(perPage), page: String(page) };

			const resp = await axios.get(`https://api.github.com/repos/${user}/${repo}/commits`, {
				headers,
				params,
			});

			const pageData = Array.isArray(resp.data) ? (resp.data as GitHubCommitApi[]) : [];
			if (pageData.length === 0) break; // stop early if no more results
			allData.push(...pageData);
			pagesFetched++;
			if (pageData.length < perPage) break; // last page reached
		}

		const commits: FlatCommit[] = allData.map((com: GitHubCommitApi) => {
			const dateStr: string | undefined = com.commit?.author?.date || com.commit?.committer?.date;
			return {
				title: repo!,
				author: com.commit?.author?.name,
				date: dateStr,
				description: com.commit?.message,
			};
		});

		// Always group by YYYY-MM-DD for this endpoint
		const groups: Record<string, FlatCommit[]> = {};
		for (const c of commits) {
			if (!c.date) continue; // skip unknown dates
			const key = new Date(c.date).toISOString().slice(0, 10);
			if (!groups[key]) groups[key] = [];
			groups[key].push(c);
		}

		return NextResponse.json({ groups, uniqueDays: Object.keys(groups).length, total: commits.length, pagesFetched });
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
		console.error('Unexpected error in getRepoAllCommits:', (error as Error).message ?? error);
		const message = error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
