import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import DiscoverySession from "@/models/DiscoverySession";
import PrivateSession from "@/models/PrivateSession";
import YogaSession from "@/models/YogaSession"; // Keep for corporate
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();
    
    const body = await req.json();
    const { 
      title, 
      description, 
      sessionType, 
      imageUrl, 
      videoUrl, 
      format, 
      benefits,
      instructorName, // New field for discovery/private
      duration, // New field (in minutes)
      price, // For private sessions only
      date, // Date for discovery/private
      startTime, // Start time for discovery/private
    } = body;

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

    // Filter out empty benefits
    const filteredBenefits = Array.isArray(benefits) 
      ? benefits.filter((b: string) => b && b.trim().length > 0).map((b: string) => String(b).trim())
      : [];

    let session;

    if (sessionType === "discovery") {
      // Validation for discovery
      if (!instructorName) {
        return NextResponse.json(
          { success: false, message: "Instructor name is required for discovery sessions" },
          { status: 400 }
        );
      }
      if (!duration || duration <= 0) {
        return NextResponse.json(
          { success: false, message: "Duration is required (in minutes)" },
          { status: 400 }
        );
      }
      if (!date) {
        return NextResponse.json(
          { success: false, message: "Date is required" },
          { status: 400 }
        );
      }
      if (!startTime) {
        return NextResponse.json(
          { success: false, message: "Start time is required" },
          { status: 400 }
        );
      }

      // Calculate endTime from startTime and duration
      const [hours, minutes] = startTime.split(':').map(Number);
      const startMinutes = hours * 60 + minutes;
      const endMinutes = startMinutes + Number(duration);
      const endHours = Math.floor(endMinutes / 60);
      const endMins = endMinutes % 60;
      const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;

      // Check for existing sessions at the same date and time (discovery or private)
      const existingDiscovery = await DiscoverySession.findOne({
        date: String(date).trim(),
        startTime: String(startTime).trim(),
      });

      const existingPrivate = await PrivateSession.findOne({
        date: String(date).trim(),
        startTime: String(startTime).trim(),
      });

      if (existingDiscovery || existingPrivate) {
        const existingSession = existingDiscovery || existingPrivate;
        return NextResponse.json(
          { 
            success: false, 
            message: `A session already exists on ${date} at ${startTime}. Please choose a different date or time.` 
          },
          { status: 400 }
        );
      }

      // Also check for time overlaps (if sessions overlap in time)
      const allDiscoverySessions = await DiscoverySession.find({
        date: String(date).trim(),
      }).lean();

      const allPrivateSessions = await PrivateSession.find({
        date: String(date).trim(),
      }).lean();

      const allSessions = [...allDiscoverySessions, ...allPrivateSessions];

      // Check for time overlap
      for (const existingSession of allSessions) {
        const existingStart = existingSession.startTime.split(':').map(Number);
        const existingEnd = existingSession.endTime.split(':').map(Number);
        const existingStartMinutes = existingStart[0] * 60 + existingStart[1];
        const existingEndMinutes = existingEnd[0] * 60 + existingEnd[1];
        const newStartMinutes = hours * 60 + minutes;
        const newEndMinutes = endHours * 60 + endMins;

        // Check if times overlap
        if (
          (newStartMinutes >= existingStartMinutes && newStartMinutes < existingEndMinutes) ||
          (newEndMinutes > existingStartMinutes && newEndMinutes <= existingEndMinutes) ||
          (newStartMinutes <= existingStartMinutes && newEndMinutes >= existingEndMinutes)
        ) {
          return NextResponse.json(
            { 
              success: false, 
              message: `Time conflict: A session already exists on ${date} from ${existingSession.startTime} to ${existingSession.endTime}. Please choose a different time.` 
            },
            { status: 400 }
          );
        }
      }

      session = await DiscoverySession.create({
        title: String(title).trim(),
        description: String(description).trim(),
        instructorName: String(instructorName).trim(),
        duration: Number(duration),
        date: String(date).trim(),
        startTime: String(startTime).trim(),
        endTime,
        totalSeats: 1, // One-on-one
        bookedSeats: 0,
        price: 0, // No payment
        imageUrl: imageUrl ? String(imageUrl).trim() : undefined,
        videoUrl: videoUrl ? String(videoUrl).trim() : undefined,
        format: format ? String(format).trim() : undefined,
        benefits: filteredBenefits,
      });
    } else if (sessionType === "private") {
      // Validation for private
      if (!instructorName) {
        return NextResponse.json(
          { success: false, message: "Instructor name is required for private sessions" },
          { status: 400 }
        );
      }
      if (!duration || duration <= 0) {
        return NextResponse.json(
          { success: false, message: "Duration is required (in minutes)" },
          { status: 400 }
        );
      }
      if (!price || price <= 0) {
        return NextResponse.json(
          { success: false, message: "Price is required for private sessions" },
          { status: 400 }
        );
      }
      if (!date) {
        return NextResponse.json(
          { success: false, message: "Date is required" },
          { status: 400 }
        );
      }
      if (!startTime) {
        return NextResponse.json(
          { success: false, message: "Start time is required" },
          { status: 400 }
        );
      }

      // Calculate endTime from startTime and duration
      const [hours, minutes] = startTime.split(':').map(Number);
      const startMinutes = hours * 60 + minutes;
      const endMinutes = startMinutes + Number(duration);
      const endHours = Math.floor(endMinutes / 60);
      const endMins = endMinutes % 60;
      const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;

      // Check for existing sessions at the same date and time (discovery or private)
      const existingDiscovery = await DiscoverySession.findOne({
        date: String(date).trim(),
        startTime: String(startTime).trim(),
      });

      const existingPrivate = await PrivateSession.findOne({
        date: String(date).trim(),
        startTime: String(startTime).trim(),
      });

      if (existingDiscovery || existingPrivate) {
        const existingSession = existingDiscovery || existingPrivate;
        return NextResponse.json(
          { 
            success: false, 
            message: `A session already exists on ${date} at ${startTime}. Please choose a different date or time.` 
          },
          { status: 400 }
        );
      }

      // Also check for time overlaps (if sessions overlap in time)
      const allDiscoverySessions = await DiscoverySession.find({
        date: String(date).trim(),
      }).lean();

      const allPrivateSessions = await PrivateSession.find({
        date: String(date).trim(),
      }).lean();

      const allSessions = [...allDiscoverySessions, ...allPrivateSessions];

      // Check for time overlap
      for (const existingSession of allSessions) {
        const existingStart = existingSession.startTime.split(':').map(Number);
        const existingEnd = existingSession.endTime.split(':').map(Number);
        const existingStartMinutes = existingStart[0] * 60 + existingStart[1];
        const existingEndMinutes = existingEnd[0] * 60 + existingEnd[1];
        const newStartMinutes = hours * 60 + minutes;
        const newEndMinutes = endHours * 60 + endMins;

        // Check if times overlap
        if (
          (newStartMinutes >= existingStartMinutes && newStartMinutes < existingEndMinutes) ||
          (newEndMinutes > existingStartMinutes && newEndMinutes <= existingEndMinutes) ||
          (newStartMinutes <= existingStartMinutes && newEndMinutes >= existingEndMinutes)
        ) {
          return NextResponse.json(
            { 
              success: false, 
              message: `Time conflict: A session already exists on ${date} from ${existingSession.startTime} to ${existingSession.endTime}. Please choose a different time.` 
            },
            { status: 400 }
          );
        }
      }

      session = await PrivateSession.create({
        title: String(title).trim(),
        description: String(description).trim(),
        instructorName: String(instructorName).trim(),
        duration: Number(duration),
        price: Number(price),
        date: String(date).trim(),
        startTime: String(startTime).trim(),
        endTime,
        totalSeats: 1, // One-on-one
        bookedSeats: 0,
        imageUrl: imageUrl ? String(imageUrl).trim() : undefined,
        videoUrl: videoUrl ? String(videoUrl).trim() : undefined,
        format: format ? String(format).trim() : undefined,
        benefits: filteredBenefits,
      });
    } else if (sessionType === "corporate") {
      // Corporate session - keep using YogaSession model (enquiry-based)
      session = await YogaSession.create({
        title: String(title).trim(),
        description: String(description).trim(),
        sessionType: "corporate",
        imageUrl: imageUrl ? String(imageUrl).trim() : undefined,
        videoUrl: videoUrl ? String(videoUrl).trim() : undefined,
        format: format ? String(format).trim() : undefined,
        benefits: filteredBenefits,
        // Set default values for required fields
        instructor: "TBD",
        date: new Date().toISOString().split("T")[0],
        startTime: "09:00",
        endTime: "10:00",
        totalSeats: 10, // Default for corporate
        bookedSeats: 0,
        price: 0,
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid session type" },
        { status: 400 }
      );
    }

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
