import mongoose, { Schema, models, model } from "mongoose";

export interface BlogType {
  name: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const BlogSchema = new Schema<BlogType>(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export default (models.Blog as mongoose.Model<BlogType>) || model<BlogType>("Blog", BlogSchema);






