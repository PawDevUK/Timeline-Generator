import mongoose from 'mongoose';
import dns from 'node:dns';
import { userTypes } from '@/types/user.type';

type MongooseCache = {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
};

const cached: MongooseCache = (global as { mongoose?: MongooseCache }).mongoose || { conn: null, promise: null };

export async function dbConnect() {
	const MONGO_DB_TLG = process.env.MONGO_DB_TLG || '';

	if (!MONGO_DB_TLG) {
		throw new Error('Please define the MONGO_DB_TLG environment variable in .env.local');
	}

	if (cached.conn) {
		return cached.conn;
	}
	if (!cached.promise) {
		cached.promise = mongoose
			.connect(MONGO_DB_TLG, {
				bufferCommands: false,
			})
			.then((mongoose) => {
				console.log('MongoDB connected successfully');
				return mongoose;
			})
			.catch((error) => {
				cached.promise = null;
				throw error;
			});
	}
	cached.conn = await cached.promise;
	return cached.conn;
}

export function checkConnection() {
	const status = mongoose.connection.readyState;
	// 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

	console.log('MongoDB connection status:', status);
}

export async function checkUser(User: typeof mongoose.Model, user: userTypes) {
	try {
		return await User.find(user);
	} catch (err) {
		console.error(err);
	}
}
