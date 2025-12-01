import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ success: false, message: "Verification token required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 400 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ success: true, message: "Email already verified" });
    }

    // Verify the email
    user.emailVerified = true;
    user.verificationToken = null;
    await user.save();

    return NextResponse.json({ success: true, message: "Email verified successfully" });
  } catch (err: any) {
    console.error("Verification error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

