import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const events = await Event.find().sort({ date: 1 }); // Sort by date ascending (upcoming first)
    
    return NextResponse.json(
      { success: true, data: events },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Server error" },
      { status: 500 }
    );
  }
}

