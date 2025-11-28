import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { user: string; repo: string } }) {
	const { user, repo } = params;
	if (!user) {
		return NextResponse.json({ error: 'No user selected.' }, { status: 400 });
	}
	if (!repo) {
		return NextResponse.json({ error: 'No repo selected.' }, { status: 400 });
	}

	try {
		const response = await axios.get(`https://api.github.com/repos/${user}/${repo}/commits`);
		return NextResponse.json(response.data);
	} catch (error) {
		return NextResponse.json({ error: (error as Error).message }, { status: 500 });
	}
}
