import { Schema, Document } from 'mongoose';
import { ArticleSchema } from './article.schema';
import { Repository } from '@/types/repository.types';

export interface RepositoryDocument extends Repository, Document {}

export const RepositorySchema: Schema<RepositoryDocument> = new Schema({
	id: { type: Number },
	node_id: { type: String },
	name: { type: String, required: true },
	full_name: { type: String },
	private: { type: Boolean, default: false },
	owner: {
		login: { type: String, required: true },
		id: { type: Number },
	},
	html_url: { type: String },
	url: { type: String },
	created_at: { type: String },
	updated_at: { type: String },
	pushed_at: { type: String },
	date: { type: String },
	language: { type: String },
	TLG: {
		tracking: { type: Boolean, default: false },
		daysActiveCommits: { type: Number, default: 0 },
		articles: [ArticleSchema],
		lastSyncedAt: { type: Date },
		lastArticleDate: { type: String },
	},
});
