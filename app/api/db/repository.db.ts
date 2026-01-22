import mongoose from 'mongoose';
import { RepositoryDocument } from './schema/repository.schema';
import { RepositoryType } from '../types/repository.type';

// Add repository
export async function AddRepository(Repository: typeof mongoose.Model, repository: Omit<RepositoryType, 'createdAt'>) {
	try {
		const newRepository = await Repository.create(repository);
		return { success: true, data: newRepository };
	} catch (error) {
		console.error('Error adding repository:', error);
		return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
	}
}

// Get repository by id
export async function GetRepository(Repository: typeof mongoose.Model, repositoryId: string) {
	try {
		const repository = await Repository.findById(repositoryId);
		if (!repository) {
			return { success: false, error: 'Repository not found' };
		}
		return { success: true, data: repository as RepositoryDocument };
	} catch (error) {
		console.error('Error getting repository:', error);
		return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
	}
}

// Get all repositories
export async function GetAllRepositories(Repository: typeof mongoose.Model) {
	try {
		const repositories = await Repository.find().sort({ createdAt: -1 });
		return { success: true, data: repositories as RepositoryDocument[] };
	} catch (error) {
		console.error('Error getting repositories:', error);
		return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
	}
}
