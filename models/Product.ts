import mongoose, { Schema, models, model } from "mongoose";
import type { Product as ProductType } from "@/types";

const ProductSchema = new Schema<ProductType>(
  {
    name: { type: String, required: true },
    shortDescription: { type: String, required: false }, // Brief description
    description: { type: String, required: true }, // Long description
    category: { 
      type: Schema.Types.ObjectId, 
      ref: 'Category',
      required: false
    }, // Category reference (ObjectId)
    price: { type: Number, required: true },
    imageUrl: { type: [String], default: [] } as any, // Array of base64 image strings (max 3)
    videoUrl: { type: Schema.Types.Mixed, default: [] } as any, // Can be string or array of strings (max 2 videos)
  },
  { timestamps: true }
);

export default (models.Product as mongoose.Model<ProductType>) || model<ProductType>("Product", ProductSchema);



