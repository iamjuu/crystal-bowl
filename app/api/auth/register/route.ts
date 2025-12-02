import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";
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
    
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "user",
      emailVerified: false,
      verificationToken,
    });

    // In production, send email with verification link
    // For now, return the token in development
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/verify-email?token=${verificationToken}`;
    
    return NextResponse.json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        message: "Please verify your email to continue",
        verificationUrl: process.env.NODE_ENV === "development" ? verificationUrl : undefined,
      },
    });
  } catch (err: any) {
    console.error("Registration error:", err);
    const errorMessage = err?.message || "Server error";
    return NextResponse.json(
      { success: false, message: errorMessage, error: process.env.NODE_ENV === "development" ? String(err) : undefined },
      { status: 500 }
    );
  }
}



