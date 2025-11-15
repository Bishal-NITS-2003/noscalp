"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import TicketCard from "@/app/components/tickets/TicketCard";
import { useAuthStore } from "@/app/store/useAuthStore";
import { fetchUserNfts, NftTicket } from "@/app/lib/fetchUserNfts";
import toast from "react-hot-toast";
import { Ticket } from "lucide-react";

export default function MyTicketsPage() {
  const { lucid, connectedAddress, connectWallet } = useAuthStore();
  const [tickets, setTickets] = useState<NftTicket[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lucid && connectedAddress) {
      loadTickets();
    }
  }, [lucid, connectedAddress]);

  const loadTickets = async () => {
    if (!lucid || !connectedAddress) return;

    setLoading(true);
    try {
      const nfts = await fetchUserNfts(lucid, connectedAddress);
      setTickets(nfts);
      if (nfts.length === 0) {
        toast("No NFT tickets found in your wallet.", { icon: "ℹ️" });
      }
    } catch (error) {
      console.error("Failed to load tickets:", error);
      toast.error("Failed to load your tickets.");
    } finally {
      setLoading(false);
    }
  };

  if (!connectedAddress) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Ticket className="mx-auto mb-4 h-16 w-16 text-purple-500" />
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Connect Your Wallet
            </h2>
            <p className="mb-6 text-gray-600">
              Please connect your Cardano wallet to view your NFT tickets.
            </p>
            <button
              onClick={connectWallet}
              className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-purple-700 transition-colors"
            >
              Connect Wallet
            </button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            My NFT Tickets
          </h1>
          <p className="mt-2 text-gray-600">
            Your Cardano-powered event tickets
          </p>
        </motion.div>

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
              <p className="text-gray-600">Loading your tickets...</p>
            </div>
          </div>
        ) : tickets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-[40vh] items-center justify-center"
          >
            <div className="text-center">
              <Ticket className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 text-xl font-semibold text-gray-700">
                No Tickets Yet
              </h3>
              <p className="text-gray-500">
                You haven't purchased any NFT tickets yet.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket, index) => (
              <TicketCard key={ticket.unit} ticket={ticket} index={index} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}