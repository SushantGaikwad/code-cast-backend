import mongoose, { Schema, Document } from 'mongoose';

interface IVideo extends Document {
  title: string;
  description: string;
  embedLink: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  creator: mongoose.Types.ObjectId;
  views: number;
  likes: number;
  dislikes: number;
  avgWatchDuration: number;
  createdAt: Date;
}

const videoSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  embedLink: { type: String, required: true },
  tags: [String],
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  category: { type: String },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  avgWatchDuration: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IVideo>('Video', videoSchema);