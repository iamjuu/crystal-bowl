import mongoose, { Schema, models, model, Document } from "mongoose";

export interface CorporateSessionType extends Document {
  title?: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  format?: string;
  benefits?: string[];
  sessionType: "corporate";
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CorporateSessionSchema = new Schema<CorporateSessionType>(
  {
    title: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    videoUrl: { type: String },
    format: { type: String },
    benefits: { type: [String], default: [] },
    sessionType: { type: String, default: "corporate", immutable: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Delete the cached model if it exists to ensure fresh schema
if (models.CorporateSession) {
  delete models.CorporateSession;
}

export default model<CorporateSessionType>("CorporateSession", CorporateSessionSchema);
