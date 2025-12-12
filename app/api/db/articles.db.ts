import mongoose from 'mongoose';
import { ArticleType } from '../types/article.type';

//  Add article
export async function AddArticle(Article: typeof mongoose.Model, article: Omit<ArticleType, 'createdAt' | '_id'>) {
	try {
		const newArticle = await Article.create(article);
		return { success: true, data: newArticle };
	} catch (error) {
		console.error('Error adding article:', error);
		return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
	}
}

//  Get all articles
export async function GetAllArticles(Article: typeof mongoose.Model) {
	try {
		const articles = await Article.find().sort({ createdAt: -1 });
		return { success: true, data: articles };
	} catch (error) {
		console.error('Error getting articles:', error);
		return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
	}
}

//  Get Article by id
export async function GetArticle(Article: typeof mongoose.Model, articleId: string) {
	try {
		const article = await Article.findById(articleId);
		if (!article) {
			return { success: false, error: 'Article not found' };
		}
		return { success: true, data: article };
	} catch (error) {
		console.error('Error getting article:', error);
		return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
	}
}

//  Edit article by id
export async function EditArticle(Article: typeof mongoose.Model, articleId: string, updates: Partial<ArticleType>) {
	try {
		const article = await Article.findByIdAndUpdate(articleId, updates, { new: true });
		if (!article) {
			return { success: false, error: 'Article not found' };
		}
		return { success: true, data: article };
	} catch (error) {
		console.error('Error editing article:', error);
		return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
	}
}

// Delete article by id.
export async function DeleteArticle(Article: typeof mongoose.Model, articleId: string) {
	try {
		const article = await Article.findByIdAndDelete(articleId);
		if (!article) {
			return { success: false, error: 'Article not found' };
		}
		return { success: true, data: article };
	} catch (error) {
		console.error('Error deleting article:', error);
		return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
	}
}
