import mongoose from 'mongoose';
import { Repository } from './models/repository.model';

//  Get Article by id
export async function GetArticle(articleId: string) {
	try {
		const article = await Repository.findOne(
			{ 'TLG.articles._id': articleId },
			{
				'TLG.articles.$': 1,
				name: 1,
				description: 1,
				createdAt: 1,
			},
		);
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
