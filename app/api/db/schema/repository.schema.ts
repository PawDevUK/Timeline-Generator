import { Schema, Document } from 'mongoose';
import { ArticleSchema } from './article.schema';
import { RepositoryType } from '../../types/repository.type';

export interface RepositoryDocument extends RepositoryType, Document {}

export const RepositorySchema: Schema<RepositoryDocument> = new Schema({
	name: { type: String, required: true },
	user: { type: String, required: true },
	articles: [ArticleSchema],
	createdAt: { type: Date, default: Date.now },
});
