import axios, { AxiosError } from 'axios';
import { NextResponse } from 'next/server';
// Get list of active days of the repo
//      get user
//      get repo
//      fetch activities
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const user = searchParams.get('user');
	const repo = searchParams.get('repo');

	if (!user || !repo) {
		return NextResponse.json({ error: 'Missing user or repo parameter' }, { status: 400 });
	}

	// Clean up repo name - remove any extra characters

	const url = `https://api.github.com/repos/${user}/${repo}/activity`;
	const token = process.env.GITHUB_TOKEN;

	try {
		console.log('Fetching from:', url);
		const response = await axios.get(url, {
			headers: token
				? {
						Authorization: `Bearer ${token}`,
						Accept: 'application/vnd.github+json',
						'X-GitHub-Api-Version': '2022-11-28',
				  }
				: {
						Accept: 'application/vnd.github+json',
						'X-GitHub-Api-Version': '2022-11-28',
				  },
		});
		return NextResponse.json(response.data);
	} catch (error: unknown) {
		if (error instanceof AxiosError) {
			console.error('GitHub API error:', error.response?.status, error.response?.data || error.message);
			return NextResponse.json(
				{
					error: error.message,
					status: error.response?.status,
					details: error.response?.data,
				},
				{ status: 500 }
			);
		} else if (error instanceof Error) {
			console.error('GitHub API error:', error.message);
			return NextResponse.json(
				{
					error: error.message,
				},
				{ status: 500 }
			);
		}
		return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
	}
}
