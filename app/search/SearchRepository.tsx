import React, { useState } from 'react';

export default function SearchRepository() {
	const [user, setUser] = useState('');
	const [repo, setRepo] = useState('');
	const [year, setYear] = useState(new Date().getFullYear().toString());
	const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
	const [day, setDay] = useState(new Date().getDate().toString());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const handleGenerateArticle = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		setSuccess('');

		try {
			const response = await fetch(`/api/articles/generate?user=${user}&repo=${repo}&year=${year}&month=${month}&day=${day}`);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to generate article');
			}

			const data = await response.json();
			setSuccess(`Article generated successfully: ${data.article.title}`);
			// Reset form
			setUser('');
			setRepo('');
			setYear(new Date().getFullYear().toString());
			setMonth((new Date().getMonth() + 1).toString());
			setDay(new Date().getDate().toString());
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='bg-white rounded-lg shadow-md p-6 w-1/4 flex-none'>
			<h2 className='text-2xl font-bold mb-4'>Generate Article from Commits</h2>

			<form onSubmit={handleGenerateArticle} className='space-y-4'>
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
						required
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
					{loading ? 'Generating...' : 'Generate Article'}
				</button>
			</form>
		</div>
	);
}
