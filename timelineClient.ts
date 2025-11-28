import { Article } from './articles/article.type';
import { GitCommit, getGitHubCommits, fetchMultipleRepos, parseGitHubUrl, RepoConfig } from './API/githubFetcher';

/**
 * Get git changes from multiple remote repositories
 * @param repoUrls - Array of GitHub repository URLs or owner/repo strings
 * @param since - Date string (ISO format or relative like '2025-11-25')
 * @param token - GitHub personal access token for authentication
 * @param author - Optional: filter by GitHub username
 * @returns Map of repository names to their commits
 */
export const getGitChanges = async (repoUrls: string[], since: string, token: string, author?: string): Promise<Map<string, GitCommit[]>> => {
	return fetchMultipleRepos(repoUrls, since, token, author);
};

/**
 * Generate a summary of git changes
 * @param commits - Array of commits to summarize
 * @returns Summary string
 */
export const generateCommitSummary = (commits: GitCommit[]): string => {
	const totalInsertions = commits.reduce((sum, c) => sum + c.insertions, 0);
	const totalDeletions = commits.reduce((sum, c) => sum + c.deletions, 0);
	const totalFiles = new Set(commits.flatMap((c) => c.files)).size;

	const summary = `
Total commits: ${commits.length}
Total files changed: ${totalFiles}
Total insertions: ${totalInsertions}
Total deletions: ${totalDeletions}

Commits:
${commits.map((c) => `- ${c.message} (${c.date.toLocaleString()})`).join('\n')}
	`.trim();

	return summary;
};

console.log(getGitChanges('https://github.com/PawDevUK/Portfolio-react.git', '24/11/25', 'null'));

export { GitCommit, RepoConfig, getGitHubCommits, parseGitHubUrl };
