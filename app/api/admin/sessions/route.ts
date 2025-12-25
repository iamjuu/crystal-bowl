import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import DiscoverySession from "@/models/DiscoverySession";
import PrivateSession from "@/models/PrivateSession";
import CorporateSession from "@/models/CorporateSession";
import FreeStudioVisit from "@/models/FreeStudioVisit";
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
      featured, // For private and corporate sessions
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

    // Validate featured count for private and corporate sessions (separate limits for each type)
    if (featured === true && sessionType === "private") {
      const featuredPrivateCount = await PrivateSession.countDocuments({ featured: true });
      
      if (featuredPrivateCount >= 3) {
        return NextResponse.json(
          { success: false, message: "Maximum 3 featured sessions allowed for private sessions. Please unfeature another private session first." },
          { status: 400 }
        );
      }
    }
    
    if (featured === true && sessionType === "corporate") {
      const featuredCorporateCount = await CorporateSession.countDocuments({ featured: true });
      
      if (featuredCorporateCount >= 3) {
        return NextResponse.json(
          { success: false, message: "Maximum 3 featured sessions allowed for corporate sessions. Please unfeature another corporate session first." },
          { status: 400 }
        );
      }
    }

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
        // Type guard: ensure session has startTime and endTime
        if (!('startTime' in existingSession) || !('endTime' in existingSession) || 
            !existingSession.startTime || !existingSession.endTime) {
          continue; // Skip sessions without time info
        }
        const existingStart = (existingSession.startTime as string).split(':').map(Number);
        const existingEnd = (existingSession.endTime as string).split(':').map(Number);
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
          const sessionStartTime = existingSession.startTime as string;
          const sessionEndTime = existingSession.endTime as string;
          return NextResponse.json(
            { 
              success: false, 
              message: `Time conflict: A session already exists on ${date} from ${sessionStartTime} to ${sessionEndTime}. Please choose a different time.` 
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
        // Type guard: ensure session has startTime and endTime
        if (!('startTime' in existingSession) || !('endTime' in existingSession) || 
            !existingSession.startTime || !existingSession.endTime) {
          continue; // Skip sessions without time info
        }
        const existingStart = (existingSession.startTime as string).split(':').map(Number);
        const existingEnd = (existingSession.endTime as string).split(':').map(Number);
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
          const sessionStartTime = existingSession.startTime as string;
          const sessionEndTime = existingSession.endTime as string;
          return NextResponse.json(
            { 
              success: false, 
              message: `Time conflict: A session already exists on ${date} from ${sessionStartTime} to ${sessionEndTime}. Please choose a different time.` 
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
        featured: featured === true || featured === "true" || featured === 1,
      });
    } else if (sessionType === "corporate") {
      // Corporate session - save to CorporateSession collection
      session = await CorporateSession.create({
        title: String(title).trim(),
        description: String(description).trim(),
        imageUrl: imageUrl ? String(imageUrl).trim() : undefined,
        videoUrl: videoUrl ? String(videoUrl).trim() : undefined,
        format: format ? String(format).trim() : undefined,
        benefits: filteredBenefits,
        featured: featured === true || featured === "true" || featured === 1,
        // Set default values for required fields (these will be updated when company books)
        companyName: "Pending",
        contactPerson: "TBD",
        email: "tbd@example.com",
        phone: "0000000000",
        employeeCount: 0,
        date: new Date().toISOString().split("T")[0],
        startTime: "09:00",
        endTime: "10:00",
        duration: 60,
        price: 0,
        status: "pending",
      });
    } else if (sessionType === "freeStudioVisit") {
      // Free Studio Visit - save to FreeStudioVisit collection
      if (!duration) {
        return NextResponse.json(
          { success: false, message: "Duration is required for Free Studio Visit" },
          { status: 400 }
        );
      }
      session = await FreeStudioVisit.create({
        title: String(title).trim(),
        description: String(description).trim(),
        imageUrl: imageUrl ? String(imageUrl).trim() : undefined,
        videoUrl: videoUrl ? String(videoUrl).trim() : undefined,
        duration: Number(duration),
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
