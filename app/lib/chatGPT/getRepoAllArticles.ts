import axios from 'axios';
import { generateDayArticle } from './generateDayArticle';

const token = process.env.GITHUB_TOKEN;

interface Commit {
	title: string;
	author?: string;
	date?: string;
	description?: string;
}

interface GitHubCommit {
	commit: {
		author?: {
			name?: string;
			date?: string;
		};
		committer?: {
			date?: string;
		};
		message?: string;
	};
}

export async function getRepoAllArticles(user: string, repo: string) {
	const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
	if (token) headers.Authorization = `Bearer ${token}`;

	try {
		const perPage = 100;
		const maxPages = 100; // safety cap

		const allData: GitHubCommit[] = [];
		for (let page = 1; page <= maxPages; page++) {
			const params: Record<string, string> = { per_page: String(perPage), page: String(page) };

			const resp = await axios.get(`https://api.github.com/repos/${user}/${repo}/commits`, {
				headers,
				params,
			});

			const pageData = Array.isArray(resp.data) ? resp.data : [];
			if (pageData.length === 0) break;
			allData.push(...pageData);
			if (pageData.length < perPage) break;
		}

		const commits: Commit[] = allData.map((com: GitHubCommit) => {
			const dateStr: string | undefined = com.commit?.author?.date || com.commit?.committer?.date;
			return {
				title: repo,
				author: com.commit?.author?.name,
				date: dateStr,
				description: com.commit?.message,
			};
		});

		// Group commits by date
		const groups: Record<string, Commit[]> = {};
		for (const c of commits) {
			if (!c.date) continue;
			const key = new Date(c.date).toISOString().slice(0, 10);
			if (!groups[key]) groups[key] = [];
			groups[key].push(c);
		}

		// Generate articles for each day
		const articles = [];
		for (const [date, dayCommits] of Object.entries(groups)) {
			const article = await generateDayArticle(dayCommits, repo, date);
			articles.push(article);
		}

		return { success: true, articles };
	} catch (error) {
		console.error('Error getting repo all articles:', error);
		return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
	}
}
