import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { requireAuth } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const body = await req.json();
    
    await connectDB();
    const dbUser = await User.findById(user._id);
    
    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Update fields
    if (body.name !== undefined) dbUser.name = body.name;
    if (body.phone !== undefined) dbUser.phone = body.phone;
    if (body.imageUrl !== undefined) dbUser.imageUrl = body.imageUrl || undefined;
    if (body.address !== undefined) {
      dbUser.address = {
        street: body.address.street || "",
        city: body.address.city || "",
        state: body.address.state || "",
        zipCode: body.address.zipCode || "",
        country: body.address.country || "",
      };
    }

    await dbUser.save();

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



