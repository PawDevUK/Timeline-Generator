import React, { useState } from 'react';

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

	return (
		<div className=' card-panel w-1/4 flex-none'>
			<h2 className='text-2xl font-bold mb-4'>Search Repositories</h2>

			<form onSubmit={handleSubmit} className='space-y-4'>
				{/* User Input */}
				<div>
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
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-1'>Repository Name ( Optional ) </label>
					<input
						type='text'
						value={repo}
						onChange={(e) => setRepo(e.target.value)}
						placeholder='e.g., TLG'
						className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
				</div>

				{/* Error Message */}
				{error && <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>{error}</div>}

				{/* Success Message */}
				{success && <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded'>{success}</div>}

				{/* Submit Button */}
				<button
					type='submit'
					disabled={loading}
					className='w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition'>
					{loading ? 'Searching...' : 'Search Repositories'}
				</button>
			</form>
		</div>
	);
}
