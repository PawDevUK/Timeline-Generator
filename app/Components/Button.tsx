import { RepoList } from '../types/repoList.types';
import styled from 'styled-components';

const StyledButton = styled.a<{ tracking?: boolean }>`
	width: 5rem;
	padding: 0.5rem 1rem;
	border-radius: 0.375rem;
	text-align: center;
	font-size: 0.875rem;
	cursor: pointer;
	color: ${({ tracking }) => (tracking ? 'white' : 'rgb(37, 41, 46)')};
	background-color: ${({ tracking }) => (tracking ? 'rgb(31, 136, 61)' : 'rgb(246, 248, 250)')};
	border: 1px solid rgb(209, 217, 224);
	transition: background-color 0.2s;

	&:hover {
		background-color: ${({ tracking }) => (tracking ? 'rgb(31, 136, 61)' : 'rgb(237, 237, 238)')};
	}
`;

export default function Button({ repo, addTracking }: { repo: RepoList; addTracking: (repo: RepoList) => void }) {
	return (
		<StyledButton tracking={repo.TLG?.tracking} onClick={() => addTracking(repo)}>
			{repo.TLG?.tracking ? 'Tracking' : 'Track'}
		</StyledButton>
	);
}
