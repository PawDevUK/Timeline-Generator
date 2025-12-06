import { User } from '@/app/api/db/models/user.model';
import { dbConnect } from '@/app/api/db/db';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

await dbConnect();
const SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
	const { username, password } = await request.json();
	const existingUser = await User.findOne({ username, password });
	if (!existingUser) {
		return NextResponse.json({ error: 'Invalid Login or password!!' }, { status: 409 });
	}
	if (!SECRET) {
		return NextResponse.json({ error: 'JWT secret not configured' }, { status: 500 });
	}
	const token = jwt.sign({ username }, SECRET, { expiresIn: '30d' });
	return NextResponse.json({ token });
}
