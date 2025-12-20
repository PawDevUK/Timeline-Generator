import axios from 'axios';
import { NextResponse } from 'next/server';
// Get list of active days of the repo
//      get user
//      get repo
//      fetch activities
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const user = searchParams.get('user');
	const repo = searchParams.get('repo');
	const url = `https://github.com/repos/${user}/${repo}/activity`;

	try {
		const response = await axios.get(url);
		return NextResponse.json(response.data);
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
	}
}
