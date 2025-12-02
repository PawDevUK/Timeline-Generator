import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
	const { username, password } = await request.json();

	if (username === 'admin' && password === 'password') {
		if (!SECRET) {
			return NextResponse.json({ error: 'JWT secret not configured' }, { status: 500 });
		}

		const token = jwt.sign({}, SECRET, { expiresIn: '30d' });
		return NextResponse.json({ token });
	}

	return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const token = searchParams.get('token');

	if (!token) {
		return NextResponse.json({ valid: false, error: 'Token is required' }, { status: 400 });
	}

	try {
		if (!SECRET) {
			return NextResponse.json({ error: 'JWT secret not configured' }, { status: 500 });
		}
		const decoded = jwt.verify(token, SECRET);
		return NextResponse.json({ valid: true, decoded });
	} catch (err) {
		return NextResponse.json({ valid: false, error: 'Invalid or expired token' }, { status: 401 });
	}
}
