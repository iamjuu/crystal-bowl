import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Administrator from "@/models/Administrator";
import { hashPassword } from "@/lib/auth";

// Default admin credentials
const DEFAULT_EMAIL = "admin@gmail.com";
const DEFAULT_PASSWORD = "password";
const DEFAULT_NAME = "Admin";

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

    let body;
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const { email = DEFAULT_EMAIL, password = DEFAULT_PASSWORD, name = DEFAULT_NAME } = body as {
      email?: string;
      password?: string;
      name?: string;
    };

    // Check if admin already exists
    const existing = await Administrator.findOne({ email });
    const hashedPassword = await hashPassword(password);

    let admin;
    if (existing) {
      // Update existing admin
      existing.password = hashedPassword;
      existing.name = name;
      await existing.save();
      admin = existing;
    } else {
      // Create new admin
      admin = await Administrator.create({
        email,
        password: hashedPassword,
        name,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        message: existing ? "Admin updated" : "Admin created",
      },
    });
  } catch (err: unknown) {
    console.error("Admin seed error:", err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

// GET endpoint to automatically seed default admin
export async function GET() {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { success: false, message: "Seeding disabled in production" },
        { status: 403 }
      );
    }

    await connectDB();

    // Check if admin already exists
    const existing = await Administrator.findOne({ email: DEFAULT_EMAIL });
    const hashedPassword = await hashPassword(DEFAULT_PASSWORD);

    let admin;
    if (existing) {
      // Update existing admin
      existing.password = hashedPassword;
      existing.name = DEFAULT_NAME;
      await existing.save();
      admin = existing;
    } else {
      // Create new admin
      admin = await Administrator.create({
        email: DEFAULT_EMAIL,
        password: hashedPassword,
        name: DEFAULT_NAME,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        message: existing ? "Admin updated" : "Admin created",
      },
    });
  } catch (err: unknown) {
    console.error("Admin seed error:", err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}



