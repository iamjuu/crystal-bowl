import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import DiscoverySession from "@/models/DiscoverySession";
import PrivateSession from "@/models/PrivateSession";
import CorporateSession from "@/models/CorporateSession";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    await connectDB();
    
    // Fetch all bookings for user, optionally filter by sessionType
    const { searchParams } = new URL(req.url);
    const sessionType = searchParams.get("sessionType");
    
    let query: any = { userId: user._id };
    if (sessionType && ["discovery", "private", "corporate"].includes(sessionType)) {
      query.sessionType = sessionType;
    }
    
    const bookings = await Booking.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: bookings });
  } catch (e: any) {
    const status = e?.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json({ success: false, message: e?.message || "Server error" }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const { sessionId, sessionType, seats, phone, comment, slotId } = (await req.json()) as { 
      sessionId?: string;
      sessionType?: "discovery" | "private" | "corporate";
      seats?: number; 
      phone?: string; 
      comment?: string;
      slotId?: string; // For discovery/private slot reference
    };
    
    if (!sessionId || !sessionType) {
      return NextResponse.json({ 
        success: false, 
        message: "Session ID and type are required" 
      }, { status: 400 });
    }
    
    if (!seats || seats <= 0) {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid seats" 
      }, { status: 400 });
    }
    
    if (!phone || phone.trim() === "") {
      return NextResponse.json({ 
        success: false, 
        message: "Phone number is required" 
      }, { status: 400 });
    }

    await connectDB();
    
    let session: any;
    let amount = 0;
    
    // Fetch session based on type
    if (sessionType === "discovery") {
      session = await DiscoverySession.findById(sessionId);
      if (!session) {
        return NextResponse.json({ 
          success: false, 
          message: "Discovery session not found" 
        }, { status: 404 });
      }
      // Discovery: one-on-one, no payment
      if (session.totalSeats !== 1 || session.bookedSeats >= 1) {
        return NextResponse.json({ 
          success: false, 
          message: "Session is already booked" 
        }, { status: 400 });
      }
      amount = 0; // No payment
    } else if (sessionType === "private") {
      // Private sessions should go through enquiry + payment flow
      return NextResponse.json({ 
        success: false, 
        message: "Private sessions require payment. Please use the enquiry form first." 
      }, { status: 400 });
    } else if (sessionType === "corporate") {
      // Corporate: enquiry only, no direct booking
      return NextResponse.json({ 
        success: false, 
        message: "Corporate sessions are enquiry-based. Please submit an enquiry form." 
      }, { status: 400 });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid session type" 
      }, { status: 400 });
    }

    // Update booked seats (only for discovery)
    if (sessionType === "discovery") {
      session.bookedSeats = 1;
      await session.save();
    }

    // Create booking (only for discovery - auto-confirmed)
    const booking = await Booking.create({ 
      userId: user._id, 
      sessionId, 
      sessionType, 
      seats: 1, 
      amount: 0, // No payment
      status: "confirmed", // Auto-confirmed for discovery
      phone: phone?.trim(),
      comment: comment?.trim() || undefined,
      slotId: slotId || undefined, // Store slot reference if provided
    });
    
    return NextResponse.json({ 
      success: true, 
      data: booking,
      requiresPayment: false, // No payment for discovery
    }, { status: 201 });
  } catch (e: any) {
    const status = e?.message === "UNAUTHORIZED" ? 401 : 400;
    return NextResponse.json({ 
      success: false, 
      message: e?.message || "Bad request" 
    }, { status });
  }
}
