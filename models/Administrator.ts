import mongoose, { Schema, models, model } from "mongoose";
import type { IAdministrator } from "@/types";

const AdministratorSchema = new Schema<IAdministrator>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default (models.Administrator as mongoose.Model<IAdministrator>) || model<IAdministrator>("Administrator", AdministratorSchema);

