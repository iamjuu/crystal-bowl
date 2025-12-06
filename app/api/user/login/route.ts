import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = (await req.json()) as { email?: string; password?: string };
    console.log("User login request:", email);
    
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    // ONLY search in User collection (not Administrator collection)
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: "User not registered. Please sign up first." 
      }, { status: 404 });
    }

    // Check password
    const ok = await comparePassword(password, user.password);
    if (!ok) {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid password" 
      }, { status: 401 });
    }

    // Generate user token (without isAdmin flag)
    const token = signToken({ userId: String(user._id), role: "user" });
    const res = NextResponse.json({ 
      success: true, 
      data: { token, role: "user" } 
    });
    
    // Set user-specific cookie (separate from admin token)
    res.cookies.set({
      name: "userToken",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error) {
    console.error("User login error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error details:", errorMessage);
    return NextResponse.json(
      { 
        success: false, 
        message: "Server error", 
        error: process.env.NODE_ENV === "development" ? errorMessage : undefined 
      },
      { status: 500 }
    );
  }
}

