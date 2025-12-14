import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

// Verify OTP - works for both signup and login
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp, name, phone } = body as {
      email?: string;
      otp?: string;
      name?: string; // For first-time registration
      phone?: string; // For first-time registration
    };

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user by email (could be pending signup or registered user)
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP. Please start signup again." },
        { status: 400 }
      );
    }

    // Verify OTP
    if (user.verificationToken !== otp) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Check if OTP is expired (10 minutes)
    const createdAt = new Date(user.createdAt);
    const now = new Date();
    const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

    if (diffMinutes > 10) {
      // Only delete if it's a pending signup
      if (!user.registered) {
        await User.deleteOne({ _id: user._id });
      }
      return NextResponse.json(
        { success: false, message: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Clear OTP after verification
    user.verificationToken = null;

    // If user is already registered, just log them in
    if (user.registered) {
      user.emailVerified = true; // Mark as verified
      await user.save();

      const token = signToken({ userId: String(user._id), role: user.role });

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
    }

    // If user is NOT registered (first-time signup), complete registration
    if (!name || !phone) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Please provide name and phone to complete registration",
          requiresRegistration: true 
        },
        { status: 400 }
      );
    }

    // Complete registration - set registered = true and emailVerified = true
    user.name = name;
    user.phone = phone.trim();
    user.emailVerified = true; // OTP verified
    user.registered = true; // Registration completed
    await user.save();

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
    console.error("Verify OTP error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Server error" },
      { status: 500 }
    );
  }
}



