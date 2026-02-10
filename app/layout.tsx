'use client';

import { SessionProvider } from 'next-auth/react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { useState } from 'react';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

function SidebarContent() {
	return (
		<>
			<div className='flex items-center mb-8'>
				{/* <img src='https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600' alt='Logo' className='h-8 w-auto' /> */}
				<span className='ml-2 font-bold text-lg text-indigo-600'>Time Line Generator</span>
			</div>
			<nav className='flex-1'>
				<ul className='space-y-2'>
					<li>
						<a href='/search' className='flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-indigo-600'>
							<svg className='h-5 w-5 mr-2 text-indigo-600' fill='none' stroke='currentColor' strokeWidth='1.5' viewBox='0 0 24 24'>
								<path
									d='m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
							Search Repositories
						</a>
					</li>
					<li>
						<a href='/repos' className='flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-indigo-600'>
							<svg className='h-5 w-5 mr-2 text-indigo-600' fill='none' stroke='currentColor' strokeWidth='1.5' viewBox='0 0 24 24'>
								<path
									d='M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
							Repositories
						</a>
					</li>
					<li>
						<a href='/timeLine' className='flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-indigo-600'>
							<svg className='h-5 w-5 mr-2 text-indigo-600' fill='none' stroke='currentColor' strokeWidth='1.5' viewBox='0 0 24 24'>
								<path
									d='M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
							Time Line
						</a>
					</li>

					<li>
						<a href='#' className='flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-indigo-600'>
							<svg className='h-5 w-5 mr-2 text-indigo-600' fill='none' stroke='currentColor' strokeWidth='1.5' viewBox='0 0 24 24'>
								<path
									d='M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
							Documents
						</a>
					</li>
					<li>
						<a href='#' className='flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-indigo-600'>
							<svg className='h-5 w-5 mr-2 text-indigo-600' fill='none' stroke='currentColor' strokeWidth='1.5' viewBox='0 0 24 24'>
								<path d='M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z' strokeLinecap='round' strokeLinejoin='round' />
								<path d='M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z' strokeLinecap='round' strokeLinejoin='round' />
							</svg>
							Reports
						</a>
					</li>
				</ul>
			</nav>
			<div className='mt-auto flex items-center gap-2 pt-8'>
				<img
					// src=''
					alt='Profile'
					className='h-8 w-8 rounded-full'
				/>
				<span className='text-sm font-medium text-gray-700'>Pawel Siwek</span>
			</div>
		</>
	);
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<SessionProvider>
			<html lang='en'>
				<body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`} suppressHydrationWarning>
					<div className='flex min-h-screen'>
						{/* Sidebar for desktop */}
						<aside className='hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-4'>
							<SidebarContent />
						</aside>

						{/* Burger button for mobile */}
						<button
							type='button'
							className='md:hidden fixed top-4 left-4 z-50 p-2 rounded bg-white shadow-lg border border-gray-200'
							aria-label='Open sidebar'
							onClick={() => setSidebarOpen(true)}>
							<svg className='h-6 w-6 text-gray-700' fill='none' stroke='currentColor' strokeWidth='1.5' viewBox='0 0 24 24'>
								<path d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' strokeLinecap='round' strokeLinejoin='round' />
							</svg>
						</button>

						{/* Mobile sidebar overlay */}
						{sidebarOpen && (
							<div className='fixed inset-0 z-50 flex md:hidden'>
								{/* Backdrop */}
								<div className='fixed inset-0  bg-opacity-40' aria-hidden='true' onClick={() => setSidebarOpen(false)} />
								{/* Sidebar panel */}
								<div className='relative flex flex-col w-64 bg-white border-r border-gray-200 p-4'>
									<div className='flex items-center mb-8 justify-between'>
										{/* <div className='flex items-center'>
										<img src='https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600' alt='Logo' className='h-8 w-auto' />
										<span className='ml-2 font-bold text-lg text-indigo-600'>Your Company</span>
									</div> */}
										<button type='button' className='p-2 rounded hover:bg-gray-100' aria-label='Close sidebar' onClick={() => setSidebarOpen(false)}>
											<svg className='h-6 w-6 text-gray-700' fill='none' stroke='currentColor' strokeWidth='1.5' viewBox='0 0 24 24'>
												<path d='M6 18 18 6M6 6l12 12' strokeLinecap='round' strokeLinejoin='round' />
											</svg>
										</button>
									</div>
									<SidebarContent />
								</div>
							</div>
						)}

						{/* Main content */}
						<main className='w-full'>{children}</main>
					</div>
				</body>
			</html>
		</SessionProvider>
	);
}
