type Repos = {
	name: string;
	description?: string;
	date: string;
	iconUrl?: string;
	importUrl?: string;
};

const repos: Repos[] = [
	{
		name: 'filesconverto',
		date: 'Nov 25',
		iconUrl: 'https://api-frameworks.vercel.sh/framework-logos/next.svg',
		importUrl: '/new/import?=filesconverto',
	},
	{
		name: 'Portfolio-react',
		date: 'Nov 25',
		iconUrl: 'https://api-frameworks.vercel.sh/framework-logos/react.svg',
		importUrl: '/new/import?=Portfolio-react',
	},
	{
		name: 'Portfolio-Server',
		date: 'Nov 14',
		iconUrl: 'https://api-frameworks.vercel.sh/framework-logos/express.svg',
		importUrl: '/new/importe=Portfolio-Server',
	},
];

export default repos;
