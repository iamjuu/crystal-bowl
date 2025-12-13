import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", );

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    
    const body = await req.json();
    const { items, amount, currency } = body;

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

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid items" },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid amount" },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item: any) => {
        // Filter out base64 images - Stripe only accepts HTTP/HTTPS URLs under 2048 chars
        const validImageUrl = item.imageUrl && 
                             (item.imageUrl.startsWith('http://') || item.imageUrl.startsWith('https://')) &&
                             item.imageUrl.length < 2000
                             ? item.imageUrl 
                             : null;
        
        return {
          price_data: {
            currency: currency?.toLowerCase() || "usd",
            product_data: {
              name: item.name,
              images: validImageUrl ? [validImageUrl] : [],
            },
            unit_amount: Math.round(item.price * 100), // Convert to smallest currency unit (cents for USD)
          },
          quantity: item.quantity,
        };
      }),
      mode: "payment",
      success_url: `${baseUrl}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      metadata: {
        userId: user._id.toString(),
        items: JSON.stringify(items.map((item: any) => ({
          productId: item.id, // Changed from 'id' to 'productId' to match Order model
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        }))),
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
    console.error("Stripe checkout error:", e);
    const status = e?.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json(
      { success: false, message: e?.message || "Server error" },
      { status }
    );
  }
}

