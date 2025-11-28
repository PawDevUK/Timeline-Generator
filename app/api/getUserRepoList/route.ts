import axios from 'axios';
import { NextResponse } from 'next/server';
import { RepoList } from './repoList.types';

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const user = searchParams.get('user');

		const response = await axios.get(`https://api.github.com/users/${user}/repos`);
		const repos: RepoList = response.data.map((repo: RepoList) => ({
			id: repo.id,
			node_id: repo.node_id,
			name: repo.name,
			full_name: repo.full_name,
			private: repo.private,
			owner: {
				login: repo.owner.login,
				id: repo.owner.id,
			},
			html_url: repo.html_url,
			url: repo.url,
			created_at: repo.created_at,
			updated_at: repo.updated_at,
			pushed_at: repo.pushed_at,
			date: repo.date,
			language: repo.language,
		}));

		return NextResponse.json(repos);
	} catch (error) {
		return NextResponse.json({ error: (error as Error).message }, { status: 500 });
	}
}
