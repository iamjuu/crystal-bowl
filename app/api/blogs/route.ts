import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const blogs = await Blog.find().sort({ createdAt: -1 }); // Sort by newest first
    
    return NextResponse.json(
      { success: true, data: blogs },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Server error" },
      { status: 500 }
    );
  }
}

