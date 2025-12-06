import type { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { dbConnect } from '@/app/api/db/db';
import { User } from '@/app/api/db/models/user.model';

export const options: NextAuthOptions = {
	providers: [
		GitHubProvider({
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		}),
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				username: {
					lable: 'Username:',
					type: 'text',
					placeholder: 'your-username',
				},
				password: {
					lable: 'Password',
					type: 'text',
					placeholder: 'your-password',
				},
			},
			async authorize(credentials) {
				await dbConnect();

				const user = await User.findOne({ username: credentials?.username as string });
				console.log(user);
				if (user && user.password === credentials?.password) {
					return {
						id: user._id.toString(),
						name: user.username,
						message: `User ${user.username} found !!!`,
					};
				} else {
					console.log('User not found!!');
					return null;
				}
			},
		}),
	],
	// session: {
	// 	strategy: 'jwt',
	// 	maxAge: 30 * 24 * 60 * 60,
	// 	updateAge: 24 * 60 * 60,
	// },
};
