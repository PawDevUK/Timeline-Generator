'use client';
import { useState } from 'react';
import SearchRepository from '@/app/search/SearchRepository';
import DisplayRepos from '@/app/search/DisplayRepos';
import RepoStatusPanel from './RepoStatusPanel';
import PageBaseLayout from '@/app/components/PageBaseLayout';

interface Repository {
	id: number;
	name: string;
	full_name: string;
	html_url: string;
	description: string | null;
}

export default function Page() {
	const [searchQuery, setSearchQuery] = useState({ user: '', repo: '' });
	const [searchResults, setSearchResults] = useState<Repository[]>([]);
	// const [selectedRepo, setSelectedRepo] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const handleSearch = async (user: string, repo: string) => {
		setLoading(true);
		setError('');
		setSuccess('');
		setSearchQuery({ user, repo });

		try {
			const response = await fetch(`/api/gitHub/getUserRepoList?user=${user}`);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to fetch repositories');
			}
			const data = await response.json();
			setSearchResults(data);
			setSuccess(`Found ${data.length} repositories for ${user}`);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
			setSearchResults([]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<PageBaseLayout>
			<div className='mx-auto flex w-full max-w-7xl items-center justify-between gap-6'>
				<SearchRepository onSearch={handleSearch} loading={loading} error={error} success={success} />
				<RepoStatusPanel />
			</div>
			<DisplayRepos results={searchResults} />
		</PageBaseLayout>
	);
}
