import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Administrator from "@/models/Administrator";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    console.log("Admin login request received");
    const { email, password } = (await req.json()) as { email?: string; password?: string };
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    const admin = await Administrator.findOne({ email });
    if (!admin) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    const ok = await comparePassword(password, admin.password);
    if (!ok) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ userId: String(admin._id), role: "admin", isAdmin: true });
    const res = NextResponse.json({ success: true, data: { token, role: "admin" } });
    res.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

