import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

// Verify OTP for login (only registered users)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body as {
      email?: string;
      otp?: string;
    };

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find registered user with matching email and OTP
    const user = await User.findOne({ email, registered: true });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found. Please sign up first." },
        { status: 404 }
      );
    }

    // Verify OTP
    if (user.verificationToken !== otp) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Clear OTP after verification
    user.verificationToken = null;
    await user.save();

    // Generate JWT token for auto-login
    const token = signToken({ userId: String(user._id), role: user.role });

    // Return response with token and set cookie
    const res = NextResponse.json({
      success: true,
      message: "Login successful!",
      data: {
        token,
        user: {
          id: String(user._id),
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });

    // Set token as HTTP-only cookie
    res.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err: any) {
    console.error("Verify login OTP error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Server error" },
      { status: 500 }
    );
  }
}

