import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Subcategory from "@/models/Subcategory";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";
import mongoose from "mongoose";

// DELETE /api/admin/subcategories/[id] - Delete subcategory
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    await connectDB();
    
    const { id } = await context.params;
    
    // Check if any products are using this subcategory
    const subcategory = await Subcategory.findById(id);
    if (!subcategory) {
      return NextResponse.json(
        { success: false, message: "Subcategory not found" },
        { status: 404 }
      );
    }
    
    const productsWithSubcategory = await Product.countDocuments({ subcategory: id });
    
    if (productsWithSubcategory > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Cannot delete subcategory. ${productsWithSubcategory} product(s) are using this subcategory.` 
        },
        { status: 400 }
      );
    }
    
    await Subcategory.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: "Subcategory deleted successfully",
    });
    
  } catch (error: any) {
    console.error("Error deleting subcategory:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete subcategory" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/subcategories/[id] - Update subcategory
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    await connectDB();
    
    const { id } = await context.params;
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

    const oldSubcategory = await Subcategory.findById(id);
    if (!oldSubcategory) {
      return NextResponse.json(
        { success: false, message: "Subcategory not found" },
        { status: 404 }
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
    
    // Check if new name conflicts with existing subcategory in the same category
    const existingSubcategory = await Subcategory.findOne({ 
      name: { $regex: new RegExp(`^${capitalizedName}$`, 'i') },
      category: category,
      _id: { $ne: id }
    });
    
    if (existingSubcategory) {
      return NextResponse.json(
        { success: false, message: "Subcategory name already exists in this category" },
        { status: 400 }
      );
    }
    
    const updateData: any = {
      name: capitalizedName,
      category: category,
    };
    
    // Handle imageUrl
    if (imageUrl !== undefined) {
      if (imageUrl && imageUrl.trim().length > 0) {
        updateData.imageUrl = imageUrl.trim();
      } else {
        // If empty string, remove the image
        updateData.imageUrl = undefined;
      }
    }
    
    const updated = await Subcategory.findByIdAndUpdate(id, updateData, { new: true })
      .populate('category', 'name slug');
    
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Failed to update subcategory" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Subcategory updated successfully",
      data: updated,
    });
    
  } catch (error: any) {
    console.error("Error updating subcategory:", error);
    
    // Handle duplicate key error (compound unique index)
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Subcategory name already exists in this category" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update subcategory" },
      { status: 500 }
    );
  }
}




