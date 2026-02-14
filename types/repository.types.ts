export type Repository = {
	id: number;
	node_id: string;
	name: string;
	full_name: string;
	private: boolean;
	owner: {
		login: string;
		id: number;
	};
	html_url: string;
	url: string;
	created_at: string;
	updated_at: string;
	pushed_at: string;
	date: string;
	language: string;
	TLG: {
		tracking: boolean;
		daysActiveCommits: number;
		articles: {
			title: string;
			date: string;
			description: string;
			createdAt: Date;
		}[];
		lastSyncedAt?: Date;
		lastArticleDate?: string;
	};
};
