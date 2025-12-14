import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { sendOTPEmail } from "@/lib/email";
import crypto from "crypto";

// Register endpoint - just sends OTP (no password needed)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body as { email?: string };
    
    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    await connectDB();
    
    // Check if user already exists and is fully registered
    const existingUser = await User.findOne({ email, registered: true });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered. Please login instead." },
        { status: 409 }
      );
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Check if there's a pending signup (registered = false)
    let pendingUser = await User.findOne({ email, registered: false });
    
    if (pendingUser) {
      // Update existing pending user with new OTP
      pendingUser.verificationToken = otp;
      await pendingUser.save();
    } else {
      // Create new pending user (will complete registration after OTP verification)
      pendingUser = await User.create({
        email,
        name: "", // Will be set after OTP verification
        password: crypto.randomBytes(32).toString("hex"), // Dummy password (not used)
        role: "user",
        emailVerified: false,
        registered: false, // Will be set to true after OTP verification and profile completion
        verificationToken: otp,
      });
    }

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, "User");
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      return NextResponse.json(
        { success: false, message: "Failed to send OTP email. Please try again." },
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
  } catch (err) {
    console.error("Registration error:", err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}



