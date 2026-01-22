import { Schema, Document } from 'mongoose';

export interface RepositoryDocument extends Document {
	name: string;
	user: string;
	articles: {
		title: string;
		date: string;
		description: string;
		createdAt: Date;
	}[];
	createdAt: Date;
}

export const RepositorySchema: Schema<RepositoryDocument> = new Schema({
	name: { type: String, required: true },
	user: { type: String, required: true },
	articles: [
		{
			title: { type: String, required: true },
			date: { type: String, required: true },
			description: { type: String, required: true },
			createdAt: { type: Date, default: Date.now },
		},
	],
	createdAt: { type: Date, default: Date.now },
});
