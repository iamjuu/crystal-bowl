import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json() as { email?: string };
    
    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({ 
        success: true, 
        message: "If an account exists with this email, a verification link has been sent" 
      });
    }

    if (user.emailVerified) {
      return NextResponse.json({ 
        success: false, 
        message: "Email is already verified. You can log in now." 
      }, { status: 400 });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    await user.save();

    // In production, send email with verification link
    // For now, return the token in development
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/verify-email?token=${verificationToken}`;
    
    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully",
      data: {
        verificationUrl: process.env.NODE_ENV === "development" ? verificationUrl : undefined,
      },
    });
  } catch (err: any) {
    console.error("Resend verification error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}


