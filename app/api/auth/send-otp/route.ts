import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { sendOTPEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, phone } = body as { email?: string; name?: string; phone?: string };

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    await connectDB();

    // Check if user already exists and is registered (completed signup form)
    const existingUser = await User.findOne({ email, registered: true });
    
    if (existingUser) {
      // If emailVerified is false, they need to complete OTP verification via login
      if (!existingUser.emailVerified) {
        return NextResponse.json(
          { success: false, message: "Please login to complete OTP verification." },
          { status: 409 }
        );
      }
      // If fully registered and verified, tell them to login
      return NextResponse.json(
        { success: false, message: "Email already registered. Please login instead." },
        { status: 409 }
      );
    }

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
      // Create user with signup details, but registered = false until OTP verified
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
      await sendOTPEmail(email, otp, "User");
    } catch (emailError: any) {
      console.error("Email send error:", emailError);
      // Don't fail the request if email fails, but log it
      // In production, you might want to handle this differently
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
    console.error("Send OTP error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Server error" },
      { status: 500 }
    );
  }
}



