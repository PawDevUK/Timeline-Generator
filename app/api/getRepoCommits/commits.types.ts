export type GitHubCommit = {
	commit: {
		title: string;
		author: {
			name: string;
			date: string;
		};
		message: string;
		updates: [period: string, description: string];
	};
};
