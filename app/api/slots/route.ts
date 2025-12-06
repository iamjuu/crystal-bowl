import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AvailableSlot from "@/models/AvailableSlot";

// POST - Add a new available slot
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

    // Check if slot already exists
    const existingSlot = await AvailableSlot.findOne({
      sessionType,
      date,
      time,
    });

    if (existingSlot) {
      return NextResponse.json(
        { success: false, message: "This slot already exists" },
        { status: 400 }
      );
    }

    // Create new slot
    const slot = await AvailableSlot.create({
      sessionType,
      month,
      date,
      time,
      isBooked: false,
    });

    return NextResponse.json(
      { success: true, message: "Slot added successfully", data: slot },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating slot:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add slot" },
      { status: 500 }
    );
  }
}

// GET - Fetch slots
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const sessionType = searchParams.get("sessionType");
    const showAll = searchParams.get("showAll"); // If 'true', show all slots including booked

    let query: Record<string, any> = {};
    
    // Filter by booked status (default: only show available)
    if (showAll !== "true") {
      query.isBooked = false;
    }
    
    // Filter by session type
    if (sessionType && (sessionType === "discovery" || sessionType === "private")) {
      query.sessionType = sessionType;
    }

    const slots = await AvailableSlot.find(query).sort({ date: 1, time: 1 });

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

