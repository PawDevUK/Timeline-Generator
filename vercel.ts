const config = {
	cron: [
		{
			path: '/api/repositories/sync',
			schedule: '55 23 * * *',
		},
	],
};

export default config;
