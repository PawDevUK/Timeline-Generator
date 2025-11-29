// import repos from '../articles/repoList';
'use client';
import { fetchRepoList } from './lib/api/getReposList';
import { useEffect, useState } from 'react';
import { RepoList } from './types/repoList.types';
import { format } from 'date-fns';
import Button from './Components/Button';

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
								<div key={repo.id} className='flex items-center justify-between border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:mb-0'>
									<div className='flex items-center gap-4'>
										{/* {repo.iconUrl && <img src={repo.iconUrl} alt={repo.name} className='w-6 h-6 rounded' />} */}
										<div>
											<span className='font-medium text-lg'>{repo.name}</span>
											<span className='mx-2 text-gray-400'>·</span>
											<span className='text-gray-500'>{format(new Date(repo.updated_at), 'dd MMM yy HH:mm')}</span>
											{/* {repo.description && <div className='text-sm text-gray-400'>{repo.description}</div>} */}
										</div>
									</div>

									<Button addTracking={addTracking} repo={repo}></Button>
								</div>
							))}
						</div>
						<p className='text-xs text-gray-400 mt-4'>
							Missing Git repository? <span className='text-blue-500 underline cursor-pointer'>Adjust GitHub App Permissions →</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
