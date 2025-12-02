import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getAuthUserFromToken } from "@/lib/auth";

// Verify token and check if user is registered
export async function GET(req: NextRequest) {
  try {
    const header = req.headers.get("authorization");
    if (!header) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const [, token] = header.split(" ");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Invalid token format" },
        { status: 401 }
      );
    }

    const user = await getAuthUserFromToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    await connectDB();
    const dbUser = await User.findById(user._id);
    
    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if user is registered
    if (!dbUser.registered) {
      return NextResponse.json(
        { success: false, message: "User not registered. Please sign up first." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: String(dbUser._id),
          email: dbUser.email,
          name: dbUser.name,
          registered: dbUser.registered,
        },
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Server error" },
      { status: 500 }
    );
  }
}



