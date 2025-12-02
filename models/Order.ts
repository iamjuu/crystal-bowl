import mongoose, { Schema, models, model } from "mongoose";
import type { Order as OrderType, OrderItem } from "@/types";

const OrderItemSchema = new Schema<OrderItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema = new Schema<OrderType>(
  {
    userId: { type: String, required: true, index: true },
    items: { type: [OrderItemSchema], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["pending", "paid", "shipped", "delivered", "cancelled", "refunded"], default: "pending" },
    paymentProvider: { type: String },
    paymentRef: { type: String },
  },
  { timestamps: true }
);

export default (models.Order as mongoose.Model<OrderType>) || model<OrderType>("Order", OrderSchema);



