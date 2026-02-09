'use client';
import { useEffect, useState } from 'react';
import { Repository } from '@/types/repository.types';
import RepoCard from '@/app/components/RepoCard';

export default function Repos() {
	const [repos, setRepos] = useState<Repository[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	// Fetch repos from MongoDB
	useEffect(() => {
		const fetchRepos = async () => {
			setLoading(true);
			setError('');
			try {
				const response = await fetch('api/repositories');
				const repoList = await response.json();
				setRepos(repoList);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to fetch repositories');
				console.error('Error fetching repos:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchRepos();
	}, []);

	// useEffect(() => {
	// 	console.log(repos);
	// }, [repos]);

	const addTracking = (repo: Repository) => {
		setRepos((prevRepos) =>
			prevRepos.map((stored_repo) => (stored_repo.id === repo.id ? { ...stored_repo, TLG: { ...stored_repo.TLG, tracking: !stored_repo.TLG.tracking } } : stored_repo)),
		);
	};

	return (
		<div className='py-8 lg:pr-8 flex-1 w-full lg:border-r border-gray-300 self-stretch'>
			<div className='flex flex-col  gap-6'>
				<div className='w-full text-center md:text-left md:pl-[100px]'>
					<h3 className='text-2xl font-bold text-gray-900 mb-2 text-center'>List of Repositories.</h3>
					{loading && <p className='text-sm text-gray-500'>Loading repositories...</p>}
					{error && <p className='text-sm text-red-500'>{error}</p>}
				</div>
				<div className='flex justify-center pt-2'>
					<div className='bg-white rounded-lg shadow p-4 sm:w-[50vw]'>
						<div className='flex flex-col gap-4'>
							{repos.length > 0 ? (
								repos.map((repo: Repository) => <RepoCard key={repo.id} repo={repo} addTracking={addTracking}></RepoCard>)
							) : (
								<p className='text-gray-500 text-center'>No repositories found</p>
							)}
						</div>
						<p className='text-xs text-gray-400 mt-4 text-center'>Total repositories: {repos.length}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
