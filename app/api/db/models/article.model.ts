import { ArticleSchema, ArticleType } from '../schema/article.schema';
import mongoose, { Model } from 'mongoose';

export const Article: Model<ArticleType> = mongoose.models.Article || mongoose.model<ArticleType>('Article', ArticleSchema);
