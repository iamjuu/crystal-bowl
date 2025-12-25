import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PastEvent from "@/models/PastEvent";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    const { id } = await context.params;
    
    const pastEvent = await PastEvent.findById(id).lean();
    
    if (!pastEvent) {
      return NextResponse.json(
        { success: false, message: "Past event not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, data: pastEvent },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Server error" },
      { status: 500 }
    );
  }
}

