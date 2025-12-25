import mongoose, { Schema, models, model } from "mongoose";

export interface PastEventType {
  name: string;
  title: string;
  location: string;
  day: string;
  time: string;
  date: string;
  description: string;
  thumbnailImage: string; // Required main thumbnail image
  photos?: string[]; // Optional array of up to 6 photos
  videos?: string[]; // Optional array of up to 2 videos
  createdAt?: Date;
  updatedAt?: Date;
}

const PastEventSchema = new Schema<PastEventType>(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    day: { type: String, required: true },
    time: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    thumbnailImage: { type: String, required: true }, // Required main thumbnail
    photos: { type: [String], default: [] }, // Optional array, max 6
    videos: { type: [String], default: [] }, // Optional array, max 2
  },
  { timestamps: true }
);

// Delete the cached model if it exists to ensure fresh schema
if (models.PastEvent) {
  delete models.PastEvent;
}

export default model<PastEventType>("PastEvent", PastEventSchema);

