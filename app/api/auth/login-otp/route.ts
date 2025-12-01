import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { sendOTPEmail } from "@/lib/email";
import crypto from "crypto";

// Login with OTP - only for registered users
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body as { email?: string };

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    await connectDB();

    // Check if user exists and has started signup (registered = true)
    // They can login even if emailVerified = false (to complete OTP verification)
    const user = await User.findOne({ email, registered: true });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email not found. Please sign up first." },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store OTP in verificationToken temporarily
    user.verificationToken = otp;
    await user.save();

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, user.name);
    } catch (emailError: any) {
      console.error("Email send error:", emailError);
      return NextResponse.json(
        { success: false, message: "Failed to send OTP email. Please check your email configuration." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email",
      data: {
        email,
        expiresIn: 600, // 10 minutes in seconds
      },
    });
  } catch (err: any) {
    console.error("Login OTP error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Server error" },
      { status: 500 }
    );
  }
}

