"use client";
import { useState } from "react";
import CheckoutPricingSummary from "./CheckoutPricingSummary";
import StripePaymentModal from "./StripePaymentModal";
import { useAuthStore } from "@/app/store/useAuthStore";

interface PaymentDetailsProps {
  subtotal: number;
  serviceFee: number;
  itemCount: number;
  onPaymentSuccess: (paymentIntentId: string) => Promise<void> | void; // Called after successful payment
  paying: boolean;
}

export default function PaymentDetails({
  subtotal,
  serviceFee,
  itemCount,
  onPaymentSuccess,
  paying,
}: PaymentDetailsProps) {
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { connectedAddress } = useAuthStore();
  const walletConnected = !!connectedAddress;
  const total = subtotal + serviceFee;

  const handleClick = async () => {
    if (!agreedToPolicy) {
      alert("Please agree to the privacy policy to continue.");
      return;
    }
    if (!walletConnected) {
      alert("Please connect your Cardano wallet to continue.");
      return;
    }
    // Open Stripe payment modal
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    console.log("Payment successful! Intent ID:", paymentIntentId);
    setShowPaymentModal(false);
    // Now proceed to mint NFT tickets
    await onPaymentSuccess(paymentIntentId);
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
    alert(`Payment failed: ${error}`);
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
      <h2 className="mb-6 text-lg font-bold text-gray-900 sm:text-xl">
        Payment Details
      </h2>

      {/* Pricing summary */}
      <div className="mb-6">
        <CheckoutPricingSummary
          subtotal={subtotal}
          serviceFee={serviceFee}
          itemCount={itemCount}
        />
      </div>

      {/* Privacy checkbox */}
      <div className="mb-6 flex items-start gap-3">
        <input
          type="checkbox"
          id="privacy-policy"
          checked={agreedToPolicy}
          onChange={(e) => setAgreedToPolicy(e.target.checked)}
          className="mt-1 h-4 w-4 cursor-pointer rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
        />
        <label
          htmlFor="privacy-policy"
          className="cursor-pointer text-sm text-gray-600"
        >
          By clicking this, I agree to Ticketor{" "}
          <a href="#" className="font-medium text-purple-600 hover:underline">
            Privacy Policy
          </a>
        </label>
      </div>

      {/* Pay button -> Cardano mint */}
      <button
        onClick={handleClick}
        disabled={!walletConnected || !agreedToPolicy || paying}
        className="w-full rounded-lg bg-linear-to-r from-purple-600 to-pink-500 py-4 px-2 sm:text-base text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
      >
        {walletConnected
          ? paying
            ? "Processing payment & minting NFTs..."
            : `Pay $${total.toFixed(2)} with Stripe`
          : "Connect Cardano Wallet First"}
      </button>

      {!walletConnected && (
        <p className="mt-3 text-center text-xs text-red-500">
          Wallet not connected. Please connect your Cardano wallet before
          paying.
        </p>
      )}

      {/* Stripe Payment Modal */}
      <StripePaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        totalAmount={total}
        currency="usd"
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
        ticketCount={itemCount}
      />
    </div>
  );
}
