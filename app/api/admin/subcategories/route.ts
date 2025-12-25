import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Subcategory from "@/models/Subcategory";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/auth";
import mongoose from "mongoose";

// GET /api/admin/subcategories - Get all subcategories (with category populated)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const url = new URL(request.url);
    const categoryId = url.searchParams.get('categoryId');
    
    let query: any = {};
    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      query.category = categoryId;
    }
    
    const subcategories = await Subcategory.find(query)
      .populate('category', 'name slug')
      .sort({ name: 1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      data: subcategories,
    });
  } catch (error: any) {
    console.error("Error fetching subcategories:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch subcategories" },
      { status: 500 }
    );
  }
}

// POST /api/admin/subcategories - Create new subcategory
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    await connectDB();
    
    const body = await request.json();
    const { name, category, imageUrl } = body;
    
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Subcategory name is required" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category is required" },
        { status: 400 }
      );
    }

    // Validate category ID
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return NextResponse.json(
        { success: false, message: "Invalid category ID" },
        { status: 400 }
      );
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // Helper to capitalize
    const toTitleCase = (str: string) => str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    const capitalizedName = toTitleCase(name.trim());
    
    // Check if subcategory already exists in this category (case-insensitive)
    const existingSubcategory = await Subcategory.findOne({ 
      name: { $regex: new RegExp(`^${capitalizedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      category: category
    });
    
    if (existingSubcategory) {
      return NextResponse.json(
        { success: false, message: "Subcategory already exists in this category" },
        { status: 400 }
      );
    }
    
    const newSubcategoryData: any = {
      name: capitalizedName,
      category: category,
    };
    
    // Only add imageUrl if it has a value
    if (imageUrl && imageUrl.trim().length > 0) {
      newSubcategoryData.imageUrl = imageUrl.trim();
    }
    
    const subcategory = new Subcategory(newSubcategoryData);
    await subcategory.save();
    
    // Populate category before returning
    await subcategory.populate('category', 'name slug');
    
    return NextResponse.json({
      success: true,
      message: "Subcategory created successfully",
      data: subcategory,
    }, { status: 201 });
    
  } catch (error: any) {
    console.error("Error creating subcategory:", error);
    
    // Handle duplicate key error (compound unique index)
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Subcategory already exists in this category" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create subcategory" },
      { status: 500 }
    );
  }
}




