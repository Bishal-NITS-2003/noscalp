import { NextRequest, NextResponse } from "next/server";
import { createPaymentIntent } from "@/app/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = "usd", metadata } = body;

    // Validate amount
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount provided" },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await createPaymentIntent(amount, currency, metadata);

    // Return client secret to frontend
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error("Payment intent creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
