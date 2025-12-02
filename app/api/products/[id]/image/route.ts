import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";

type RouteContext = { params: Promise<{ id: string }> };

// Upload product images
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(req);
    await connectDB();
    
    const { id } = await context.params;
    const body = await req.json();
    const { imageUrl } = body as { imageUrl?: string[] };
    
    if (!imageUrl || !Array.isArray(imageUrl)) {
      return NextResponse.json({ success: false, message: "Invalid image data" }, { status: 400 });
    }
    
    const product = await Product.findByIdAndUpdate(
      id,
      { imageUrl },
      { new: true }
    );
    
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: product });
  } catch (e: any) {
    const status = e?.message === "FORBIDDEN" || e?.message === "UNAUTHORIZED" ? 403 : 500;
    return NextResponse.json({ success: false, message: e?.message || "Server error" }, { status });
  }
}



