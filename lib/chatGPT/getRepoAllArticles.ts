import axios from 'axios';
import { generateDayArticle } from './generateDayArticle';

// Add handling non existin repo.
// Add handling requesting to get duplicate reposittory with time line.

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

// {
// 							title: trimmedRepo,
// 							author: resp.data.commit?.author?.name,
// 							date: resp.data.commit?.author?.date,
// 							description: com.commit?.message,
// 						}

export async function getRepoAllArticles(user: string, repo: string) {
	// Input validation
	if (!user || typeof user !== 'string' || user.trim() === '') {
		console.error('Invalid user parameter:', user);
		return { success: false, error: 'Invalid user parameter: must be non-empty string' };
	}

	if (!repo || typeof repo !== 'string' || repo.trim() === '') {
		console.error('Invalid repo parameter:', repo);
		return { success: false, error: 'Invalid repo parameter: must be non-empty string' };
	}

	const trimmedUser = user.trim();
	const trimmedRepo = repo.trim();

	console.log(`Starting article generation for ${trimmedUser}/${trimmedRepo}`);

	const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
	if (token) {
		headers.Authorization = `Bearer ${token}`;
	} else {
		console.warn('No GITHUB_TOKEN provided - API rate limits may apply');
	}

	try {
		const perPage = 100;
		const maxPages = 100; // safety cap

		const allData: GitHubCommit[] = [];
		let totalCommits = 0;

		for (let page = 1; page <= maxPages; page++) {
			try {
				const params: Record<string, string> = { per_page: String(perPage), page: String(page) };

				console.log(`Fetching page ${page} of commits for ${trimmedUser}/${trimmedRepo}`);

				const resp = await axios.get(`https://api.github.com/repos/${trimmedUser}/${trimmedRepo}/commits`, {
					headers,
					params,
					timeout: 30000, // 30 second timeout
				});

				if (resp.status !== 200) {
					console.error(`GitHub API returned status ${resp.status}:`, resp.data);
					return { success: false, error: `GitHub API error: ${resp.status} - ${resp.data?.message || 'Unknown error'}` };
				}

				const pageData = Array.isArray(resp.data) ? resp.data : [];
				if (pageData.length === 0) {
					console.log(`No more commits found at page ${page}`);
					break;
				}

				allData.push(...pageData);
				totalCommits += pageData.length;
				console.log(`Fetched ${pageData.length} commits from page ${page}, total: ${totalCommits}`);

				if (pageData.length < perPage) {
					console.log(`Reached last page with ${pageData.length} commits`);
					break;
				}
			} catch (axiosError) {
				if (axios.isAxiosError(axiosError)) {
					console.error('Axios error fetching commits:', axiosError.message);
					if (axiosError.response) {
						const status = axiosError.response.status;
						const message = axiosError.response.data?.message || 'Unknown API error';
						if (status === 404) {
							return { success: false, error: `Repository ${trimmedUser}/${trimmedRepo} not found` };
						} else if (status === 403) {
							return { success: false, error: 'GitHub API rate limit exceeded or access denied' };
						} else if (status === 401) {
							return { success: false, error: 'GitHub API authentication failed' };
						} else {
							return { success: false, error: `GitHub API error ${status}: ${message}` };
						}
					} else if (axiosError.code === 'ECONNABORTED') {
						return { success: false, error: 'GitHub API request timed out' };
					} else {
						return { success: false, error: `Network error: ${axiosError.message}` };
					}
				} else {
					console.error('Unexpected error during API call:', axiosError);
					return { success: false, error: 'Unexpected error during GitHub API call' };
				}
			}
		}

		console.log(`Total commits fetched: ${totalCommits}`);

		if (allData.length === 0) {
			console.log('No commits found for repository');
			return { success: true, articles: [] };
		}

		// Map to commits and reverse order (oldest first)
		let commits: Commit[];
		try {
			commits = allData
				.map((com: GitHubCommit) => {
					if (!com || !com.commit) {
						console.warn('Invalid commit data structure:', com);
						return {};
					}
					const dateStr: string | undefined = com.commit?.author?.date || com.commit?.committer?.date;
					return {
						title: trimmedRepo,
						author: com.commit?.author?.name,
						date: dateStr,
						description: com.commit?.message,
					};
				})
				.filter((c): c is Commit => c !== null);
			// Sort commits from oldest to newest
			commits.sort((a, b) => {
				if (!a.date || !b.date) return 0;
				return new Date(a.date).getTime() - new Date(b.date).getTime();
			});
		} catch (mapError) {
			console.error('Error mapping commit data:', mapError);
			return { success: false, error: 'Failed to process commit data' };
		}

		console.log(`Mapped ${commits.length} valid commits (sorted oldest to newest)`);

		// Group commits by date
		const groups: Record<string, Commit[]> = {};
		let groupedCount = 0;
		for (const c of commits) {
			if (!c.date) {
				console.warn('Commit missing date:', c);
				continue;
			}
			try {
				const key = new Date(c.date).toISOString().slice(0, 10);
				if (!groups[key]) groups[key] = [];
				groups[key].push(c);
				groupedCount++;
			} catch (dateError) {
				console.warn('Error processing commit date:', c.date, dateError);
			}
		}

		console.log(`Grouped ${groupedCount} commits into ${Object.keys(groups).length} days`);

		// Generate articles for each day
		const articles = [];
		let successCount = 0;
		let errorCount = 0;

		for (const [date, dayCommits] of Object.entries(groups)) {
			try {
				console.log(`Generating article for ${date} with ${dayCommits.length} commits`);
				const article = await generateDayArticle(dayCommits, trimmedRepo, date);
				if (article) {
					articles.push(article);
					successCount++;
				} else {
					console.error(`generateDayArticle returned null for ${date}`);
					errorCount++;
				}
			} catch (articleError) {
				console.error(`Error generating article for ${date}:`, articleError);
				errorCount++;
				// Continue with other days
			}
		}

		console.log(`Article generation complete: ${successCount} successful, ${errorCount} errors`);

		return { success: true, articles };
	} catch (error) {
		console.error('Unexpected error in getRepoAllArticles:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return { success: false, error: `Unexpected error: ${errorMessage}` };
	}
}
