import mongoose, { Schema, models, model } from "mongoose";

export interface DiscoverySessionType {
  _id: string;
  instructorName: string;
  date: string; // ISO date
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  duration: number; // in minutes (30, 60, 90, 120)
  totalSeats: number; // Always 1 for one-on-one
  bookedSeats: number; // 0 or 1
  price: number; // Always 0 (no payment)
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  format?: string;
  benefits?: string[];
  slotId?: string; // Reference to AvailableSlot (optional)
  createdAt: Date;
  updatedAt: Date;
}

const DiscoverySessionSchema = new Schema<DiscoverySessionType>(
  {
    instructorName: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    totalSeats: { type: Number, required: true, default: 1 },
    bookedSeats: { type: Number, default: 0 },
    price: { type: Number, required: true, default: 0 }, // No payment
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    videoUrl: { type: String },
    format: { type: String },
    benefits: { type: [String], default: [] },
    slotId: { type: String }, // Reference to slot (optional)
  },
  { timestamps: true }
);

export default (models.DiscoverySession as mongoose.Model<DiscoverySessionType>) || 
  model<DiscoverySessionType>("DiscoverySession", DiscoverySessionSchema);


