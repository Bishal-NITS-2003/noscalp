"use client";
import { motion } from "framer-motion";

interface Reward {
  message: string;
  type: "discount" | "points";
}

interface RewardsSectionProps {
  rewards: Reward[];
}

export default function RewardsSection({ rewards }: RewardsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="space-y-3"
    >
      <p className="text-sm text-gray-700 sm:text-base">
        Thank you for choosing to buy from Ticketer!
      </p>
      <p className="text-sm font-medium text-gray-900 sm:text-base">
        You&apos;ve unlocked special rewards:
      </p>
      <div className="space-y-2">
        {rewards.map((reward, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
            className="rounded-lg p-3 text-sm font-medium sm:text-base"
            style={{
              backgroundColor:
                reward.type === "discount" ? "#f0fdf4" : "#eff6ff",
              color: reward.type === "discount" ? "#166534" : "#1e40af",
            }}
          >
            {reward.message}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
