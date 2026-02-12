import { Repository } from '@/types/repository.types';
import { parse } from 'date-fns';

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
export function combineTimeLine(repositories: Repository[]): Article[] {
	if (!repositories || repositories.length === 0) {
		return [];
	}
	const allArticles: Article[] = repositories.flatMap((repo: Repository) => {
		const articles = repo.TLG?.articles || [];
		return articles;
	});
	return allArticles.sort((a, b) => {
		// Parse dd/MM/yyyy format using date-fns
		const dateA = parse(a.date, 'dd/MM/yyyy', new Date());
		const dateB = parse(b.date, 'dd/MM/yyyy', new Date());
		return dateB.getTime() - dateA.getTime();
	});
}

/**
 * Filters articles by date range
 * @param articles - Array of articles
 * @param startDate - Start date (inclusive) in dd/MM/yyyy format
 * @param endDate - End date (inclusive) in dd/MM/yyyy format
 * @returns Filtered array of articles
 */
export function filterArticlesByDateRange(articles: Article[], startDate: string, endDate: string): Article[] {
	const start = parse(startDate, 'dd/MM/yyyy', new Date()).getTime();
	const end = parse(endDate, 'dd/MM/yyyy', new Date()).getTime();

	return articles.filter((article) => {
		const articleDate = parse(article.date, 'dd/MM/yyyy', new Date()).getTime();
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
