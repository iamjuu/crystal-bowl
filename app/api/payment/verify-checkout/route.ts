import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import Stripe from "stripe";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(req: NextRequest) {
  try {
    console.log("🔍 Starting payment verification...");
    
    const user = await requireAuth(req);
    console.log("✅ User authenticated:", user._id);
    
    const { sessionId } = await req.json();
    console.log("📝 Session ID:", sessionId);

    if (!sessionId) {
      console.log("❌ No session ID provided");
      return NextResponse.json(
        { success: false, message: "Session ID is required" },
        { status: 400 }
      );
    }

    // Retrieve the checkout session from Stripe
    console.log("🔄 Retrieving session from Stripe...");
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent', 'customer_details'],
      // Note: shipping_details may not always be available, so we handle it conditionally
    });
    console.log("✅ Session retrieved:", {
      id: session.id,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
    });

    if (!session) {
      console.log("❌ Invalid session");
      return NextResponse.json(
        { success: false, message: "Invalid session" },
        { status: 400 }
      );
    }

    // Verify the session belongs to the authenticated user
    console.log("🔍 Verifying user:", {
      sessionUserId: session.metadata?.userId,
      authenticatedUserId: user._id.toString(),
    });
    
    if (session.metadata?.userId !== user._id.toString()) {
      console.log("❌ User ID mismatch");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    console.log("🔄 Connecting to MongoDB...");
    await connectDB();
    console.log("✅ MongoDB connected");

    // Check if order already exists for this session
    console.log("🔍 Checking for existing order...");
    const existingOrder = await Order.findOne({ paymentRef: sessionId });
    if (existingOrder) {
      console.log("✅ Order already exists:", existingOrder._id);
      return NextResponse.json({
        success: true,
        data: {
          orderId: existingOrder._id,
          amount: existingOrder.amount,
          status: existingOrder.status,
        },
      });
    }
    console.log("✅ No existing order found");

    // Only create order if payment was successful
    console.log("🔍 Checking payment status:", session.payment_status);
    if (session.payment_status !== "paid") {
      console.log("❌ Payment not completed:", session.payment_status);
      return NextResponse.json(
        { success: false, message: "Payment not completed" },
        { status: 400 }
      );
    }
    console.log("✅ Payment status is paid");

    // Parse items from metadata
    console.log("📦 Parsing items from metadata...");
    const items = JSON.parse(session.metadata?.items || "[]");
    console.log("✅ Items parsed:", items);

    // Create order in database
    console.log("💾 Creating order in database...");
    const orderData = {
      userId: user._id,
      items: items,
      amount: session.amount_total ? Math.round(session.amount_total / 100) : 0, // Convert from cents to dollars
      currency: session.currency?.toUpperCase() || "USD",
      status: "paid",
      paymentProvider: "stripe",
      paymentRef: sessionId,
      shippingAddress: (session as any).shipping_details?.address ? {
        line1: (session as any).shipping_details.address.line1 || "",
        line2: (session as any).shipping_details.address.line2 || "",
        city: (session as any).shipping_details.address.city || "",
        state: (session as any).shipping_details.address.state || "",
        postalCode: (session as any).shipping_details.address.postal_code || "",
        country: (session as any).shipping_details.address.country || "",
      } : undefined,
      customerEmail: (session as any).customer_details?.email || "",
      customerName: (session as any).customer_details?.name || "",
    };
    console.log("📝 Order data:", JSON.stringify(orderData, null, 2));
    
    const order = await Order.create(orderData);
    console.log("✅ Order created successfully:", order._id);

    return NextResponse.json({
      success: true,
      data: {
        orderId: order._id,
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

