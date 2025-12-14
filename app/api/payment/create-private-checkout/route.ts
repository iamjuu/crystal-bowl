import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import type { IUser } from "@/types";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", );

export async function POST(req: NextRequest) {
  try {
    const authUser = await requireAuth(req);
    await connectDB();
    
    // Get full user details including email
    const user = await User.findById(authUser._id).lean<IUser>();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    
    const body = await req.json();
    const { slotId, amount, date, time } = body;

    // Get base URL from request or environment variable
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    
    if (!baseUrl) {
      // Try to get from origin header (includes protocol)
      const origin = req.headers.get('origin');
      if (origin && (origin.startsWith('http://') || origin.startsWith('https://'))) {
        baseUrl = origin;
      } else {
        // Fallback: construct from host header
        const host = req.headers.get('host') || req.headers.get('x-forwarded-host');
        const protocol = req.headers.get('x-forwarded-proto') || 
                        req.headers.get('x-forwarded-protocol') ||
                        (host?.includes('localhost') ? 'http' : 'https');
        baseUrl = host ? `${protocol}://${host}` : 'http://localhost:3000';
      }
    }
    
    console.log('Stripe checkout baseUrl:', baseUrl);

    if (!slotId || !amount || !date || !time) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid amount" },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Private Yoga Session",
              description: `${date} at ${time}`,
            },
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/privateappointment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/privateappointment`,
      metadata: {
        userId: String(user._id),
        slotId: slotId,
        sessionType: "private",
        date: date,
        time: time,
      },
      customer_email: user.email || undefined,
    });

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (e: any) {
    console.error("Stripe checkout error:", e);
    const status = e?.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json(
      { success: false, message: e?.message || "Server error" },
      { status }
    );
  }
}


