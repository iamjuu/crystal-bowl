import mongoose, { Schema, models, model } from "mongoose";
import type { Booking as BookingType } from "@/types";

const BookingSchema = new Schema<BookingType>(
  {
    userId: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    seats: { type: Number, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
    phone: { type: String, required: false },
    comment: { type: String, required: false },
  },
  { timestamps: true }
);

export default (models.Booking as mongoose.Model<BookingType>) || model<BookingType>("Booking", BookingSchema);

