import mongoose, { Model } from 'mongoose';
import { ArticleSchema, ArticleDocument } from '../schema/article.schema';

export const Article: Model<ArticleDocument> = mongoose.models.Article || mongoose.model<ArticleDocument>('Article', ArticleSchema);
