'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function LoginClient() {
	// const [email, setEmail] = useState('');
	const [username, setUser] = useState('');
	const [password, setPassword] = useState('');
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl') || '/';

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		await signIn('credentials', {
			username,
			// email,
			password,
			callbackUrl,
		});
	}

	return (
		<div className='flex min-h-screen items-center justify-center bg-gray-50 w-full overflow-x-hidden'>
			<div className='flex  min-h-screen flex-col md:flex-row w-full max-w-4xl bg-white overflow-hidden'>
				<div className='flex flex-col justify-center p-8 md:w-1/2'>
					<img src='https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600' alt='Your Company' className='h-10 w-auto mb-6 mx-auto' />
					<h2 className='text-2xl font-bold text-gray-900 mb-2 text-center'>Sign in to your account</h2>
					<p className='text-sm text-gray-500 mb-6 text-center'>
						Not a member?{' '}
						<a href='#' className='text-indigo-600 hover:underline'>
							Start a 14 day free trial
						</a>
					</p>
					<form onSubmit={handleSubmit} className='space-y-6'>
						<div>
							<label htmlFor='username' className='block text-sm font-medium text-gray-700'>
								Username
							</label>
							<input
								id='username'
								name='username'
								type='text'
								autoComplete='username'
								value={username}
								onChange={(e) => setUser(e.target.value)}
								required
								className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-11 px-4'
							/>
						</div>
						<div>
							<label htmlFor='password' className='block text-sm font-medium text-gray-700'>
								Password
							</label>
							<input
								id='password'
								name='password'
								type='password'
								autoComplete='current-password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-11 px-4'
							/>
						</div>
						<div className='flex items-center justify-between'>
							<div className='flex items-center'>
								<input id='remember-me' name='remember-me' type='checkbox' className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500' />
								<label htmlFor='remember-me' className='ml-2 block text-sm text-gray-900'>
									Remember me
								</label>
							</div>
							<div className='text-sm'>
								<a href='#' className='text-indigo-600 hover:underline'>
									Forgot your password?
								</a>
							</div>
						</div>
						<div>
							<button
								type='submit'
								className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 h-11'>
								Sign in
							</button>
						</div>
					</form>
					<div className='mt-6'>
						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t border-gray-300' />
							</div>
							<div className='relative flex justify-center text-sm'>
								<span className='px-2 bg-white text-gray-500'>Or continue with</span>
							</div>
						</div>
						<div className='mt-6 grid grid-cols-1 gap-3'>
							<div>
								<button
									onClick={() => signIn('github', { callbackUrl })}
									className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'>
									<svg className='w-5 h-5' viewBox='0 0 20 20' fill='currentColor'>
										<path
											fillRule='evenodd'
											d='M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C10.477 0 10 0z'
											clipRule='evenodd'
										/>
									</svg>
									<span className='ml-2'>Sign in with GitHub</span>
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className='hidden md:flex md:w-1/2 bg-indigo-600'>
					<div className='flex flex-col justify-center p-8 text-white'>
						<h2 className='text-3xl font-bold mb-4'>Welcome back!</h2>
						<p className='text-lg mb-6'>Sign in to access your timeline generator and manage your projects.</p>
						<ul className='space-y-2'>
							<li className='flex items-center'>
								<svg className='h-5 w-5 mr-2 text-green-400' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
								</svg>
								Track repository changes
							</li>
							<li className='flex items-center'>
								<svg className='h-5 w-5 mr-2 text-green-400' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
								</svg>
								AI-powered summaries
							</li>
							<li className='flex items-center'>
								<svg className='h-5 w-5 mr-2 text-green-400' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
								</svg>
								Secure authentication
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
