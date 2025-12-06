import mongoose, { Schema, models, model } from "mongoose";

export interface AvailableSlotType {
  _id: string;
  sessionType: "discovery" | "private";
  month: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // Time in HH:MM format
  isBooked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AvailableSlotSchema = new Schema<AvailableSlotType>(
  {
    sessionType: {
      type: String,
      enum: ["discovery", "private"],
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for faster queries
AvailableSlotSchema.index({ sessionType: 1, date: 1, time: 1 });

export default (models.AvailableSlot as mongoose.Model<AvailableSlotType>) ||
  model<AvailableSlotType>("AvailableSlot", AvailableSlotSchema);

