import React, { useEffect, useState } from 'react';

interface SearchRepositoryProps {
	onSearch: (user: string, repo: string) => void;
	loading: boolean;
	error: string;
	success: string;
}

export default function SearchRepository({ onSearch, loading, error, success }: SearchRepositoryProps) {
	const [user, setUser] = useState('');
	const [repo, setRepo] = useState('');

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSearch(user, repo);
	};

	useEffect(() => {
		onSearch('pawdevuk', '');
	}, []);

	return (
		<div className=' card-panel w-full flex-none'>
			<h2 className='text-2xl font-bold mb-4'>Search Repositories</h2>

			<form onSubmit={handleSubmit} className='space-y-4 space-x-6 flex-none md:flex'>
				{/* User Input */}
				<div className='w-full  md:w-[30%]'>
					<label className='block text-sm font-medium text-gray-700 mb-1'>GitHub Username</label>
					<input
						type='text'
						value={user}
						onChange={(e) => setUser(e.target.value)}
						placeholder='e.g., PawDevUK'
						required
						className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
				</div>

				{/* Repo Input */}
				<div className='w-full md:w-[30%]'>
					<label className='block text-sm font-medium text-gray-700 mb-1'>Repository Name</label>
					<input
						type='text'
						value={repo}
						onChange={(e) => setRepo(e.target.value)}
						placeholder='e.g., TLG'
						className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
				</div>
				<button
					type='submit'
					disabled={loading}
					className='w-full md:w-[150px] h-10 bg-main text-white font-bold mt-[25.5px] py-2 px-4 rounded hover:bg-main/90 disabled:bg-main/50 disabled:cursor-not-allowed transition'>
					{loading ? 'Searching...' : 'Search'}
				</button>

				{/* Error Message */}
				{error && <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>{error}</div>}

				{/* Success Message */}
				{success && <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded'>{success}</div>}

				{/* Submit Button */}
			</form>
		</div>
	);
}
