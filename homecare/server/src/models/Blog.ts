import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: { name: string; avatar: string; bio: string };
  category: string;
  tags: string[];
  readTime: number;
  views: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  coverImage: { type: String, default: '' },
  author: {
    name: { type: String, required: true },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
  },
  category: { type: String, required: true },
  tags: [{ type: String }],
  readTime: { type: Number, default: 5 },
  views: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1, isPublished: 1 });

export default mongoose.model<IBlog>('Blog', blogSchema);
