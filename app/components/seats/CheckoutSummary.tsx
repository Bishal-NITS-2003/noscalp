"use client";
import { motion } from "framer-motion";

interface CheckoutSummaryProps {
  subtotal: number;
  serviceFee: number;
  itemCount: number;
  onCheckout: () => void;
}

export default function CheckoutSummary({
  subtotal,
  serviceFee,
  itemCount,
  onCheckout,
}: CheckoutSummaryProps) {
  const total = subtotal + serviceFee;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky bottom-0 w-full border-t border-gray-200 bg-white px-4 py-4 sm:px-6 lg:relative lg:border-t-0 lg:px-0"
    >
      {itemCount === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-gray-500">
            Select seats to view checkout summary
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Subtotal */}
          <div className="flex items-center justify-between text-sm sm:text-base">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold text-gray-900">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          {/* Service Fee */}
          <div className="flex items-center justify-between text-sm sm:text-base">
            <span className="text-gray-600">Service Fees</span>
            <span className="font-semibold text-gray-900">
              ${serviceFee.toFixed(2)}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Total */}
          <div className="flex items-center justify-between text-base sm:text-lg">
            <span className="font-semibold text-gray-900">
              Total USD ({itemCount} item{itemCount > 1 ? "s" : ""})
            </span>
            <span className="text-xl font-bold text-gray-900 sm:text-2xl">
              ${total.toFixed(2)}
            </span>
          </div>

          {/* Checkout Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCheckout}
            className="w-full rounded-lg py-3 text-sm font-semibold text-white transition-colors sm:py-4 sm:text-base"
            style={{ backgroundColor: "#5522CC" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#4419AA";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#5522CC";
            }}
          >
            Checkout →
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
