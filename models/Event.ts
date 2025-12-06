import mongoose, { Schema, models, model } from "mongoose";

export interface EventType {
  name: string;
  title: string;
  location: string;
  day: string;
  time: string;
  date: string;
  description: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const EventSchema = new Schema<EventType>(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    day: { type: String, required: true },
    time: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export default (models.Event as mongoose.Model<EventType>) || model<EventType>("Event", EventSchema);






