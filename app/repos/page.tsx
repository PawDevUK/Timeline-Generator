'use client';
import { useEffect, useState } from 'react';
import { Repository } from '@/types/repository.types';
import RepoCard from '@/app/components/RepoCard';
import PageBaseLayout from '@/app/components/PageBaseLayout';

export default function Repos() {
	const [repos, setRepos] = useState<Repository[]>([]);
	// const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchRepos = async () => {
			// setLoading(true);
			setError('');
			try {
				const response = await fetch('api/repositories');
				const data = await response.json();
				setRepos(data.repositories || []);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to fetch repositories');
				console.error('Error fetching repos:', err);
			} finally {
				// setLoading(false);
			}
		};

		fetchRepos();
	}, []);

	useEffect(() => {
		console.log(repos);
	}, [repos]);

	const addTracking = (repo: Repository) => {
		setRepos((prevRepos) =>
			prevRepos.map((stored_repo) => (stored_repo.id === repo.id ? { ...stored_repo, TLG: { ...stored_repo.TLG, tracking: !stored_repo.TLG.tracking } } : stored_repo)),
		);
	};

	return (
		<PageBaseLayout>
			<div className=''>
				<div className=''>
					<div className='w-full card-panel text-center md:text-left md:pl-[100px]'>
						<h3 className='text-2xl font-bold text-gray-900 mb-2 text-center'>List of Tracked Repositories</h3>
						{error && <p className='text-sm text-red-500'>{error}</p>}
					</div>
					<div className='flex justify-center  mt-6 card-panel'>
						<div className='bg-white rounded-lg w-full'>
							<div className='flex flex-col gap-4'>
								{repos.length > 0 ? (
									repos.map((repo: Repository, i) => <RepoCard key={i} repo={repo} addTracking={addTracking}></RepoCard>)
								) : (
									<p className='text-gray-500 text-center'>No repositories found</p>
								)}
							</div>
							<p className='text-xs text-gray-400 mt-4 text-center'>Total repositories: {repos.length}</p>
						</div>
					</div>
				</div>
			</div>
		</PageBaseLayout>
	);
}
