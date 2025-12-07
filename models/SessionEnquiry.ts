import mongoose, { Schema, models, model } from "mongoose";

export interface SessionEnquiryType {
  _id: string;
  fullName: string;
  services: string;
  phone: string;
  email: string;
  comment?: string;
  status: "pending" | "contacted" | "completed";
  sessionType: "discovery" | "private" | "corporate";
  createdAt: Date;
  updatedAt: Date;
}

const SessionEnquirySchema = new Schema<SessionEnquiryType>(
  {
    fullName: { type: String, required: true },
    services: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    comment: { type: String },
    status: { 
      type: String, 
      enum: ["pending", "contacted", "completed"], 
      default: "pending" 
    },
    sessionType: { 
      type: String, 
      enum: ["discovery", "private", "corporate"], 
      default: "discovery" 
    },
  },
  { timestamps: true }
);

// Delete the cached model if it exists to ensure fresh schema
if (models.SessionEnquiry) {
  delete models.SessionEnquiry;
}

export default model<SessionEnquiryType>("SessionEnquiry", SessionEnquirySchema);

