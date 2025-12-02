import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body as { name?: string; email?: string; password?: string };
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    await connectDB();
    const existing = await User.findOne({ email });
    if (existing) return NextResponse.json({ success: false, message: "Email already in use" }, { status: 409 });

    const hashed = await hashPassword(password);
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    
    // Auto-verify in development, require verification in production
    const autoVerify = process.env.NODE_ENV === "development";
    
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "user",
      emailVerified: autoVerify,
      verificationToken: autoVerify ? null : verificationToken,
    });

    // In production, send email with verification link
    // In development, auto-verify
    if (autoVerify) {
      return NextResponse.json({
        success: true,
        data: {
          id: user._id,
          email: user.email,
          message: "Account created successfully! You can now login.",
        },
      });
    } else {
      const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/verify-email?token=${verificationToken}`;
      
      // Send verification email in production
      try {
        await sendVerificationEmail(user.email, user.name, verificationUrl);
      } catch (emailError) {
        console.error("Failed to send verification email:", emailError);
        // Continue even if email fails - user can resend later
      }
      
      return NextResponse.json({
        success: true,
        data: {
          id: user._id,
          email: user.email,
          message: "Please check your email to verify your account",
          verificationUrl: process.env.NODE_ENV === "development" ? verificationUrl : undefined,
        },
      });
    }
  } catch (err) {
    console.error("Registration error:", err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { success: false, message: errorMessage, error: process.env.NODE_ENV === "development" ? String(err) : undefined },
      { status: 500 }
    );
  }
}



