import { NextRequest, NextResponse } from "next/server";
import { confirmPayment } from "@/app/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentIntentId } = body;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Payment Intent ID is required" },
        { status: 400 }
      );
    }

    // Check if payment was successful
    const isSuccessful = await confirmPayment(paymentIntentId);

    return NextResponse.json({
      success: isSuccessful,
      message: isSuccessful
        ? "Payment confirmed successfully"
        : "Payment not yet completed",
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to confirm payment";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
