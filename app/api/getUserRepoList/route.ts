import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const response = await axios.get('https://api.github.com/users/PawDevUK/repos');
		return NextResponse.json(response.data);
	} catch (error) {
		return NextResponse.json({ error: (error as Error).message }, { status: 500 });
	}
}
