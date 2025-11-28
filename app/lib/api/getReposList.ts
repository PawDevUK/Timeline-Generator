export async function fetchRepoList(user: string) {
	const res = await fetch(`/api/getUserRepoList?user=${user}`);
	if (!res.ok) throw new Error('Failed to fetch repo list');
	return res.json();
}
