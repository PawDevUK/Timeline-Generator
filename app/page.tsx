'use client';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Home() {
	const { data: session, status } = useSession();

	// try {
	// 	console.log('Session', session, 'Status', status);
	// } catch (err) {
	// 	console.log(err);
	// }

	if (status === 'loading') {
		return <div>Loading...</div>;
	}

	if (!session) {
		console.log('Session', session);
		redirect('/login');
	}

	return <div>Search</div>;
}
