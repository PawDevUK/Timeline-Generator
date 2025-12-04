import mongoose from 'mongoose';
const DB = process.env.DB;

export async function connectDB() {
	if (!DB) {
		throw new Error('DB environment variable is not defined');
	}
	await mongoose.connect(DB);
}
connectDB().catch((err) => console.log(err));
