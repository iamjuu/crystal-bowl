import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();
    
    const body = await req.json();
    const { name, shortDescription, description, category, price, imageUrl, videoUrl } = body;

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

    // Price should be in rupees/dollars (not cents/paise)
    const priceString = String(price).trim();
    const priceInRupees = parseFloat(priceString);
    
    console.log("=== PRODUCT CREATION DEBUG ===");
    console.log("Raw price received:", price);
    console.log("Price type:", typeof price);
    console.log("Price string:", priceString);
    console.log("Parsed price:", priceInRupees);
    console.log("Is NaN?", isNaN(priceInRupees));
    console.log("==============================");
    
    if (isNaN(priceInRupees) || priceInRupees <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid price" },
        { status: 400 }
      );
    }

    // Handle videoUrl - can be string or array
    let processedVideoUrl: string | string[] = [];
    if (videoUrl) {
      if (Array.isArray(videoUrl)) {
        processedVideoUrl = videoUrl.filter(v => v && String(v).trim()).map(v => String(v).trim());
      } else {
        processedVideoUrl = [String(videoUrl).trim()];
      }
    }

    const product = await Product.create({
      name: String(name).trim(),
      shortDescription: shortDescription ? String(shortDescription).trim() : "",
      description: String(description).trim(),
      category: category || undefined,
      price: priceInRupees,
      imageUrl: imageUrl,
      videoUrl: processedVideoUrl.length > 0 ? processedVideoUrl : [],
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

