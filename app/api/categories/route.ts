import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";

// GET /api/categories - Get all categories (public endpoint)
export async function GET() {
  try {
    await connectDB();
    
    const categories = await Category.find({}).sort({ name: 1 }).lean();
    
    // Return categories with proper formatting
    const categoriesWithDefaults = categories.map((cat: any) => ({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      imageUrl: cat.imageUrl || undefined,
      isFeatured: cat.isFeatured === true,
    }));
    
    return NextResponse.json({
      success: true,
      data: categoriesWithDefaults,
    });
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

