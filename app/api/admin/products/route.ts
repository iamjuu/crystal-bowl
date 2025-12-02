import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();
    
    const body = await req.json();
    const { name, description, price, imageUrl, videoUrl } = body;

    // Validation
    if (!name || !description || !price) {
      return NextResponse.json(
        { success: false, message: "Name, description, and price are required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(imageUrl) || imageUrl.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one image is required" },
        { status: 400 }
      );
    }

    // Price should be in smallest currency unit (cents/paise)
    const priceInCents = Math.round(Number(price) * 100);
    if (isNaN(priceInCents) || priceInCents <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid price" },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name: String(name).trim(),
      description: String(description).trim(),
      price: priceInCents,
      imageUrl: imageUrl,
      videoUrl: videoUrl ? String(videoUrl).trim() : "",
    });

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (e: any) {
    const status = e?.message === "FORBIDDEN" || e?.message === "UNAUTHORIZED" ? 403 : 500;
    return NextResponse.json(
      { success: false, message: e?.message || "Server error" },
      { status }
    );
  }
}

