// import repos from '../articles/repoList';
'use client';
import { fetchRepoList } from '../lib/api/getReposList';
import { useEffect, useState } from 'react';
import { RepoList } from '../types/repoList.types';
import RepoCard from '../Components/RepoCard';

export default function Home() {
	const [repos, setRepos] = useState<RepoList[]>([]);
	const [user, setUser] = useState('PawDevUk');

	useEffect(() => {
		const fetchData = async () => {
			const repoList = await fetchRepoList(user);
			setRepos(repoList);
		};
		fetchData();
	}, [user]);

	// useEffect(() => {
	// 	console.log(repos);
	// }, [repos]);

	const addTracking = (repo: RepoList) => {
		setRepos((prevRepos) =>
			prevRepos.map((stored_repo) => (stored_repo.id === repo.id ? { ...stored_repo, TLG: { ...stored_repo.TLG, tracking: !stored_repo.TLG.tracking } } : stored_repo))
		);
	};

	return (
		<div className='py-8 lg:pr-8 flex-1 w-full lg:border-r border-gray-300 self-stretch'>
			<div className='flex flex-col  gap-6'>
				<div className='w-full text-center md:text-left md:pl-[100px]'>
					<h3 className='text-2xl font-semibold'>List of Repositories.</h3>
				</div>
				<div className='flex justify-center pt-2'>
					<div className='bg-white rounded-lg shadow p-4 sm:w-[50vw]'>
						<div className='flex flex-col gap-4'>
							{repos.map((repo: RepoList) => (
								<RepoCard key={repo.id} repo={repo} addTracking={addTracking}></RepoCard>
							))}
						</div>
						<p className='text-xs text-gray-400 mt-4'>
							{/* Missing Git repository? <span className='text-blue-500 underline cursor-pointer'>Adjust GitHub App Permissions →</span> */}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
