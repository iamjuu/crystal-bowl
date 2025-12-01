import mongoose, { Schema, models, model } from "mongoose";
import type { IUser } from "@/types";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: false }, // Optional - not needed for OTP-based auth
    role: { type: String, enum: ["user"], default: "user" },
    emailVerified: { type: Boolean, default: false },
    registered: { type: Boolean, default: false }, // true when user completed initial signup
    verificationToken: { type: String, default: null },
    phone: { type: String, required: false }, 
    addresses: [{
      street: { type: String, required: false },
      city: { type: String, required: false },
      state: { type: String, required: false },
      zipCode: { type: String, required: false },
      country: { type: String, required: false },
    }],
    // Keep address for backward compatibility (single address)
    address: {
      street: { type: String, required: false },
      city: { type: String, required: false },
      state: { type: String, required: false },
      zipCode: { type: String, required: false },
      country: { type: String, required: false },
    },
  },
  { timestamps: true }
);

export default (models.User as mongoose.Model<IUser>) || model<IUser>("User", UserSchema);

