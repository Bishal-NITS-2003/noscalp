"use client";
import { motion } from "framer-motion";

type PaymentMethod = "paypal" | "credit-card" | "paypal-checkout";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

export default function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
}: PaymentMethodSelectorProps) {
  const methods = [
    {
      id: "paypal" as PaymentMethod,
      label: "Paypal",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.028.15a.806.806 0 01-.795.68H7.72a.483.483 0 01-.477-.558L9.22 7.51a.966.966 0 01.957-.815h4.944c1.157 0 2.107.231 2.828.689.36.23.66.499.887.803z" />
        </svg>
      ),
    },
    {
      id: "credit-card" as PaymentMethod,
      label: "Credit Card",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
    },
    {
      id: "paypal-checkout" as PaymentMethod,
      label: "Paypal",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944 3.72a.77.77 0 01.76-.653h8.078c3.364 0 5.426 1.683 5.426 4.404 0 3.254-2.548 5.585-6.084 5.585H9.362l-1.525 7.628a.641.641 0 01-.633.653h-.128zm3.586-12.69h2.756c1.947 0 3.194-1.008 3.194-2.58 0-1.297-.93-2.08-2.548-2.08h-2.29l-1.112 4.66z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col flex-wrap items-stretch gap-3 sm:flex-row sm:items-center">
      {methods.map((method) => (
        <motion.button
          key={method.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onMethodChange(method.id)}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 px-3 py-2.5 transition-all sm:flex-initial sm:justify-start sm:px-4 ${
            selectedMethod === method.id
              ? "border-purple-600 bg-purple-50 text-purple-700"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
          }`}
        >
          <span
            className={
              selectedMethod === method.id ? "text-purple-600" : "text-gray-500"
            }
          >
            {method.icon}
          </span>
          <span className="text-sm font-medium">{method.label}</span>
          {selectedMethod === method.id && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600"
            >
              <svg
                className="h-3 w-3 text-white"
                fill="none"
                strokeWidth="3"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
}
