import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: "Session ID is required" },
        { status: 400 }
      );
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Invalid session" },
        { status: 400 }
      );
    }

    // Verify the payment was successful
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { success: false, message: "Payment not completed" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if order already exists for this session
    const existingOrder = await Order.findOne({ paymentRef: sessionId });
    
    if (existingOrder) {
      return NextResponse.json({
        success: true,
        data: {
          orderId: existingOrder._id.toString(),
          amount: existingOrder.amount,
          status: existingOrder.status,
        },
      });
    }

    // Parse items from metadata
    const items = JSON.parse(session.metadata?.items || "[]");

    // Create order in database
    const order = await Order.create({
      userId: user._id,
      items: items.map((item: any) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      amount: session.amount_total || 0,
      currency: session.currency?.toUpperCase() || "INR",
      status: "paid",
      paymentProvider: "stripe",
      paymentRef: sessionId,
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: order._id.toString(),
        amount: order.amount,
        status: order.status,
      },
    });
  } catch (e: any) {
    console.error("Payment verification error:", e);
    const status = e?.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json(
      { success: false, message: e?.message || "Server error" },
      { status }
    );
  }
}

