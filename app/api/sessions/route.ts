import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import YogaSession from "@/models/YogaSession";
import { requireAdmin } from "@/lib/auth";

export async function GET(_req: NextRequest) {
  try {
    await connectDB();
    const sessions = await YogaSession.find().sort({ date: 1, startTime: 1 }).lean();
    return NextResponse.json({ success: true, data: sessions });
  } catch {
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



