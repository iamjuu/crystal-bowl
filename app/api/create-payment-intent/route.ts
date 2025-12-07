import { NextRequest, NextResponse } from "next/server";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY 
const stripe = require('stripe')(stripeSecretKey);

export async function POST(req: NextRequest) {
  try {
    console.log('Received payment intent request');
    const { amount, currency = 'usd', description } = await req.json();
    
    console.log('Payment details:', { amount, currency, description });

    if (!amount || amount <= 0) {
      console.error('Invalid amount:', amount);
      return NextResponse.json(
        { success: false, message: "Invalid amount" },
        { status: 400 }
      );
    }

    // Create a PaymentIntent with the order amount and currency
    console.log('Creating Stripe payment intent...');
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      description: description || 'Private Session Booking',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log('Payment intent created:', paymentIntent.id);

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create payment intent" },
      { status: 500 }
    );
  }
}

