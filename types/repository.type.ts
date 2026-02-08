export type RepositoryType = {
	name: string;
	user: string;
	articles: {
		title: string;
		date: string;
		description: string;
		createdAt: Date;
	}[];
	createdAt: Date;
};
