"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import Image from "next/image";
import { useAuthStore } from "@/app/store/useAuthStore";
import { usePathname } from "next/navigation";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type MouseEvent as ReactMouseEvent,
} from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const {
    authUser,
    isLoggingIn,
    connectedAddress,
    walletProviderName,
    connectWallet,
    disconnectWallet,
    autoReconnect,
    shouldAutoReconnect,
  } = useAuthStore();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/" },
    { name: "Contact", href: "/" },
    { name: "My Tickets", href: "/my-tickets" },
  ];
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!shouldAutoReconnect) return;
    autoReconnect();
  }, [shouldAutoReconnect, autoReconnect]);

  const formatAddress = useCallback((address?: string | null) => {
    if (!address) return "";
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  const handleWalletConnect = useCallback(async () => {
    await connectWallet();
    setIsMobileMenuOpen(false);
  }, [connectWallet]);

  const handleDisconnect = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      console.log("🔴 Disconnect button clicked!");
      event.preventDefault();
      event.stopPropagation();

      // Add a small delay to ensure the click completes
      setTimeout(() => {
        disconnectWallet();
        setIsWalletDropdownOpen(false);
        setIsMobileMenuOpen(false);
        console.log("🔴 Wallet disconnected");
      }, 50);
    },
    [disconnectWallet]
  );

  // Click outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const el = dropdownRef.current;
      if (!el) return;
      if (!el.contains(event.target as Node)) {
        setIsWalletDropdownOpen(false);
      }
    }
    if (isWalletDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isWalletDropdownOpen]);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative z-60 px-4 py-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-[1180px] items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="flex items-center gap-2"
        >
          <div className="relative h-10 w-36 sm:h-12 sm:w-44">
            <Image objectFit="cover" src="/logo3.png" alt="Noscalp Logo" fill />
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link, idx) => (
            <motion.li
              key={link.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * idx, duration: 0.38 }}
            >
              <Link
                href={link.href}
                className="text-sm text-white/90 transition-all hover:text-white hover:underline"
              >
                {link.name}
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* Wallet Section - Desktop */}
        <div className="hidden md:block">
          {authUser && connectedAddress ? (
            <div className="relative wallet-dropdown" ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsWalletDropdownOpen((s) => !s)}
                aria-expanded={isWalletDropdownOpen}
                aria-label="Wallet menu"
                className="flex items-center gap-2 rounded-full border border-white/70 bg-transparent px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span>{formatAddress(connectedAddress)}</span>
                <svg
                  className={`h-4 w-4 transition-transform ${
                    isWalletDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.button>

              <AnimatePresence>
                {isWalletDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className={`absolute right-0 mt-2 w-64 rounded-lg border p-3 ${
                      isHomePage
                        ? "bg-white/10 backdrop-blur-md border-white/20"
                        : "bg-white border-gray-200 shadow-lg"
                    }`}
                  >
                    <div
                      className={`text-xs mb-2 ${
                        isHomePage ? "text-white/70" : "text-gray-600"
                      }`}
                    >
                      Connected Wallet
                    </div>
                    <div
                      className={`text-sm font-medium mb-1 capitalize ${
                        isHomePage ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {walletProviderName ?? "Wallet"}
                    </div>
                    <div
                      className={`text-xs mb-3 font-mono break-all ${
                        isHomePage ? "text-white/80" : "text-gray-700"
                      }`}
                    >
                      {connectedAddress}
                    </div>
                    <button
                      type="button"
                      onClick={handleDisconnect}
                      className="w-full rounded-md bg-red-500 border border-red-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                    >
                      Disconnect
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleWalletConnect}
              disabled={isLoggingIn}
              aria-label="Connect wallet"
              className="rounded-full border border-white/70 bg-transparent px-6 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? "Connecting..." : "Connect Wallet"}
            </motion.button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen((s) => !s)}
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
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 rounded-lg bg-white/10 p-4 backdrop-blur-md md:hidden"
          >
            <ul className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="block text-sm text-white/90 transition-colors hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                {authUser && connectedAddress ? (
                  <div className="space-y-2">
                    <div className="rounded-lg bg-white/5 p-3">
                      <div className="text-xs text-white/70 mb-1">
                        Connected: {walletProviderName ?? "Wallet"}
                      </div>
                      <div className="text-sm text-white font-mono">
                        {formatAddress(connectedAddress)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleDisconnect}
                      className="w-full rounded-full border border-red-600 bg-red-500 px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-red-600"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleWalletConnect}
                    disabled={isLoggingIn}
                    className="w-full rounded-full border border-white/70 bg-transparent px-6 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 disabled:opacity-50"
                  >
                    {isLoggingIn ? "Connecting..." : "Connect Wallet"}
                  </button>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
