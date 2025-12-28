"use client";

import { useState, useEffect } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Load Stripe publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number; // in dollars/rupees
  currency?: string;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  ticketCount: number;
}

// Payment Form Component (inside Stripe Elements)
function CheckoutForm({
  onSuccess,
  onError,
  onClose,
}: {
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  onClose: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href, // Required but not used in redirect=if_required
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "An error occurred during payment");
        onError(error.message || "Payment failed");
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Payment successful!
        onSuccess(paymentIntent.id);
      } else {
        setErrorMessage("Payment was not successful. Please try again.");
        onError("Payment incomplete");
        setIsProcessing(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
      onError(err.message);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Stripe Payment Element */}
      <div className="rounded-lg border border-gray-200 p-4">
        <PaymentElement />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 rounded-lg bg-linear-to-r from-purple-600 to-pink-500 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Processing...
            </span>
          ) : (
            "Pay Now"
          )}
        </button>
      </div>

      {/* Test Card Info */}
      <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800">
        <p className="font-semibold mb-1">🧪 Test Mode - Use test card:</p>
        <p className="font-mono">4242 4242 4242 4242</p>
        <p className="text-blue-600 mt-1">
          Any future expiry date, any CVC, any ZIP
        </p>
      </div>
    </form>
  );
}

// Main Modal Component
export default function StripePaymentModal({
  isOpen,
  onClose,
  totalAmount,
  currency = "usd",
  onPaymentSuccess,
  onPaymentError,
  ticketCount,
}: PaymentModalProps) {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!isOpen) return;

    // Create payment intent when modal opens
    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        setError("");

        // Convert amount to cents (Stripe uses smallest currency unit)
        const amountInCents = Math.round(totalAmount * 100);

        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: amountInCents,
            currency: currency.toLowerCase(),
            metadata: {
              ticketCount: ticketCount.toString(),
              timestamp: new Date().toISOString(),
            },
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to initialize payment");
        }

        setClientSecret(data.clientSecret);
      } catch (err: any) {
        console.error("Error creating payment intent:", err);
        setError(err.message || "Failed to initialize payment");
        onPaymentError(err.message);
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [isOpen, totalAmount, currency, ticketCount, onPaymentError]);

  if (!isOpen) return null;

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#9333ea", // purple-600
        colorBackground: "#ffffff",
        colorText: "#1f2937",
        colorDanger: "#ef4444",
        fontFamily: "system-ui, sans-serif",
        borderRadius: "8px",
      },
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-white p-4 sm:p-6 shadow-2xl my-4 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Complete Payment
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Secure payment powered by Stripe
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            disabled={loading}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Payment Amount */}
        <div className="mb-4 sm:mb-6 rounded-lg bg-linear-to-r from-purple-50 to-pink-50 p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-600">
              Total Amount
            </span>
            <span className="text-xl sm:text-2xl font-bold text-purple-600">
              {currency.toUpperCase()} ${totalAmount.toFixed(2)}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            For {ticketCount} ticket{ticketCount !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
            <p className="text-sm text-gray-600">Initializing payment...</p>
          </div>
        ) : error ? (
          <div className="py-8">
            <div className="rounded-lg bg-red-50 p-4 text-center">
              <p className="text-sm font-medium text-red-800">{error}</p>
              <button
                onClick={onClose}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        ) : clientSecret ? (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm
              onSuccess={onPaymentSuccess}
              onError={onPaymentError}
              onClose={onClose}
            />
          </Elements>
        ) : null}
      </div>
    </div>
  );
}
