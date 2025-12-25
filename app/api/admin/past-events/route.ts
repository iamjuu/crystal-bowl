import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PastEvent from "@/models/PastEvent";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();
    
    const body = await req.json();
    const { name, title, location, day, time, date, description, thumbnailImage, photos, videos } = body;

    // Validation
    if (!name || !title || !location || !day || !time || !date || !description) {
      return NextResponse.json(
        { success: false, message: "Name, title, location, day, time, date, and description are required" },
        { status: 400 }
      );
    }

    if (!thumbnailImage) {
      return NextResponse.json(
        { success: false, message: "Thumbnail image is required" },
        { status: 400 }
      );
    }

    // Validate photos (max 6)
    const photosArray = Array.isArray(photos) ? photos.filter((p: string) => p && p.trim()) : [];
    if (photosArray.length > 6) {
      return NextResponse.json(
        { success: false, message: "Maximum 6 photos allowed" },
        { status: 400 }
      );
    }

    // Validate videos (max 2)
    const videosArray = Array.isArray(videos) ? videos.filter((v: string) => v && v.trim()) : [];
    if (videosArray.length > 2) {
      return NextResponse.json(
        { success: false, message: "Maximum 2 videos allowed" },
        { status: 400 }
      );
    }

    const pastEvent = await PastEvent.create({
      name: String(name).trim(),
      title: String(title).trim(),
      location: String(location).trim(),
      day: String(day).trim(),
      time: String(time).trim(),
      date: String(date).trim(),
      description: String(description).trim(),
      thumbnailImage: String(thumbnailImage).trim(),
      photos: photosArray,
      videos: videosArray,
    });

    return NextResponse.json(
      { success: true, data: pastEvent },
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

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();
    
    const pastEvents = await PastEvent.find().sort({ createdAt: -1 });
    
    return NextResponse.json(
      { success: true, data: pastEvents },
      { status: 200 }
    );
  } catch (e: any) {
    const status = e?.message === "FORBIDDEN" || e?.message === "UNAUTHORIZED" ? 403 : 500;
    return NextResponse.json(
      { success: false, message: e?.message || "Server error" },
      { status }
    );
  }
}

