import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";

// DELETE /api/admin/categories/[id] - Delete category
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    await connectDB();
    
    const { id } = await context.params;
    
    // Check if any products are using this category
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }
    
    const productsWithCategory = await Product.countDocuments({ category: category.name });
    
    if (productsWithCategory > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Cannot delete category. ${productsWithCategory} product(s) are using this category.` 
        },
        { status: 400 }
      );
    }
    
    await Category.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
    
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/categories/[id] - Update category
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    await connectDB();
    
    const { id } = await context.params;
    const body = await request.json();
    const { name, imageUrl, isFeatured } = body;
    
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Category name is required" },
        { status: 400 }
      );
    }
    
    const oldCategory = await Category.findById(id);
    if (!oldCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // Check if trying to set as featured
    if (isFeatured === true && oldCategory.isFeatured !== true) {
      // Count existing featured categories (excluding current one)
      const featuredCount = await Category.countDocuments({ 
        isFeatured: true,
        _id: { $ne: id }
      });
      if (featuredCount >= 4) {
        return NextResponse.json(
          { success: false, message: "Maximum 4 featured categories allowed. Please unfeature another category first." },
          { status: 400 }
        );
      }
    }
    
    // Helper to capitalize
    const toTitleCase = (str: string) => str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    const capitalizedName = toTitleCase(name.trim());
    
    // Check if new name conflicts with existing category
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${capitalizedName}$`, 'i') },
      _id: { $ne: id }
    });
    
    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: "Category name already exists" },
        { status: 400 }
      );
    }
    
    // Update products that use the old category name
    if (oldCategory.name !== capitalizedName) {
      await Product.updateMany(
        { category: oldCategory.name },
        { $set: { category: capitalizedName } }
      );
    }
    
    // Build update object - ALWAYS explicitly set all fields
    const updateData: any = { 
      name: capitalizedName,
      isFeatured: Boolean(isFeatured), // ALWAYS set to true or false (never undefined)
    };

    // Handle imageUrl - only include if it has a value
    if (imageUrl !== undefined) {
      // imageUrl was explicitly provided in the request
      if (imageUrl && imageUrl.trim().length > 0) {
        updateData.imageUrl = imageUrl.trim();
      }
      // If empty string, don't include it (will preserve existing or leave undefined)
    } else {
      // imageUrl not in request - preserve existing value if any
      if (oldCategory.imageUrl) {
        updateData.imageUrl = oldCategory.imageUrl;
      }
    }

    console.log("Updating category with data:", JSON.stringify(updateData, null, 2)); // Debug log
    console.log("isFeatured value:", updateData.isFeatured, "Type:", typeof updateData.isFeatured); // Debug log
    console.log("Old category:", JSON.stringify(oldCategory.toObject(), null, 2)); // Debug log

    // Use $set to explicitly update fields - this ensures fields are saved
    const category = await Category.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true, upsert: false }
    ).lean();
    
    // CRITICAL: Reload from database to verify what was actually saved
    const reloadedCategory = await Category.findById(id).lean();
    
    if (!reloadedCategory) {
      return NextResponse.json(
        { success: false, message: "Failed to update category" },
        { status: 500 }
      );
    }
    
    console.log("Category updated in DB (reloaded):", JSON.stringify({
      _id: reloadedCategory._id,
      name: reloadedCategory.name,
      isFeatured: reloadedCategory.isFeatured,
      imageUrl: reloadedCategory.imageUrl ? `${reloadedCategory.imageUrl.substring(0, 50)}...` : "not set",
      slug: reloadedCategory.slug
    }, null, 2)); // Debug log
    
    // Ensure response includes all fields with defaults
    const categoryWithDefaults = {
      ...reloadedCategory,
      imageUrl: reloadedCategory.imageUrl || undefined,
      isFeatured: reloadedCategory.isFeatured === true,
    };
    
    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      data: categoryWithDefaults,
    });
    
  } catch (error: any) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update category" },
      { status: 500 }
    );
  }
}

