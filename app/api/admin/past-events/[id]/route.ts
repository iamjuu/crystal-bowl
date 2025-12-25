import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PastEvent from "@/models/PastEvent";
import { requireAdmin } from "@/lib/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(req);
    await connectDB();
    const body = await req.json();
    const { id } = await context.params;
    
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

    const updated = await PastEvent.findByIdAndUpdate(
      id,
      {
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
      },
      { new: true }
    );
    
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Past event not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: updated });
  } catch (e: any) {
    const status = e?.message === "FORBIDDEN" || e?.message === "UNAUTHORIZED" ? 403 : 500;
    return NextResponse.json(
      { success: false, message: e?.message || "Server error" },
      { status }
    );
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { id } = await context.params;
    
    const deleted = await PastEvent.findByIdAndDelete(id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Past event not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (e: any) {
    const status = e?.message === "FORBIDDEN" || e?.message === "UNAUTHORIZED" ? 403 : 500;
    return NextResponse.json(
      { success: false, message: e?.message || "Server error" },
      { status }
    );
  }
}

