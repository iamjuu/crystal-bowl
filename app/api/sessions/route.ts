import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import DiscoverySession from "@/models/DiscoverySession";
import PrivateSession from "@/models/PrivateSession";
import YogaSession from "@/models/YogaSession"; // For corporate
import { requireAdmin } from "@/lib/auth";

export async function GET(_req: NextRequest) {
  try {
    await connectDB();
    
    // Fetch from all collections
    const [discoverySessions, privateSessions, corporateSessions] = await Promise.all([
      DiscoverySession.find().sort({ date: 1, startTime: 1 }).lean(),
      PrivateSession.find().sort({ date: 1, startTime: 1 }).lean(),
      YogaSession.find({ sessionType: "corporate" }).sort({ date: 1, startTime: 1 }).lean(),
    ]);

    // Add sessionType to each for frontend filtering
    const allSessions = [
      ...discoverySessions.map(s => ({ ...s, sessionType: "discovery" })),
      ...privateSessions.map(s => ({ ...s, sessionType: "private" })),
      ...corporateSessions.map(s => ({ ...s, sessionType: "corporate" })),
    ];

    return NextResponse.json({ success: true, data: allSessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();
    const body = await req.json();
    const created = await YogaSession.create(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (e: any) {
    const status = e?.message === "FORBIDDEN" || e?.message === "UNAUTHORIZED" ? 403 : 500;
    return NextResponse.json({ success: false, message: e?.message || "Server error" }, { status });
  }
}
