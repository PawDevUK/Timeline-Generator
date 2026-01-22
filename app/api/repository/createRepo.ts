// This module needs:
//      - Create repository object with name selected by the user
//      - It needs to fetch all commits header from the selected repository
//      - It needs create articles from commits
//      - It needs save the articles to DB as the repostiory object with info mentioned above.
// This module is a back end module
// Steps:
//  - Create object
//  - Fetch all commits from day one and save them to object.
//  - Loop over all days and create summary for each day.
//  - Save each day to the object.
//  - Save the all object to DB. Object should be accessible via id

import axios from 'axios';
import { Repository } from '../db/models/repository.model';
import { AddRepository } from '../db/repository.db';
import { dbConnect } from '../db/db';
import { generateDayArticle } from '../../lib/chatGPT/generateDayArticle';

const token = process.env.GITHUB_TOKEN;

interface Commit {
	title: string;
	author?: string;
	date?: string;
	description?: string;
}

interface GitHubCommitApi {
	commit?: {
		author?: { name?: string; date?: string };
		committer?: { date?: string };
		message?: string;
	};
}

export async function createRepository(user: string, repo: string) {
	await dbConnect();

	const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
	if (token) headers.Authorization = `Bearer ${token}`;

	try {
		const perPage = 100;
		const maxPages = 100; // safety cap

		const allData: GitHubCommitApi[] = [];
		for (let page = 1; page <= maxPages; page++) {
			const params: Record<string, string> = { per_page: String(perPage), page: String(page) };

			const resp = await axios.get(`https://api.github.com/repos/${user}/${repo}/commits`, {
				headers,
				params,
			});

			const pageData = Array.isArray(resp.data) ? (resp.data as GitHubCommitApi[]) : [];
			if (pageData.length === 0) break;
			allData.push(...pageData);
			if (pageData.length < perPage) break;
		}

		const commits: Commit[] = allData.map((com: GitHubCommitApi) => {
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

		// Create repository object
		const repositoryData = {
			name: repo,
			user,
			articles,
		};

		// Save to DB
		const result = await AddRepository(Repository, repositoryData);
		if (!result.success) {
			throw new Error(result.error);
		}

		return { success: true, data: result.data };
	} catch (error) {
		console.error('Error creating repository:', error);
		return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
	}
}
