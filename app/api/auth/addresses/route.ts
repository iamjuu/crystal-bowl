import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getAuthUserFromToken } from "@/lib/auth";

// GET - Get all addresses for the user
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const user = await getAuthUserFromToken(token);
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const dbUser = await User.findById(user._id);
    if (!dbUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Return addresses array, or empty array if not set
    const addresses = Array.isArray(dbUser.addresses) ? dbUser.addresses : [];

    return NextResponse.json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    console.error("[GET /api/auth/addresses] error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// POST - Create a new address
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const user = await getAuthUserFromToken(token);
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { street, city, state, zipCode, country } = body;

    await connectDB();
    const dbUser = await User.findById(user._id);
    if (!dbUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Initialize addresses array if it doesn't exist
    if (!Array.isArray(dbUser.addresses)) {
      dbUser.addresses = [];
    }

    // Add new address
    const newAddress = {
      street: street || "",
      city: city || "",
      state: state || "",
      zipCode: zipCode || "",
      country: country || "",
    };

    dbUser.addresses.push(newAddress);
    await dbUser.save();

    return NextResponse.json({
      success: true,
      data: dbUser.addresses,
      message: "Address added successfully",
    });
  } catch (error) {
    console.error("[POST /api/auth/addresses] error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// DELETE - Delete an address by index
export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const user = await getAuthUserFromToken(token);
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const index = parseInt(searchParams.get("index") || "-1", 10);

    if (index < 0) {
      return NextResponse.json({ success: false, message: "Invalid address index" }, { status: 400 });
    }

    await connectDB();
    const dbUser = await User.findById(user._id);
    if (!dbUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Initialize addresses array if it doesn't exist
    if (!Array.isArray(dbUser.addresses)) {
      dbUser.addresses = [];
    }

    if (index >= dbUser.addresses.length) {
      return NextResponse.json({ success: false, message: "Address not found" }, { status: 404 });
    }

    // Remove address at index
    dbUser.addresses.splice(index, 1);
    await dbUser.save();

    return NextResponse.json({
      success: true,
      data: dbUser.addresses,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("[DELETE /api/auth/addresses] error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}



