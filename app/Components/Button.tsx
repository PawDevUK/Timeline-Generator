import { RepoList } from '../types/repoList.types';
const greenButton = {
	backgroundColor: 'rgb(31, 136, 61)',
	color: 'white',
};
const whiteButton = {
	backgroundColor: 'rgb(246, 248, 250)',
	color: 'rgb(37, 41, 46)',
};

export default function Button({ repo, addTracking }: { repo: RepoList; addTracking: (repo: RepoList) => void }) {
	return (
		<a onClick={() => addTracking(repo)} style={repo.TLG?.tracking ? greenButton : whiteButton} className='w-20 px-3 py-1 rounded text-sm cursor-pointer text-center'>
			{repo.TLG?.tracking ? 'Tracking' : 'Track'}
		</a>
	);
}
