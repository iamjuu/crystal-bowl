import mongoose, { Schema, models, model } from "mongoose";

export interface SessionEnquiryType {
  _id: string;
  fullName: string;
  address: string;
  dateOfBirth: string;
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
    address: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
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

export default (models.SessionEnquiry as mongoose.Model<SessionEnquiryType>) || 
  model<SessionEnquiryType>("SessionEnquiry", SessionEnquirySchema);

