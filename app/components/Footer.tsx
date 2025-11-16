"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const footerLinks = {
  "Plan Events": [
    "Create and Set Up",
    "Sell Tickets",
    "Online RSVP",
    "Online Events",
  ],
  Noscalp: [
    "About Us",
    "Press",
    "Contact Us",
    "Help Center",
    "How it Works",
    "Privacy",
    "Terms",
  ],
  "Stay In The Loop": {
    description:
      "Join our mailing list to stay in the loop with our newest for Event and concert",
    placeholder: "Enter your email address..",
    buttonText: "Subscribe Now",
  },
};

export default function Footer() {
  return (
    <footer className="bg-[#0a0e27] px-4 py-12 text-white sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 flex items-center gap-2">
              <div className="relative h-10 w-36 sm:h-12 sm:w-44">
                <Image
                  src="/logo3.png"
                  alt="NoScalp Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <p className="mb-6 text-sm text-gray-400">
              NoScalp is a revolutionary blockchain-based ticketing platform
              that ensures transparent, secure, and fair ticket distribution.
              Experience authentic event access without the worry of scalpers or
              counterfeit tickets.
            </p>
            <div className="flex gap-3">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700"
              >
                f
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-400 text-white transition-colors hover:bg-blue-500"
              >
                t
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-white transition-colors hover:bg-blue-800"
              >
                in
              </motion.a>
            </div>
          </motion.div>

          {/* Plan Events Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h3 className="mb-6 text-sm font-semibold">Plan Events</h3>
            <ul className="space-y-3">
              {footerLinks["Plan Events"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Noscalp Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h3 className="mb-6 text-sm font-semibold">Noscalp</h3>
            <ul className="space-y-3">
              {footerLinks["Noscalp"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h3 className="mb-4 text-sm font-semibold">Stay In The Loop</h3>
            <p className="mb-6 text-sm text-gray-400">
              {footerLinks["Stay In The Loop"].description}
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder={footerLinks["Stay In The Loop"].placeholder}
                className="rounded-full border border-gray-600 bg-transparent px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none"
                style={{ borderColor: "#6b7280" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#5522CC")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#6b7280")}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ backgroundColor: "#ED4690" }}
                className="rounded-full px-6 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
              >
                {footerLinks["Stay In The Loop"].buttonText}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 border-t border-gray-800 pt-8 text-center"
        >
          <p className="text-sm text-gray-500">Copyright © 2025 Noscalp</p>
        </motion.div>
      </div>
    </footer>
  );
}
