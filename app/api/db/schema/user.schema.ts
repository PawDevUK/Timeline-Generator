import { Schema, Document } from 'mongoose';

export interface IUser extends Document {
	username: string;
	password: string;
	email?: string;
	createdAt: Date;
}

export const UserSchema: Schema<IUser> = new Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	email: { type: String, required: false, unique: true },
	createdAt: { type: Date, default: Date.now },
});
