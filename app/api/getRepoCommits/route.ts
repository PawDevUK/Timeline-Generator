import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const user = searchParams.get('user');
	const repo = searchParams.get('repo');

	if (!user) {
		return NextResponse.json({ error: 'No user selected.' }, { status: 400 });
	}
	if (!repo) {
		return NextResponse.json({ error: 'No repo selected.' }, { status: 400 });
	}

	try {
		const response = await axios.get(`https://api.github.com/repos/${user}/${repo}/commits`);
		type GitHubCommit = {
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

		const commits = response.data.map((com: GitHubCommit) => ({
			title: repo,
			author: com.commit?.author?.name,
			date: com.commit?.author.date,
			updates: {
				period: null,
				description: com.commit?.message,
			},
		}));

		return NextResponse.json(commits);
	} catch (error) {
		return NextResponse.json({ error: (error as Error).message }, { status: 500 });
	}
}
