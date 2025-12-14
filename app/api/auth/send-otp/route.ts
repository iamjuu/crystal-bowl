import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { sendOTPEmail } from "@/lib/email";
import crypto from "crypto";

// Send OTP - works for both signup and login
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, phone } = body as { email?: string; name?: string; phone?: string };

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    await connectDB();

    // Check if user already exists and is registered
    const existingUser = await User.findOne({ email, registered: true });
    
    if (existingUser) {
      // User is registered - this is for login, just send OTP
      const otp = crypto.randomInt(100000, 999999).toString();
      existingUser.verificationToken = otp;
      await existingUser.save();

      try {
        await sendOTPEmail(email, otp, existingUser.name);
      } catch (emailError: any) {
        console.error("Email send error:", emailError);
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
          isLogin: true, // Indicates this is for login
        },
      });
    }

    // User doesn't exist or is not registered - this is for signup

    // For signup, name and phone are required
    if (!name || !phone) {
      return NextResponse.json(
        { success: false, message: "Name and phone number are required for signup" },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Check if there's a pending signup (registered = false)
    let pendingUser = await User.findOne({ email, registered: false });
    
    if (pendingUser) {
      // Update existing pending user with new OTP and details
      pendingUser.name = name;
      pendingUser.phone = phone.trim();
      pendingUser.verificationToken = otp;
      await pendingUser.save();
    } else {
      // Create new pending user with signup details
      pendingUser = await User.create({
        email,
        name,
        phone: phone.trim(),
        password: crypto.randomBytes(32).toString("hex"), // Dummy password (not used)
        emailVerified: false,
        registered: false, // Will be set to true after OTP verification
        verificationToken: otp,
      });
    }

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, name);
    } catch (emailError: any) {
      console.error("Email send error:", emailError);
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
        isLogin: false, // Indicates this is for signup
      },
    });
  } catch (err: any) {
    console.error("Send OTP error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Server error" },
      { status: 500 }
    );
  }
}



