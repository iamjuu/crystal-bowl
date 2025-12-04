import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Administrator from "@/models/Administrator";
import { requireAdmin, hashPassword } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAdmin(req);
    await connectDB();
    
    const admin = await Administrator.findById(user._id).select("-password").lean();
    
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Administrator not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, data: admin },
      { status: 200 }
    );
  } catch (e: any) {
    const status = e?.message === "FORBIDDEN" || e?.message === "UNAUTHORIZED" ? 403 : 500;
    return NextResponse.json(
      { success: false, message: e?.message || "Server error" },
      { status }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAdmin(req);
    await connectDB();
    
    const body = await req.json();
    const { name, email, password, imageUrl } = body;

    const updateData: any = {};
    
    if (name !== undefined) {
      updateData.name = String(name).trim();
    }
    
    if (email !== undefined) {
      const trimmedEmail = String(email).trim();
      // Check if email is already taken by another admin
      const existingAdmin = await Administrator.findOne({ 
        email: trimmedEmail,
        _id: { $ne: user._id }
      });
      if (existingAdmin) {
        return NextResponse.json(
          { success: false, message: "Email is already in use" },
          { status: 400 }
        );
      }
      updateData.email = trimmedEmail;
    }
    
    if (password !== undefined && password !== "") {
      if (password.length < 6) {
        return NextResponse.json(
          { success: false, message: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }
      updateData.password = await hashPassword(String(password));
    }
    
    if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl ? String(imageUrl).trim() : undefined;
    }

    const updated = await Administrator.findByIdAndUpdate(
      user._id,
      updateData,
      { new: true }
    ).select("-password");

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Administrator not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updated },
      { status: 200 }
    );
  } catch (e: any) {
    const status = e?.message === "FORBIDDEN" || e?.message === "UNAUTHORIZED" ? 403 : 500;
    return NextResponse.json(
      { success: false, message: e?.message || "Server error" },
      { status }
    );
  }
}

