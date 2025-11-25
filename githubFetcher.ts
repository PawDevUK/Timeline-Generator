export interface GitCommit {
	hash: string;
	author: string;
	date: Date;
	message: string;
	files: string[];
	insertions: number;
	deletions: number;
}

export interface GitHubCommitResponse {
	sha: string;
	commit: {
		author: {
			name: string;
			email: string;
			date: string;
		};
		message: string;
	};
	author: {
		login: string;
	} | null;
	stats?: {
		additions: number;
		deletions: number;
		total: number;
	};
	files?: Array<{
		filename: string;
		status: string;
		additions: number;
		deletions: number;
		changes: number;
	}>;
}

export interface RepoConfig {
	owner: string;
	repo: string;
	token?: string;
}

/**
 * Parse GitHub repository URL to extract owner and repo name
 * @param url - GitHub repository URL (e.g., https://github.com/owner/repo or owner/repo)
 * @returns Object with owner and repo, or null if invalid
 */
export const parseGitHubUrl = (url: string): { owner: string; repo: string } | null => {
	// Handle owner/repo format
	if (!url.includes('/') || url.split('/').length < 2) {
		return null;
	}

	// Remove .git suffix if present
	const cleanUrl = url.replace(/\.git$/, '');

	// Handle full URL
	if (cleanUrl.includes('github.com')) {
		const match = cleanUrl.match(/github\.com[/:]([\w-]+)\/([\w-]+)/);
		if (match) {
			return { owner: match[1], repo: match[2] };
		}
	} else {
		// Handle owner/repo format
		const parts = cleanUrl.split('/');
		if (parts.length >= 2) {
			return { owner: parts[parts.length - 2], repo: parts[parts.length - 1] };
		}
	}

	return null;
};

/**
 * Fetch commits from GitHub API for a specific repository
 * @param config - Repository configuration with owner, repo, and optional token
 * @param since - ISO 8601 date string (e.g., '2025-11-25T00:00:00Z')
 * @param author - Optional: filter by GitHub username
 * @returns Array of commits with their details
 */
export const getGitHubCommits = async (config: RepoConfig, since: string, author?: string): Promise<GitCommit[]> => {
	const { owner, repo, token } = config;
	const baseUrl = `https://api.github.com/repos/${owner}/${repo}/commits`;

	try {
		// Build query parameters
		const params = new URLSearchParams({
			since: new Date(since).toISOString(),
			per_page: '100',
		});

		if (author) {
			params.append('author', author);
		}

		// Make initial request to get commits list
		const headers: HeadersInit = {
			Accept: 'application/vnd.github.v3+json',
		};

		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		const response = await fetch(`${baseUrl}?${params}`, { headers });

		if (!response.ok) {
			throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
		}

		const commitsData: GitHubCommitResponse[] = await response.json();

		// Fetch detailed information for each commit (including file stats)
		const detailedCommits = await Promise.all(
			commitsData.map(async (commit) => {
				try {
					const detailResponse = await fetch(`${baseUrl}/${commit.sha}`, { headers });

					if (!detailResponse.ok) {
						// If we can't get details, return basic info
						return {
							hash: commit.sha,
							author: commit.commit.author.name,
							date: new Date(commit.commit.author.date),
							message: commit.commit.message,
							files: [],
							insertions: 0,
							deletions: 0,
						};
					}

					const detailData: GitHubCommitResponse = await detailResponse.json();

					return {
						hash: detailData.sha,
						author: detailData.commit.author.name,
						date: new Date(detailData.commit.author.date),
						message: detailData.commit.message,
						files: detailData.files?.map((f) => f.filename) || [],
						insertions: detailData.stats?.additions || 0,
						deletions: detailData.stats?.deletions || 0,
					};
				} catch (error) {
					console.error(`Error fetching commit details for ${commit.sha}:`, error);
					return {
						hash: commit.sha,
						author: commit.commit.author.name,
						date: new Date(commit.commit.author.date),
						message: commit.commit.message,
						files: [],
						insertions: 0,
						deletions: 0,
					};
				}
			})
		);

		return detailedCommits;
	} catch (error) {
		console.error(`Error fetching commits from ${owner}/${repo}:`, error);
		throw error;
	}
};

/**
 * Get git changes from multiple remote repositories
 * @param repoUrls - Array of GitHub repository URLs or owner/repo strings
 * @param since - Date string (ISO format or relative like '2025-11-25')
 * @param token - GitHub personal access token for authentication
 * @param author - Optional: filter by GitHub username
 * @returns Map of repository names to their commits
 */
export const fetchMultipleRepos = async (repoUrls: string[], since: string, token: string, author?: string): Promise<Map<string, GitCommit[]>> => {
	const changes = new Map<string, GitCommit[]>();

	// Process repositories in parallel
	const results = await Promise.allSettled(
		repoUrls.map(async (url) => {
			const parsed = parseGitHubUrl(url);
			if (!parsed) {
				throw new Error(`Invalid GitHub URL: ${url}`);
			}

			const commits = await getGitHubCommits({ ...parsed, token }, since, author);

			return { url, commits };
		})
	);

	// Process results
	for (const result of results) {
		if (result.status === 'fulfilled') {
			const { url, commits } = result.value;
			if (commits.length > 0) {
				changes.set(url, commits);
			}
		} else {
			console.error(`Failed to fetch commits:`, result.reason);
		}
	}

	return changes;
};
