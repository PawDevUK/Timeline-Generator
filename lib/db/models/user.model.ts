import mongoose, { Model } from 'mongoose';
import { IUser, UserSchema } from '../schema/user.schema';

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
