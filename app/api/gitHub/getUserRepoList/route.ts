import axios from 'axios';
import { NextResponse } from 'next/server';
import { Repository } from '@/types/repository.types';
const token = process.env.GITHUB_TOKEN;

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const user = searchParams.get('user');
		const repo = searchParams.get('repo');

		if (!user) {
			return NextResponse.json({ error: 'User parameter is required' }, { status: 400 });
		}

		// If both user and repo are provided, fetch single repository
		if (user && repo) {
			const response = await axios.get<Repository>(`https://api.github.com/repos/${user}/${repo}`, {
				headers: {
					Authorization: token,
				},
			});

			// Single repo response - wrap in array
			const singleRepo: Repository = {
				id: response.data.id,
				node_id: response.data.node_id,
				name: response.data.name,
				full_name: response.data.full_name,
				private: response.data.private,
				owner: {
					login: response.data.owner.login,
					id: response.data.owner.id,
				},
				html_url: response.data.html_url,
				url: response.data.url,
				created_at: response.data.created_at,
				updated_at: response.data.updated_at,
				pushed_at: response.data.pushed_at,
				date: response.data.date,
				language: response.data.language,
				TLG: {
					tracking: false,
					daysActiveCommits: 0,
					articles: [],
				},
			};

			return NextResponse.json([singleRepo]);
		}

		// Otherwise, fetch all user repositories
		const response = await axios.get<Repository[]>(`https://api.github.com/users/${user}/repos?per_page=100`, {
			headers: {
				Authorization: token,
			},
		});

		const repos: Repository[] = response.data.map((repo: Repository) => ({
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
			TLG: {
				tracking: false,
				daysActiveCommits: 0,
				articles: [],
			},
		}));

		return NextResponse.json(repos);
	} catch (error) {
		return NextResponse.json({ error: (error as Error).message }, { status: 500 });
	}
}
