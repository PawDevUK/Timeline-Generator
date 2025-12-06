import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const useLogoutResponse = NextResponse.json({
			message: 'The user logged out.',
			success: true,
		});

		useLogoutResponse.cookies.set('token', '', {
			httpOnly: true,
			expires: new Date(0),
		});
		return useLogoutResponse;
	} catch (err: unknown) {
		let message = 'An unknown error occurred';
		if (err instanceof Error) {
			message = err.message;
		}
		return NextResponse.json(
			{
				error: message,
			},
			{
				status: 500,
			}
		);
	}
}
