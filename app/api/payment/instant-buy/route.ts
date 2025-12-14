import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import Stripe from "stripe";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const body = await req.json();
    const { productId, quantity = 1 } = body;

    // Get base URL from request or environment variable
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    
    if (!baseUrl) {
      // Try to get from origin header (includes protocol)
      const origin = req.headers.get('origin');
      if (origin && (origin.startsWith('http://') || origin.startsWith('https://'))) {
        baseUrl = origin;
      } else {
        // Fallback: construct from host header
        const host = req.headers.get('host') || req.headers.get('x-forwarded-host');
        const protocol = req.headers.get('x-forwarded-proto') || 
                        req.headers.get('x-forwarded-protocol') ||
                        (host?.includes('localhost') ? 'http' : 'https');
        baseUrl = host ? `${protocol}://${host}` : 'http://localhost:3000';
      }
    }
    
    console.log('Stripe checkout baseUrl:', baseUrl);

    if (!productId || quantity <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid product or quantity" },
        { status: 400 }
      );
    }

    await connectDB();

    // Get product details
    const product = await Product.findById(productId).lean();
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Get first image URL for Stripe - only use HTTP/HTTPS URLs under 2048 chars
    const imageUrl = product.imageUrl && product.imageUrl.length > 0 
      ? product.imageUrl[0]
      : null;
    
    const validImageUrl = imageUrl && 
                         (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) &&
                         imageUrl.length < 2000
                         ? imageUrl 
                         : null;

    // Create Stripe checkout session for instant buy
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
            images: validImageUrl ? [validImageUrl] : [],
          },
          unit_amount: Math.round(product.price * 100), // Convert to smallest currency unit (cents)
        },
        quantity: quantity,
      }],
      mode: "payment",
      success_url: `${baseUrl}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/shop/${productId}`,
      metadata: {
        userId: user._id.toString(),
        items: JSON.stringify([{
          productId: product._id.toString(), // Changed from 'id' to 'productId' to match Order model
          name: product.name,
          price: product.price,
          quantity: quantity,
        }]),
        instantBuy: "true",
      },
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["IN", "US", "GB", "CA", "AU"],
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (e: any) {
    console.error("Instant buy error:", e);
    const status = e?.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json(
      { success: false, message: e?.message || "Server error" },
      { status }
    );
  }
}

