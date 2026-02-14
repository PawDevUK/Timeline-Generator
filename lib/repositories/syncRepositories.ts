// import axios from 'axios';
// import { Repository } from '../db/models/repository.model';
import { dbConnect } from '../db/db';
import { generateDayArticle } from '../chatGPT/generateDayArticle';
import { GetAllRepositories } from '@/lib/db/repository.db';
import { isValid, parse } from 'date-fns';

// const token = process.env.GITHUB_TOKEN;

type Commit = {
	title: string;
	author?: string;
	date?: string;
	description?: string;
};

const parseArticleDate = (value: string): Date | null => {
	if (!value) return null;

	if (value.includes('T')) {
		const iso = new Date(value);
		if (isValid(iso)) return iso;
	}

	const parsed = parse(value, 'dd/MM/yyyy', new Date());
	if (isValid(parsed)) return parsed;

	const fallback = new Date(value);
	return isValid(fallback) ? fallback : null;
};

export async function syncRepository(baseUrl: string) {
	await dbConnect();

	try {
		const repositoriesResult = await GetAllRepositories();

		if (!repositoriesResult.success || !repositoriesResult.data) {
			throw new Error(repositoriesResult.error || 'Failed to load repositories from DB');
		}

		for (const repository of repositoriesResult.data) {
			const user = repository.owner.login;
			const repoName = repository.name;

			// 1) Get latest article date from repository.TLG.articles[]
			const articleDates = (repository.TLG?.articles ?? [])
				.map((article) => article.date)
				.filter((d): d is string => Boolean(d))
				.map((d) => parseArticleDate(d))
				.filter((d): d is Date => Boolean(d));

			const latestArticleDate = articleDates.length > 0 ? new Date(Math.max(...articleDates.map((d) => d.getTime()))) : new Date(repository.created_at); // fallback when no articles exist

			const since = latestArticleDate.toISOString();

			// i need to follow this url pattern. I need to use const since and create new const now which will scope commits between dates.
			// This is the format I need to follow. "since=${year}-${month}-${day}T00:00:00Z&until=${year}-${month}-${day}T23:59:59Z"
			const params = new URLSearchParams({
				user,
				repoName,
				since,
				tillNow: new Date().toISOString(),
			});

			const url = new URL('/api/gitHub/getRepoDayCommits', baseUrl);
			url.search = params.toString();

			const res = await fetch(url.toString(), {
				method: 'GET',
				headers: { Accept: 'application/json' },
			});

			if (!res.ok) throw new Error(`Request failed: ${res.status}`);
			const data = await res.json();

			// Group articles by dates.
			// loop over data commits and create date array and add commits to this array
			const groupedCommits = (data as Commit[]).reduce<Record<string, Commit[]>>((acc, commit) => {
				if (!commit.date) return acc;

				const day = new Date(commit.date).toISOString().slice(0, 10); // YYYY-MM-DD
				if (!acc[day]) acc[day] = [];
				acc[day].push(commit);

				return acc;
			}, {});

			const existingArticleDates = new Set(
				(repository.TLG?.articles ?? [])
					.map((article) => article.date)
					.filter((d): d is string => Boolean(d))
					.map((d) => parseArticleDate(d))
					.filter((d): d is Date => Boolean(d))
					.map((d) => d.toISOString().slice(0, 10)),
			);

			// 5. Generate articles for new dates only
			const newArticles = [];

			for (const [date, dayCommits] of Object.entries(groupedCommits)) {
				if (existingArticleDates.has(date)) {
					console.log(`Skipping ${date} for ${user}/${repoName} - article already exists`);
					continue;
				}
				console.log(`Generating article for ${date} with ${dayCommits.length} commits`);
				const article = await generateDayArticle(dayCommits, repoName, date);
				newArticles.push(article);
			}

			if (newArticles.length === 0) {
				console.log(`No new articles to add for ${user}/${repoName}`);
				const uniqueDays = new Set((repository.TLG?.articles ?? []).map((article) => article.date).filter((d): d is string => Boolean(d)));
				repository.TLG.daysActiveCommits = uniqueDays.size;
				repository.TLG.lastSyncedAt = new Date();
				await repository.save();
				continue;
			}

			// 6. Update repository with new articles
			const latestDate = newArticles.reduce((latest, article) => {
				return article.date > latest ? article.date : latest;
			}, repository.TLG?.lastArticleDate || '');

			repository.TLG.articles.push(...newArticles);
			repository.TLG.lastSyncedAt = new Date();
			repository.TLG.lastArticleDate = latestDate;
			const uniqueDays = new Set((repository.TLG.articles ?? []).map((article) => article.date).filter((d): d is string => Boolean(d)));
			repository.TLG.daysActiveCommits = uniqueDays.size;
			await repository.save();
			console.log(`Successfully added ${newArticles.length} new articles`);
		}

		return { success: true, message: 'Sync finished' };
	} catch (error) {
		console.error('Error syncing repository:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		};
	}
}
