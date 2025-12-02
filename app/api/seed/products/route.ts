import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

// Seed sample products - should be protected in production
export async function POST(_req: NextRequest) {
  try {
    // Check if this should be allowed (e.g., only in development)
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { success: false, message: "Seeding disabled in production" },
        { status: 403 }
      );
    }

    await connectDB();

    // Sample products
    const sampleProducts = [
      {
        name: "Crystal Singing Bowl - 8 inch",
        description: "Beautiful crystal singing bowl perfect for meditation and healing",
        price: 15000, // in smallest currency unit (paise)
        imageUrl: [],
      },
      {
        name: "Tibetan Singing Bowl Set",
        description: "Authentic handmade Tibetan singing bowl with cushion and mallet",
        price: 8000,
        imageUrl: [],
      },
      {
        name: "Meditation Cushion",
        description: "Comfortable meditation cushion filled with buckwheat hulls",
        price: 3500,
        imageUrl: [],
      },
    ];

    // Only seed if no products exist
    const count = await Product.countDocuments();
    if (count > 0) {
      return NextResponse.json(
        { success: false, message: "Products already exist" },
        { status: 409 }
      );
    }

    const products = await Product.insertMany(sampleProducts);

    return NextResponse.json({
      success: true,
      data: products,
      message: `Seeded ${products.length} products`,
    });
  } catch (err: any) {
    console.error("Product seed error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Server error" },
      { status: 500 }
    );
  }
}



