'use client';
// import MenuLogin from '@/app/login/menuLogin.tsx';
import { SessionProvider } from 'next-auth/react';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
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
				<Link href='/'>
					<span className='ml-2 font-bold text-lg main-color'>Time Line Generator</span>
				</Link>
			</div>

			<nav className='flex-1'>
				<ul className='space-y-2'>
					<li>
						<a href='/search' className='flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:main-color'>
							<svg className='h-5 w-5 mr-2 main-color' fill='none' stroke='currentColor' strokeWidth='1.5' viewBox='0 0 24 24'>
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
						<a href='/repos' className='flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:main-color'>
							<svg className='h-5 w-5 mr-2 main-color' fill='none' stroke='currentColor' strokeWidth='1.5' viewBox='0 0 24 24'>
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
						<a href='/timeLine' className='flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:main-color'>
							<svg className='h-5 w-5 mr-2 main-color' fill='none' stroke='currentColor' strokeWidth='1.5' viewBox='0 0 24 24'>
								<path
									d='M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
							Time Line
						</a>
					</li>
				</ul>
			</nav>
			<div className='mt-auto flex items-center gap-2 pt-8'>{/* <MenuLogin></MenuLogin> */}</div>
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
				<head>
					<link rel='preconnect' href='https://fonts.googleapis.com' />
					<link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
					<link
						href='https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100..900;1,100..900&family=Victor+Mono:ital,wght@0,100..700;1,100..700&display=swap'
						rel='stylesheet'
					/>
				</head>
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
										<span className='ml-2 font-bold text-lg main-color'>Your Company</span>
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
