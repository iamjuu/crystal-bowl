import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import User from "@/models/User";
import YogaSession from "@/models/YogaSession";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    const query: any = {};
    if (sessionId) {
      query.sessionId = sessionId;
    }

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Populate user and session information
    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        const [user, session] = await Promise.all([
          User.findById(booking.userId).select("name email phone").lean(),
          YogaSession.findById(booking.sessionId).lean(),
        ]);

        // Type guard to ensure user is a single document, not an array
        const userDoc = user && !Array.isArray(user) ? user : null;
        const sessionDoc = session && !Array.isArray(session) ? session : null;

        return {
          _id: String(booking._id),
          userId: String(booking.userId),
          sessionId: String(booking.sessionId),
          seats: booking.seats,
          amount: booking.amount,
          status: booking.status,
          phone: booking.phone,
          comment: booking.comment,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
          user: userDoc && 'name' in userDoc
            ? {
                name: String(userDoc.name),
                email: String(userDoc.email),
                phone: userDoc.phone ? String(userDoc.phone) : undefined,
              }
            : null,
          session: sessionDoc && 'instructor' in sessionDoc
            ? {
                instructor: String(sessionDoc.instructor),
                date: String(sessionDoc.date),
                startTime: String(sessionDoc.startTime),
                endTime: String(sessionDoc.endTime),
              }
            : null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: bookingsWithDetails,
    });
  } catch (e: any) {
    const status = e?.message === "FORBIDDEN" || e?.message === "UNAUTHORIZED" ? 403 : 500;
    return NextResponse.json({ success: false, message: e?.message || "Server error" }, { status });
  }
}



