import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(req);
    await connectDB();
    
    const { id } = await context.params;
    const body = await req.json();
    const { name, description, price, imageUrl, videoUrl } = body;

    // Validation
    if (name !== undefined && !name) {
      return NextResponse.json(
        { success: false, message: "Name cannot be empty" },
        { status: 400 }
      );
    }

    if (description !== undefined && !description) {
      return NextResponse.json(
        { success: false, message: "Description cannot be empty" },
        { status: 400 }
      );
    }

    if (imageUrl !== undefined && (!Array.isArray(imageUrl) || imageUrl.length === 0)) {
      return NextResponse.json(
        { success: false, message: "At least one image is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = String(name).trim();
    if (description !== undefined) updateData.description = String(description).trim();
    if (price !== undefined) {
      const priceInCents = Math.round(Number(price) * 100);
      if (isNaN(priceInCents) || priceInCents <= 0) {
        return NextResponse.json(
          { success: false, message: "Invalid price" },
          { status: 400 }
        );
      }
      updateData.price = priceInCents;
    }
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (videoUrl !== undefined) {
      // Handle videoUrl - can be string or array
      if (Array.isArray(videoUrl)) {
        updateData.videoUrl = videoUrl.filter(v => v && String(v).trim()).map(v => String(v).trim());
      } else if (videoUrl) {
        updateData.videoUrl = [String(videoUrl).trim()];
      } else {
        updateData.videoUrl = [];
      }
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (e: any) {
    const status = e?.message === "FORBIDDEN" || e?.message === "UNAUTHORIZED" ? 403 : 500;
    return NextResponse.json(
      { success: false, message: e?.message || "Server error" },
      { status }
    );
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(req);
    await connectDB();
    
    const { id } = await context.params;
    const deleted = await Product.findByIdAndDelete(id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    const status = e?.message === "FORBIDDEN" || e?.message === "UNAUTHORIZED" ? 403 : 500;
    return NextResponse.json(
      { success: false, message: e?.message || "Server error" },
      { status }
    );
  }
}

