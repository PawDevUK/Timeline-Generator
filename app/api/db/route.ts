import { NextResponse } from 'next/server';
import { dbConnect } from './db';
import { User } from './models/user.model';

await dbConnect();

export async function POST(request: Request) {
	const { username, password, email } = await request.json();

	const existingUser = await User.findOne({ username });
	if (existingUser) {
		return NextResponse.json({ error: 'User already exists' }, { status: 409 });
	}

	const newUser = new User({ username, password, email });
	await newUser.save();

	return NextResponse.json({ message: 'User created', user: { username, email } }, { status: 201 });
}
