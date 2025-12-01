import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Administrator from "@/models/Administrator";
import { hashPassword } from "@/lib/auth";

// Seed initial admin user - should be protected in production
export async function POST(req: NextRequest) {
  try {
    // Check if this should be allowed (e.g., only in development)
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { success: false, message: "Seeding disabled in production" },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await req.json();
    const { email, password, name } = body as { email?: string; password?: string; name?: string };

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, message: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existing = await Administrator.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Admin already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const admin = await Administrator.create({
      email,
      password: hashedPassword,
      name,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (err: any) {
    console.error("Admin seed error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Server error" },
      { status: 500 }
    );
  }
}

