import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import PrivateSession from "@/models/PrivateSession";
import SessionEnquiry from "@/models/SessionEnquiry";
import User from "@/models/User";
import type { IUser } from "@/types";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const authUser = await requireAuth(req);
    await connectDB();
    
    const user = await User.findById(authUser._id).lean<IUser>();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: "Session ID is required" },
        { status: 400 }
      );
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'customer_details'],
    });

    if (!session || session.payment_status !== "paid") {
      return NextResponse.json(
        { success: false, message: "Payment not completed" },
        { status: 400 }
      );
    }

    // Check if booking already exists for this session
    const existingBooking = await Booking.findOne({ paymentRef: sessionId });
    if (existingBooking) {
      return NextResponse.json({
        success: true,
        data: existingBooking,
        message: "Booking already exists",
      });
    }

    // Get metadata from session
    const metadata = session.metadata;
    
    console.log("🔍 Session metadata:", metadata);
    
    // Verify required metadata fields - support both slotId (new flow) and sessionId+enquiryId (old flow)
    if (!metadata) {
      console.error("❌ Metadata is missing from session");
      return NextResponse.json(
        { success: false, message: "Invalid session metadata: metadata is missing" },
        { status: 400 }
      );
    }

    // Check if this is the new slotId-based flow or old enquiry-based flow
    const slotId = metadata.slotId;
    const oldSessionId = metadata.sessionId;
    const enquiryId = metadata.enquiryId;

    let privateSession;
    let sessionIdToUse;

    if (slotId) {
      // New flow: slotId directly references the PrivateSession
      sessionIdToUse = slotId;
      privateSession = await PrivateSession.findById(slotId);
      
      if (!privateSession) {
        return NextResponse.json(
          { success: false, message: "Private session not found" },
          { status: 404 }
        );
      }

      if (privateSession.bookedSeats >= privateSession.totalSeats) {
        return NextResponse.json(
          { success: false, message: "Session is already fully booked" },
          { status: 400 }
        );
      }
    } else if (oldSessionId && enquiryId) {
      // Old flow: sessionId + enquiryId
      sessionIdToUse = oldSessionId;
      privateSession = await PrivateSession.findById(oldSessionId);
      
    if (!privateSession) {
      return NextResponse.json(
        { success: false, message: "Private session not found" },
        { status: 404 }
      );
    }

    if (privateSession.bookedSeats >= privateSession.totalSeats) {
      return NextResponse.json(
        { success: false, message: "Session is already fully booked" },
        { status: 400 }
      );
    }

      // Update enquiry status for old flow
      const enquiry = await SessionEnquiry.findById(enquiryId);
    if (enquiry) {
      enquiry.status = "completed";
      await enquiry.save();
      }
    } else {
      // Invalid metadata - neither flow has required fields
      console.error("❌ Invalid metadata - missing required fields:", {
        hasSlotId: !!slotId,
        hasSessionId: !!oldSessionId,
        hasEnquiryId: !!enquiryId,
        metadata: metadata
      });
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid session metadata: missing required fields (slotId or sessionId+enquiryId)",
          metadata: metadata
        },
        { status: 400 }
      );
    }

    // Verify user matches metadata
    if (metadata.userId && metadata.userId !== user._id.toString()) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: session belongs to different user" },
        { status: 403 }
      );
    }

    // Create the booking
    const booking = await Booking.create({
      userId: String(user._id),
      sessionId: sessionIdToUse,
      sessionType: metadata.sessionType || "private",
      seats: 1, // Private sessions are always 1 seat
      amount: session.amount_total ? Math.round(session.amount_total / 100) : privateSession.price, // Convert from cents
      status: "confirmed",
      paymentProvider: "stripe",
      paymentRef: sessionId,
      paymentStatus: "paid",
      phone: user.phone || metadata.phone || "N/A",
      comment: metadata.comment || `Private Session - ${metadata.date || privateSession.date} at ${metadata.time || privateSession.startTime}`,
    });

    // Update session booked seats
    privateSession.bookedSeats = (privateSession.bookedSeats || 0) + 1;
    await privateSession.save();

    return NextResponse.json({
      success: true,
      data: booking,
      message: "Booking created successfully",
    });
  } catch (e: any) {
    console.error("Verification error details:", {
      message: e?.message,
      name: e?.name,
      stack: e?.stack,
    });
    const status = e?.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json(
      { 
        success: false, 
        message: e?.message || "Server error",
        error: process.env.NODE_ENV === "development" ? e?.stack : undefined
      },
      { status }
    );
  }
}
