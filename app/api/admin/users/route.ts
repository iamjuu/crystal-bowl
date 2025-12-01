import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();

    const users = await User.find()
      .select("-password -verificationToken")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: users.map((u) => ({
        _id: String(u._id),
        name: u.name,
        email: u.email,
        role: u.role,
        emailVerified: u.emailVerified,
        registered: u.registered,
        phone: u.phone,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      })),
    });
  } catch (e: any) {
    const status = e?.message === "FORBIDDEN" || e?.message === "UNAUTHORIZED" ? 403 : 500;
    return NextResponse.json({ success: false, message: e?.message || "Server error" }, { status });
  }
}

