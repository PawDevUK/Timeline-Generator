import axios from 'axios';
import { NextResponse } from 'next/server';

// Get list of repositories

// Get selected repositories info.
// Get selected repositiries commits.

export async function GET() {
	const user: string = 'https://api.github.com/users/PawDevUK';
	try {
		const response = await axios.get(user);
		return NextResponse.json(response.data);
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
	}
}
