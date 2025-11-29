import { RepoList } from '../types/repoList.types';
import { format } from 'date-fns';
import Button from './Button';

export default function RepoCard({ repo, addTracking }: { repo: RepoList; addTracking: (repo: RepoList) => void }) {
	return (
		<div key={repo.id} className='flex items-center justify-between border-b border-gray-200 pb-4 last:border-b-0 '>
			<div className='flex items-center gap-4'>
				{/* {repo.iconUrl && <img src={repo.iconUrl} alt={repo.name} className='w-6 h-6 rounded' />} */}
				<div>
					<span className='font-medium text-lg text-[#0969da]'>{repo.name}</span>
					<span className='mx-2 text-gray-400'>·</span>
					<span className='text-gray-500'>{format(new Date(repo.updated_at), 'dd MMM yy HH:mm')}</span>
					{/* {repo.description && <div className='text-sm text-gray-400'>{repo.description}</div>} */}
				</div>
			</div>

			<Button addTracking={addTracking} repo={repo}></Button>
		</div>
	);
}
