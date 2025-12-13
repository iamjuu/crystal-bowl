import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/auth";

// GET /api/admin/categories - Get all categories
export async function GET() {
  try {
    await connectDB();
    
    const categories = await Category.find({}).sort({ name: 1 }).lean();
    
    // Ensure all categories have the new fields
    const categoriesWithDefaults = categories.map((cat: any) => ({
      ...cat,
      imageUrl: cat.imageUrl || undefined,
      isFeatured: cat.isFeatured === true, // Explicitly set boolean
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

// POST /api/admin/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    await connectDB();
    
    const body = await request.json();
    const { name, imageUrl, isFeatured } = body;
    
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Category name is required" },
        { status: 400 }
      );
    }

    // Check if trying to set as featured
    if (isFeatured === true) {
      // Count existing featured categories
      const featuredCount = await Category.countDocuments({ isFeatured: true });
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
    
    // Check if category already exists (case-insensitive)
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${capitalizedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } 
    });
    
    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: "Category already exists" },
        { status: 400 }
      );
    }
    
    // Prepare category data - ALWAYS explicitly set all fields
    // CRITICAL: Always set isFeatured and imageUrl explicitly, never undefined
    const isFeaturedValue = isFeatured === true || isFeatured === "true" || isFeatured === 1;
    
    console.log("Received data:", {
      name,
      isFeatured,
      isFeaturedType: typeof isFeatured,
      imageUrl: imageUrl ? `${imageUrl.substring(0, 50)}...` : imageUrl === "" ? "empty string" : "undefined",
      imageUrlLength: imageUrl?.length || 0
    }); // Debug log
    
    const newCategoryData: any = {
      name: capitalizedName,
      isFeatured: Boolean(isFeaturedValue), // ALWAYS boolean: true or false
    };
    
    // Only add imageUrl if it has a value (MongoDB won't save empty strings)
    if (imageUrl && imageUrl.trim().length > 0) {
      newCategoryData.imageUrl = imageUrl.trim();
    }
    
    console.log("Creating category with data:", JSON.stringify({
      ...newCategoryData,
      imageUrl: newCategoryData.imageUrl ? `${newCategoryData.imageUrl.substring(0, 50)}...` : "not included"
    }, null, 2)); // Debug log (truncate image)
    console.log("isFeatured value:", newCategoryData.isFeatured, "Type:", typeof newCategoryData.isFeatured); // Debug log
    console.log("imageUrl length:", imageUrl?.length || 0); // Debug log
    
    // Create category instance
    const category = new Category(newCategoryData);
    
    // CRITICAL: Directly assign to ensure fields are saved
    // MongoDB/Mongoose might skip fields set via constructor if they're falsy
    category.isFeatured = Boolean(isFeaturedValue);
    
    // Only set imageUrl if it has a value (don't set empty string)
    if (imageUrl && imageUrl.trim().length > 0) {
      category.imageUrl = imageUrl.trim();
    }
    
    console.log("Category before save:", {
      name: category.name,
      isFeatured: category.isFeatured,
      isFeaturedType: typeof category.isFeatured,
      imageUrl: category.imageUrl ? `${category.imageUrl.substring(0, 50)}...` : "not set",
      isNew: category.isNew
    }); // Debug log
    
    // Save the category
    await category.save();
    
    // CRITICAL: Reload from database to verify what was actually saved
    const savedCategory = await Category.findById(category._id).lean();
    
    if (!savedCategory) {
      return NextResponse.json(
        { success: false, message: "Failed to save category" },
        { status: 500 }
      );
    }
    
    console.log("Category saved to DB (reloaded):", JSON.stringify({
      _id: savedCategory._id,
      name: savedCategory.name,
      isFeatured: savedCategory.isFeatured,
      imageUrl: savedCategory.imageUrl ? `${savedCategory.imageUrl.substring(0, 50)}...` : "not set",
      slug: savedCategory.slug
    }, null, 2)); // Debug log
    
    // Ensure response includes all fields with defaults
    const categoryWithDefaults = {
      ...savedCategory,
      imageUrl: savedCategory.imageUrl || undefined,
      isFeatured: savedCategory.isFeatured === true,
    };
    
    return NextResponse.json({
      success: true,
      message: "Category created successfully",
      data: categoryWithDefaults,
    }, { status: 201 });
    
  } catch (error: any) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create category" },
      { status: 500 }
    );
  }
}

