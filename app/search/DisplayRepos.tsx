interface Repository {
	id: number;
	name: string;
	description?: string;
	language?: string;
	stargazers_count?: number;
}

interface DisplayReposProps {
	results: Repository[];
}

export default function DisplayRepos({ results }: DisplayReposProps) {
	if (!results) {
		return (
			<div className=' card-panel mt-6 w-full flex-none'>
				<p className='text-gray-500'>Select a repository to view details</p>
			</div>
		);
	}

	return (
		<div className=' card-panel mt-6 w-full flex-none'>
			<h3 className='text-xl font-semibold mb-4'>Search Results</h3>

			{results.length > 0 && (
				<div className='space-y-2'>
					<p className='text-sm text-gray-600 mb-3'>Found {results.length} repositories</p>
					<div className='max-h-96 overflow-y-auto space-y-2'>
						{results.map((repo: Repository) => (
							<button
								key={repo.id}
								// onClick={() => onSelectRepo(repo)}
								className='w-full text-left p-3 border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300 transition'>
								<div className='font-medium text-gray-900'>{repo.name}</div>
								{repo.description && <div className='text-sm text-gray-600 mt-1'>{repo.description}</div>}
								<div className='text-xs text-gray-500 mt-1'>
									{repo.language && <span className='mr-3'>📝 {repo.language}</span>}
									<span>⭐ {repo.stargazers_count || 0}</span>
								</div>
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
