import { RepositorySchema, RepositoryDocument } from '../schema/repository.schema';
import mongoose, { Model } from 'mongoose';

export const Repository: Model<RepositoryDocument> = mongoose.models.Repository || mongoose.model<RepositoryDocument>('Repository', RepositorySchema);
