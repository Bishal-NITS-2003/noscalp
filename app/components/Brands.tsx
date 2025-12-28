"use client";
import { motion } from "framer-motion";

const brands = [
  { name: "Spotify", logo: "🎵" },
  { name: "Google", logo: "G" },
  { name: "Stripe", logo: "stripe" },
  { name: "YouTube", logo: "▶" },
  { name: "Microsoft", logo: "⊞" },
  { name: "Medium", logo: "M" },
  { name: "Zoom", logo: "zoom" },
  { name: "Uber", logo: "Uber" },
  { name: "Grab", logo: "Grab" },
];

export default function Brands() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1180px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Join these brands
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg">
            We&apos;ve had the pleasure of working with industry-defining
            brands. These are just some of them.
          </p>
        </motion.div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {brands.map((brand, idx) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className="flex h-20 items-center justify-center rounded-lg bg-gray-50 p-4 transition-all hover:bg-gray-100 hover:shadow-md"
            >
              <div className="text-2xl font-bold text-gray-700">
                {brand.logo}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
