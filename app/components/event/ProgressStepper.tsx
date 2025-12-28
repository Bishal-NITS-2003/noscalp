"use client";
import { motion } from "framer-motion";

interface Step {
  number: number;
  label: string;
}

interface ProgressStepperProps {
  currentStep?: number;
}

const steps: Step[] = [
  { number: 1, label: "Choose Time" },
  { number: 2, label: "Choose Seat" },
  { number: 3, label: "Checkout" },
  { number: 4, label: "Get Ticket" },
];

export default function ProgressStepper({
  currentStep = 1,
}: ProgressStepperProps) {
  return (
    <div className="w-full bg-white px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex items-start justify-between">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`flex ${
                index < steps.length - 1 ? "flex-1" : ""
              } items-start min-w-0`}
            >
              {/* Step Circle and Label */}
              <div className="flex flex-col items-center min-w-0">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all sm:h-10 sm:w-10 sm:text-sm md:h-12 md:w-12 shrink-0 ${
                    step.number === currentStep
                      ? "bg-[#ED4690] border-[#ED4690]  text-white"
                      : step.number < currentStep
                        ? "border-[#ED4690] bg-[#ED4690] text-white"
                        : "border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  {step.number}
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                  className={`mt-1.5 text-[10px] font-medium text-center leading-tight sm:mt-2 sm:text-xs md:text-sm max-w-[60px] sm:max-w-none ${
                    step.number <= currentStep
                      ? "text-gray-900"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </motion.p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="relative mx-1 h-0.5 w-full flex-1 bg-gray-200 sm:mx-2 md:mx-4 mt-4 sm:mt-5 md:mt-6 min-w-5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: step.number < currentStep ? "100%" : "0%",
                    }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
                    className="absolute left-0 top-0 h-full"
                    style={{ backgroundColor: "#5522CC" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
