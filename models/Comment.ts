import mongoose, { Schema, Document } from 'mongoose';

interface IComment extends Document {
  video: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const commentSchema: Schema = new Schema({
  video: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IComment>('Comment', commentSchema);