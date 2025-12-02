import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Administrator from "@/models/Administrator";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    console.log("Admin registration request received");
    const { name, email, password } = (await req.json()) as { name?: string; email?: string; password?: string };
    
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });
    }

    await connectDB();

    // Check if admin with this email already exists
    const existing = await Administrator.findOne({ email });
    if (existing) {
      return NextResponse.json({ success: false, message: "Email already in use" }, { status: 409 });
    }

    // Hash password
    const hashed = await hashPassword(password);

    // Create new administrator
    const admin = await Administrator.create({
      name,
      email,
      password: hashed,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        message: "Administrator account created successfully",
      },
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Error details:", { errorMessage, errorStack });
    return NextResponse.json(
      { success: false, message: "Server error", error: process.env.NODE_ENV === "development" ? errorMessage : undefined },
      { status: 500 }
    );
  }
}

