import mongoose, { Schema, models, model } from "mongoose";
import type { YogaSession as YogaSessionType } from "@/types";

const YogaSessionSchema = new Schema<YogaSessionType>(
  {
    instructor: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    totalSeats: { type: Number, required: true, default: 1 },
    bookedSeats: { type: Number, default: 0 },
    price: { type: Number, required: true },
    sessionType: { type: String, enum: ["regular", "corporate", "private"], default: "regular" },
    sessionName: { type: String },
    duration: { type: Number }, // in minutes
    title: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    videoUrl: { type: String },
    format: { type: String },
    benefits: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default (models.YogaSession as mongoose.Model<YogaSessionType>) || model<YogaSessionType>("YogaSession", YogaSessionSchema);



