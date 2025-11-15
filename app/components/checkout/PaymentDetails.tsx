"use client";
import { useState } from "react";
import PaymentMethodSelector from "./PaymentMethodSelector";
import PaymentForm from "./PaymentForm";
import CheckoutPricingSummary from "./CheckoutPricingSummary";
import { useAuthStore } from "@/app/store/useAuthStore";

type PaymentMethod = "paypal" | "credit-card" | "paypal-checkout";

interface PaymentDetailsProps {
  subtotal: number;
  serviceFee: number;
  itemCount: number;
  onPayment: () => Promise<void> | void; // will call Cardano mint
  paying: boolean;                        // NEW
}

export default function PaymentDetails({
  subtotal,
  serviceFee,
  itemCount,
  onPayment,
  paying,
}: PaymentDetailsProps) {
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethod>("credit-card");
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

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
    await onPayment();
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
      <h2 className="mb-6 text-lg font-bold text-gray-900 sm:text-xl">
        Payment Details
      </h2>

      {/* Payment method selector (UI only) */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-medium text-gray-700">
          Select Payment Method
        </h3>
        <PaymentMethodSelector
          selectedMethod={selectedMethod}
          onMethodChange={setSelectedMethod}
        />
      </div>

      {/* Mock card form (visual only) */}
      {selectedMethod === "credit-card" && (
        <div className="mb-6">
          <PaymentForm />
        </div>
      )}

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
        className="w-full rounded-lg bg-linear-to-r from-purple-600 to-pink-500 py-4 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
      >
        {walletConnected
          ? paying
            ? "Minting your Cardano ticket NFTs..."
            : `Pay ₹${total.toFixed(2)} & Mint NFT Ticket(s)`
          : "Connect Cardano Wallet to Pay & Mint"}
      </button>

      {!walletConnected && (
        <p className="mt-3 text-center text-xs text-red-500">
          Wallet not connected. Please connect your Cardano wallet before paying.
        </p>
      )}
    </div>
  );
}