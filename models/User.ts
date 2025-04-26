import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;
  role: 'creator' | 'viewer' | 'admin';
  watchLater: mongoose.Types.ObjectId[];
  watchHistory: mongoose.Types.ObjectId[];
}

const userSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['creator', 'viewer', 'admin'], default: 'viewer' },
  watchLater: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
  watchHistory: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
});

export default mongoose.model<IUser>('User', userSchema);