// components/Sidebar.tsx (relevant bottom part only)
import { signIn, signOut, useSession } from 'next-auth/react';
import { LogOut } from 'lucide-react';

const MenuLogin = () => {
	const { data: session } = useSession();

	return (
		<div className='border-t border-gray-800/70 p-4 mt-auto'>
			{session ? (
				<div className='space-y-4'>
					{/* User preview */}
					<div className='flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-gray-800/50 transition-colors'>
						{session.user?.image ? (
							<img src={session.user.image} alt='' className='h-10 w-10 rounded-full ring-1 ring-green-500/30 object-cover' />
						) : (
							<div className='h-10 w-10 rounded-full bg-linear-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-semibold'>
								{session.user?.name?.[0]?.toUpperCase() || 'U'}
							</div>
						)}
						<div className='min-w-0'>
							<p className='text-sm font-medium text-white truncate'>{session.user?.name || 'Developer'}</p>
							<p className='text-xs text-gray-400 truncate'>{session.user?.email || 'github-connected'}</p>
						</div>
					</div>

					{/* Logout button */}
					<button
						onClick={() => signOut({ callbackUrl: '/' })}
						className='
		  flex w-full items-center justify-center gap-2.5
		  rounded-lg bg-gray-800 hover:bg-gray-700
		  px-4 py-2.5 text-sm font-medium text-red-400
		  hover:text-red-300 transition-colors
		'>
						<LogOut size={16} />
						Sign out
					</button>
				</div>
			) : (
				<button
					onClick={() => signIn('github')}
					className='
		flex w-full items-center justify-center gap-2.5
		rounded-lg bg-green-600 hover:bg-green-500
		px-4 py-3 text-sm font-medium text-white
		shadow-sm transition-all
	  '>
					<svg className='h-5 w-5' viewBox='0 0 24 24' fill='currentColor'>
						<path d='M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48v-1.69c-2.78.61-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1.01.07 1.54 1.03 1.54 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.56 9.56 0 0112 6.8c.85.004 1.71.11 2.52.33 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .26.18.57.69.49C19.14 20.16 22 16.42 22 12c0-5.52-4.48-10-10-10z' />
					</svg>
					Sign in with GitHub
				</button>
			)}
		</div>
	);
};

export default MenuLogin;
