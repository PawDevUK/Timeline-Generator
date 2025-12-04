import mongoose from 'mongoose';

const MONGO_DB_TLG = process.env.MONGO_DB_TLG || '';

if (!MONGO_DB_TLG) {
	throw new Error('Please define the MONGO_DB_TLG environment variable in .env.local');
}

let cached = (global as any).mongoose;

if (!cached) {
	cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
	if (cached.conn) {
		console.log('MongoDB connected successfully');
		return cached.conn;
	}
	if (!cached.promise) {
		cached.promise = mongoose
			.connect(MONGO_DB_TLG, {
				bufferCommands: false,
			})
			.then((mongoose) => {
				return mongoose;
			});
	}
	cached.conn = await cached.promise;
	return cached.conn;
}

export await function addUser(data){
	
}