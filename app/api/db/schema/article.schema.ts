import { Schema, Document } from 'mongoose';

export interface ArticleType extends Document {
	title: string;
	date: string;
	description: string;
	createdAt: Date;
}

export const ArticleSchema: Schema<ArticleType> = new Schema({
	title: { type: String, required: true, unique: false },
	date: { type: String, required: true },
	description: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});
