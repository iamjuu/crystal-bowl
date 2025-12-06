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

    // ONLY search in Administrator collection (not User collection)
    const admin = await Administrator.findOne({ email });
    if (!admin) {
      return NextResponse.json({ success: false, message: "Invalid admin credentials" }, { status: 401 });
    }

    const ok = await comparePassword(password, admin.password);
    if (!ok) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ userId: String(admin._id), role: "admin", isAdmin: true });
    const res = NextResponse.json({ success: true, data: { token, role: "admin" } });
    
    // Set admin-specific cookie (separate from user token)
    res.cookies.set({
      name: "adminToken",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    console.error("Admin login error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Error details:", { errorMessage, errorStack });
    return NextResponse.json(
      { success: false, message: "Server error", error: process.env.NODE_ENV === "development" ? errorMessage : undefined },
      { status: 500 }
    );
  }
}



