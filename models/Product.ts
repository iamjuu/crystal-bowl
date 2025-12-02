import mongoose, { Schema, models, model } from "mongoose";
import type { Product as ProductType } from "@/types";

const ProductSchema = new Schema<ProductType>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: [String], default: [] } as any, // Array of base64 image strings
  },
  { timestamps: true }
);

export default (models.Product as mongoose.Model<ProductType>) || model<ProductType>("Product", ProductSchema);



