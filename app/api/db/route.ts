import { NextResponse } from 'next/server';
import { dbConnect } from './db';
import { User } from './models/user.model';

export async function POST(request: Request) {
	await dbConnect();
	const { username, password, email } = await request.json();

	// Check if user already exists
	const existingUser = await User.findOne({ username });
	if (existingUser) {
		return NextResponse.json({ error: 'User already exists' }, { status: 409 });
	}

	// Create new user
	const newUser = new User({ username, password, email });
	await newUser.save();

	return NextResponse.json({ message: 'User created', user: { username, email } }, { status: 201 });
}
