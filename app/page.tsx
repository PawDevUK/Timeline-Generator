import repos from '../articles/repoList';

// RepoList.tsx
import React from 'react';

export default function Home() {
	return (
		<div className='py-8 lg:pr-8 flex-1 w-full lg:border-r border-gray-300 self-stretch'>
			<div className='flex flex-col gap-6'>
				<h3 className='text-2xl font-semibold'>List of Repositories.</h3>
				<div className='flex justify-center pt-12'>
					<div className='bg-white rounded-lg shadow p-4 w-[50vw]'>
						<div className='flex flex-col gap-4'>
							{repos.map((repo) => (
								<div key={repo.name} className='flex items-center justify-between border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:mb-0'>
									<div className='flex items-center gap-4'>
										{repo.iconUrl && <img src={repo.iconUrl} alt={repo.name} className='w-6 h-6 rounded' />}
										<div>
											<span className='font-medium text-lg'>{repo.name}</span>
											<span className='mx-2 text-gray-400'>·</span>
											<span className='text-gray-500'>{repo.date}</span>
											{repo.description && <div className='text-sm text-gray-400'>{repo.description}</div>}
										</div>
									</div>
									{repo.importUrl && (
										<a href={repo.importUrl} className='px-3 py-1 bg-gray-900 text-white rounded hover:bg-gray-700 text-sm'>
											Track
										</a>
									)}
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
