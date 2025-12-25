import mongoose, { Schema, models, model, Document } from "mongoose";

export interface PrivateSessionType extends Document {
  title?: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  format?: string;
  benefits?: string[];
  sessionType: "private";
  instructorName?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  price?: number;
  totalSeats?: number;
  bookedSeats?: number;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PrivateSessionSchema = new Schema<PrivateSessionType>(
  {
    title: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    videoUrl: { type: String },
    format: { type: String },
    benefits: { type: [String], default: [] },
    sessionType: { type: String, default: "private", immutable: true },
    instructorName: { type: String },
    date: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    duration: { type: Number },
    price: { type: Number },
    totalSeats: { type: Number, default: 1 },
    bookedSeats: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Delete the cached model if it exists to ensure fresh schema
if (models.PrivateSession) {
  delete models.PrivateSession;
}

export default model<PrivateSessionType>("PrivateSession", PrivateSessionSchema);
