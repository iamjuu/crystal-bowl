import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PastEvent from "@/models/PastEvent";

export async function GET(_req: NextRequest) {
  try {
    await connectDB();
    
    const pastEvents = await PastEvent.find().sort({ date: -1 }); // Sort by date descending (newest first)
    
    return NextResponse.json(
      { success: true, data: pastEvents },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Server error" },
      { status: 500 }
    );
  }
}

