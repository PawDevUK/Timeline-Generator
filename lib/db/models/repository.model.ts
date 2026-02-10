import { RepositorySchema, RepositoryDocument } from '@/lib/db/schema/repository.schema';
import mongoose, { Model } from 'mongoose';

export const Repository: Model<RepositoryDocument> = mongoose.models.Repository || mongoose.model<RepositoryDocument>('Repository', RepositorySchema);
