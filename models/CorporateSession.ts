import mongoose, { Schema, models, model } from "mongoose";

export interface CorporateSessionType {
  _id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  employeeCount: number;
  date: string; // ISO date
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  duration: number; // in minutes
  price: number;
  sessionName?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  format?: string;
  benefits?: string[];
  status?: string; // "pending", "confirmed", "completed", "cancelled"
  createdAt: Date;
  updatedAt: Date;
}

const CorporateSessionSchema = new Schema<CorporateSessionType>(
  {
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    employeeCount: { type: Number, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    price: { type: Number, required: true },
    sessionName: { type: String },
    title: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    videoUrl: { type: String },
    format: { type: String },
    benefits: { type: [String], default: [] },
    status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

// Force deletion to ensure schema updates
if (models.CorporateSession) {
  delete models.CorporateSession;
}

export default model<CorporateSessionType>("CorporateSession", CorporateSessionSchema);


