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
		rounded-lg bg-main hover:bg-green-500
		px-4 py-3 text-sm font-medium text-white
		shadow-sm transition-all
	  '>
					Sign in with GitHub
				</button>
			)}
		</div>
	);
};

export default MenuLogin;
