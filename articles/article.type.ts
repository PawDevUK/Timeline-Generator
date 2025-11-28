export type Article = {
	title: string;
	date: string;
	updates: Array<{
		period: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
		description: string;
	}>;
};
