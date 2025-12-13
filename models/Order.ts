import mongoose, { Schema, models, model } from "mongoose";
import type { Order as OrderType, OrderItem } from "@/types";

const OrderItemSchema = new Schema<OrderItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const ShippingAddressSchema = new Schema({
  line1: { type: String },
  line2: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  country: { type: String },
}, { _id: false });

const OrderSchema = new Schema<OrderType>(
  {
    userId: { type: String, required: true, index: true },
    items: { type: [OrderItemSchema], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: { type: String, enum: ["pending", "paid", "shipped", "delivered", "cancelled", "refunded"], default: "pending" },
    paymentProvider: { type: String },
    paymentRef: { type: String, index: true },
    shippingAddress: { type: ShippingAddressSchema },
    customerEmail: { type: String },
    customerName: { type: String },
  },
  { timestamps: true }
);

export default (models.Order as mongoose.Model<OrderType>) || model<OrderType>("Order", OrderSchema);



