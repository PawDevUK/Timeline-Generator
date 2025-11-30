export default function Login() {
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
					<form action='#' method='POST' className='space-y-6'>
						<div>
							<label htmlFor='email' className='block text-sm font-medium text-gray-700'>
								Email address
							</label>
							<input
								id='email'
								name='email'
								type='email'
								autoComplete='email'
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
								required
								className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-11 px-4'
							/>
						</div>
						<div className='flex items-center justify-between'>
							<div className='flex items-center'>
								<input id='remember-me' name='remember-me' type='checkbox' className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded' />
								<label htmlFor='remember-me' className='ml-2 block text-sm text-gray-900'>
									Remember me
								</label>
							</div>
							<div className='text-sm'>
								<a href='#' className='font-medium text-indigo-600 hover:underline'>
									Forgot password?
								</a>
							</div>
						</div>
						<button
							type='submit'
							className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 h-11'>
							Sign in
						</button>
					</form>
					<div className='mt-6'>
						<div className='relative flex items-center'>
							<div className='flex-grow border-t border-gray-300' />
							<span className='mx-4 text-sm text-gray-500'>Or continue with</span>
							<div className='flex-grow border-t border-gray-300' />
						</div>
						<div className='mt-6 flex gap-4'>
							<a
								href='#'
								className='flex items-center justify-center w-1/2 py-2 px-4 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50'>
								<svg viewBox='0 0 24 24' aria-hidden='true' className='h-5 w-5 mr-2'>
									<path
										d='M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z'
										fill='#EA4335'></path>
									<path
										d='M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z'
										fill='#4285F4'></path>
									<path
										d='M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z'
										fill='#FBBC05'></path>
									<path
										d='M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z'
										fill='#34A853'></path>
								</svg>
								Google
							</a>
							<a
								href='#'
								className='flex items-center justify-center w-1/2 py-2 px-4 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50'>
								<svg viewBox='0 0 20 20' fill='currentColor' aria-hidden='true' className='h-5 w-5 mr-2'>
									<path
										d='M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z'
										clipRule='evenodd'
										fillRule='evenodd'></path>
								</svg>
								GitHub
							</a>
						</div>
					</div>
				</div>
				<div className='hidden md:block md:w-1/2'>
					<img
						src='https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80'
						alt=''
						className='object-cover w-full h-full'
					/>
				</div>
			</div>
		</div>
	);
}
