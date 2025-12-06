import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();
    
    const body = await req.json();
    const { name, title, description, imageUrl } = body;

    // Validation
    if (!name || !title || !description) {
      return NextResponse.json(
        { success: false, message: "Name, title, and description are required" },
        { status: 400 }
      );
    }

    const blog = await Blog.create({
      name: String(name).trim(),
      title: String(title).trim(),
      description: String(description).trim(),
      imageUrl: imageUrl ? String(imageUrl).trim() : undefined,
    });

    return NextResponse.json(
      { success: true, data: blog },
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
    
    const blogs = await Blog.find().sort({ createdAt: -1 });
    
    return NextResponse.json(
      { success: true, data: blogs },
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






