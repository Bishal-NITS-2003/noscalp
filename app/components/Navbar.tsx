"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = ["Schedule", "Speakers", "Ticket", "Contact"];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-50 px-4 py-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-[1180px] items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2"
        >
          <div className="relative h-8 w-32 sm:h-10 sm:w-40">
            <Image objectFit="cover" src="/logo2.png" alt="Noscalp Logo" fill />
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link, idx) => (
            <motion.li
              key={link}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx, duration: 0.5 }}
            >
              <a
                href={`#${link.toLowerCase()}`}
                className="text-sm text-white/90 transition-all hover:text-white hover:underline"
              >
                {link}
              </a>
            </motion.li>
          ))}
        </ul>

        {/* Login Button - Desktop */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden rounded-full border border-white/70 bg-transparent px-6 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 md:block"
        >
          Login
        </motion.button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={`h-0.5 w-6 bg-white transition-all ${
              isMobileMenuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-all ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-all ${
              isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 rounded-lg bg-white/10 p-4 backdrop-blur-md md:hidden"
        >
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  className="block text-sm text-white/90 transition-colors hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link}
                </a>
              </li>
            ))}
            <li>
              <button className="w-full rounded-full border border-white/70 bg-transparent px-6 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10">
                Login
              </button>
            </li>
          </ul>
        </motion.div>
      )}
    </motion.nav>
  );
}
