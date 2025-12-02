import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import YogaSession from "@/models/YogaSession";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    await connectDB();
    const bookings = await Booking.find({ userId: user._id }).lean();
    return NextResponse.json({ success: true, data: bookings });
  } catch (e: any) {
    const status = e?.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json({ success: false, message: e?.message || "Server error" }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const { sessionId, seats, phone, comment } = (await req.json()) as { 
      sessionId?: string; 
      seats?: number; 
      phone?: string; 
      comment?: string; 
    };
    if (!sessionId || !seats || seats <= 0) return NextResponse.json({ success: false, message: "Invalid input" }, { status: 400 });
    if (!phone || phone.trim() === "") return NextResponse.json({ success: false, message: "Phone number is required" }, { status: 400 });

    await connectDB();
    const session = await YogaSession.findById(sessionId);
    if (!session) return NextResponse.json({ success: false, message: "Session not found" }, { status: 404 });
    if (session.bookedSeats + seats > session.totalSeats) return NextResponse.json({ success: false, message: "Not enough seats" }, { status: 400 });

    session.bookedSeats += seats;
    await session.save();
    const amount = session.price * seats;
    const booking = await Booking.create({ 
      userId: user._id, 
      sessionId, 
      seats, 
      amount, 
      status: "pending",
      phone: phone?.trim(),
      comment: comment?.trim() || undefined,
    });
    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (e: any) {
    const status = e?.message === "UNAUTHORIZED" ? 401 : 400;
    return NextResponse.json({ success: false, message: e?.message || "Bad request" }, { status });
  }
}



