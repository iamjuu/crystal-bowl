import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

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

    // This endpoint is only for signup - find pending user
    const pendingUser = await User.findOne({ email, registered: false });

    if (!pendingUser) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP. Please start signup again." },
        { status: 400 }
      );
    }

    // Verify OTP
    if (pendingUser.verificationToken !== otp) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Check if OTP is expired (10 minutes)
    const createdAt = new Date(pendingUser.createdAt);
    const now = new Date();
    const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

    if (diffMinutes > 10) {
      await User.deleteOne({ _id: pendingUser._id });
      return NextResponse.json(
        { success: false, message: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // After OTP verification, complete signup
    // Name and phone should already be set during send-otp, but verify
    if (!pendingUser.name || !pendingUser.phone) {
      return NextResponse.json(
        { success: false, message: "Signup incomplete. Please start signup again." },
        { status: 400 }
      );
    }

    // Complete registration - set registered = true and emailVerified = true
    pendingUser.emailVerified = true; // OTP verified
    pendingUser.registered = true; // Signup form completed
    pendingUser.verificationToken = null;
    await pendingUser.save();

    const user = pendingUser;

    // Generate JWT token for auto-login
    const token = signToken({ userId: String(user._id), role: user.role });

    // Return response with token and set cookie
    const res = NextResponse.json({
      success: true,
      message: "Account created successfully. You are now logged in!",
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

    // Set token as HTTP-only cookie (same as login)
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
    console.error("Verify OTP error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Server error" },
      { status: 500 }
    );
  }
}

