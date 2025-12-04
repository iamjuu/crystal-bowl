import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = (await req.json()) as { email?: string; password?: string };
    console.log(email, password);
    if (!email || !password) return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });

    await connectDB();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not registered. Please sign up first." }, { status: 404 });
    }

    // Check password
    const ok = await comparePassword(password, user.password);
    if (!ok) {
      return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
    }

    const token = signToken({ userId: String(user._id), role: user.role });
    const res = NextResponse.json({ success: true, data: { token, role: user.role } });
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



