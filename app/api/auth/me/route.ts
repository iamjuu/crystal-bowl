import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    await connectDB();
    const dbUser = await User.findById(user._id).select("-password").lean();
    
    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        _id: String(dbUser._id),
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone || "",
        imageUrl: dbUser.imageUrl || undefined,
        address: dbUser.address || {},
      },
    });
  } catch (err: any) {
    const status = err?.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json(
      { success: false, message: err?.message || "Server error" },
      { status }
    );
  }
}



