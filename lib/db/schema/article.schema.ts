import { Schema, Document } from 'mongoose';
import { ArticleType } from '@/types/article.type';

export interface ArticleDocument extends ArticleType, Document {}

export const ArticleSchema: Schema<ArticleDocument> = new Schema({
	title: { type: String, required: true, unique: false },
	date: { type: String, required: true },
	description: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});

// Capitalize the first letter of the title before saving to the database
ArticleSchema.path('title').set(function (value: string) {
	return value.charAt(0).toUpperCase() + value.slice(1);
});
