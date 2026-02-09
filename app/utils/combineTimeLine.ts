import { RepoList } from '@/types/repoList.types';

type Article = {
	_id?: string;
	title: string;
	date: string;
	description: string;
	createdAt?: Date;
	repositoryName?: string;
	repositoryUser?: string;
};

/**
 * Combines articles from multiple repositories into a single timeline sorted by date
 * @param repositories - Array of repositories containing articles
 * @returns Array of articles sorted by date (newest first)
 */
export function combineTimeLine(repositories: RepoList[]): Article[] {
	if (!repositories || repositories.length === 0) {
		return [];
	}

	// Flatten all articles from all repositories
	const allArticles: Article[] = repositories.flatMap((repo) =>
		(repo.TLG?.articles || []).map((article) => ({
			...article,
			repositoryName: repo.name,
			repositoryUser: repo.owner?.login || '',
		})),
	);

	// Sort by date (newest first)
	return allArticles.sort((a, b) => {
		const dateA = new Date(a.date).getTime();
		const dateB = new Date(b.date).getTime();
		return dateB - dateA;
	});
}

/**
 * Filters articles by date range
 * @param articles - Array of articles
 * @param startDate - Start date (inclusive)
 * @param endDate - End date (inclusive)
 * @returns Filtered array of articles
 */
export function filterArticlesByDateRange(articles: Article[], startDate: string, endDate: string): Article[] {
	const start = new Date(startDate).getTime();
	const end = new Date(endDate).getTime();

	return articles.filter((article) => {
		const articleDate = new Date(article.date).getTime();
		return articleDate >= start && articleDate <= end;
	});
}

/**
 * Groups articles by date
 * @param articles - Array of articles
 * @returns Object with dates as keys and arrays of articles as values
 */
export function groupArticlesByDate(articles: Article[]): Record<string, Article[]> {
	return articles.reduce(
		(acc, article) => {
			const date = article.date;
			if (!acc[date]) {
				acc[date] = [];
			}
			acc[date].push(article);
			return acc;
		},
		{} as Record<string, Article[]>,
	);
}
