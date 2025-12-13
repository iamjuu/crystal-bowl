import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import DiscoverySession from "@/models/DiscoverySession";
import PrivateSession from "@/models/PrivateSession";

// POST - Add a new available slot (kept for backward compatibility, but not used anymore)
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { sessionType, month, date, time } = body;

    // Validate required fields
    if (!sessionType || !month || !date || !time) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // This endpoint is deprecated - slots are now created directly with sessions
    return NextResponse.json(
      { success: false, message: "Slots are now created with sessions. Please create a session instead." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error creating slot:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add slot" },
      { status: 500 }
    );
  }
}

// GET - Fetch slots from DiscoverySession and PrivateSession collections
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const sessionType = searchParams.get("sessionType");
    const showAll = searchParams.get("showAll"); // If 'true', show all slots including booked

    let slots: any[] = [];

    // Fetch from DiscoverySession if sessionType is discovery or not specified
    if (!sessionType || sessionType === "discovery") {
      let discoveryQuery: Record<string, any> = {};
      
      // Filter by booked status (default: only show available)
      if (showAll !== "true") {
        // Only show sessions where bookedSeats < totalSeats (not fully booked)
        // For discovery sessions, totalSeats is always 1, so we check bookedSeats < 1 (i.e., bookedSeats === 0)
        discoveryQuery.$or = [
          { bookedSeats: { $exists: false } }, // Handle sessions without bookedSeats field
          { bookedSeats: { $lt: 1 } }, // Not booked (0)
        ];
      }

      const discoverySessions = await DiscoverySession.find(discoveryQuery)
        .sort({ date: 1, startTime: 1 })
        .lean();

      console.log('Discovery sessions found:', discoverySessions.length, 'with query:', discoveryQuery);

      // Convert DiscoverySession to slot format
      const discoverySlots = discoverySessions
        .filter((session: any) => {
          // Double-check: filter out fully booked sessions
          const isBooked = (session.bookedSeats || 0) >= (session.totalSeats || 1);
          if (isBooked) {
            console.log('Filtering out booked session:', {
              id: session._id,
              date: session.date,
              time: session.startTime,
              bookedSeats: session.bookedSeats,
              totalSeats: session.totalSeats
            });
          }
          return !isBooked;
        })
        .map((session: any) => ({
          _id: session._id,
          sessionType: "discovery",
          month: new Date(session.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long' }),
          date: session.date,
          time: session.startTime,
          isBooked: (session.bookedSeats || 0) >= (session.totalSeats || 1),
        }));

      slots = [...slots, ...discoverySlots];
    }

    // Fetch from PrivateSession if sessionType is private or not specified
    if (!sessionType || sessionType === "private") {
      let privateQuery: Record<string, any> = {};
      
      // Filter by booked status (default: only show available)
      if (showAll !== "true") {
        // Only show sessions where bookedSeats < totalSeats (not fully booked)
        privateQuery.$or = [
          { bookedSeats: { $exists: false } }, // Handle sessions without bookedSeats field
          { bookedSeats: { $lt: 1 } }, // Not booked (0)
        ];
      }

      const privateSessions = await PrivateSession.find(privateQuery)
        .sort({ date: 1, startTime: 1 })
        .lean();

      // Convert PrivateSession to slot format
      const privateSlots = privateSessions
        .filter((session: any) => {
          // Double-check: filter out fully booked sessions
          return (session.bookedSeats || 0) < (session.totalSeats || 1);
        })
        .map((session: any) => ({
          _id: session._id,
          sessionType: "private",
          month: new Date(session.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long' }),
          date: session.date,
          time: session.startTime,
          isBooked: (session.bookedSeats || 0) >= (session.totalSeats || 1),
          price: session.price || 0, // Include price from session
        }));

      slots = [...slots, ...privateSlots];
    }

    // Sort all slots by date and time
    slots.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });

    return NextResponse.json(
      { success: true, data: slots },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching slots:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch slots" },
      { status: 500 }
    );
  }
}

