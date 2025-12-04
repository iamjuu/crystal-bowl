import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import YogaSession from "@/models/YogaSession";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();
    
    const body = await req.json();
    const { title, description, sessionType, imageUrl, videoUrl } = body;

    // Validation
    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: "Title and description are required" },
        { status: 400 }
      );
    }

    if (!imageUrl && !videoUrl) {
      return NextResponse.json(
        { success: false, message: "Either image or video is required" },
        { status: 400 }
      );
    }

    // Map sessionType: "discovery" -> "regular"
    let mappedSessionType: "regular" | "corporate" | "private" = "regular";
    if (sessionType === "discovery") {
      mappedSessionType = "regular";
    } else if (sessionType === "corporate") {
      mappedSessionType = "corporate";
    } else if (sessionType === "private") {
      mappedSessionType = "private";
    }

    // Create a new session with minimal required fields
    // Note: The form only provides title, description, image/video
    // Other fields like instructor, date, time, price, seats can be added later or set to defaults
    const session = await YogaSession.create({
      title: String(title).trim(),
      description: String(description).trim(),
      sessionType: mappedSessionType,
      imageUrl: imageUrl ? String(imageUrl).trim() : undefined,
      videoUrl: videoUrl ? String(videoUrl).trim() : undefined,
      // Set default values for required fields
      instructor: "TBD",
      date: new Date().toISOString().split("T")[0], // Today's date as default
      startTime: "09:00",
      endTime: "10:00",
      totalSeats: 1,
      bookedSeats: 0,
      price: 0, // Can be updated later
    });

    return NextResponse.json(
      { success: true, data: session },
      { status: 201 }
    );
  } catch (e: any) {
    const status = e?.message === "FORBIDDEN" || e?.message === "UNAUTHORIZED" ? 403 : 500;
    return NextResponse.json(
      { success: false, message: e?.message || "Server error" },
      { status }
    );
  }
}

