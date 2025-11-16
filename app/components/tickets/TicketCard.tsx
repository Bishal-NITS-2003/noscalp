"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { NftTicket } from "@/app/lib/fetchUserNfts";
import { ExternalLink, Trash2 } from "lucide-react";

interface TicketCardProps {
  ticket: NftTicket;
  index: number;
  onBurn?: (ticket: NftTicket) => void;
  isBurning?: boolean;
}

export default function TicketCard({ ticket, index, onBurn, isBurning }: TicketCardProps) {
  const verificationUrl =
    typeof window !== "undefined" && ticket.mintTxHash
      ? `${window.location.origin}/verify-ticket?unit=${ticket.unit}&txHash=${ticket.mintTxHash}`
      : "";

  const explorerUrl = ticket.mintTxHash
    ? `https://preprod.cardanoscan.io/transaction/${ticket.mintTxHash}`
    : "#";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="relative h-48 w-full bg-linear-to-br from-purple-500 to-pink-500">
        <Image
          src={ticket.onchainMetadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
          alt={ticket.onchainMetadata.name}
          fill
          className="object-cover opacity-90"
        />
        <div className="absolute top-3 right-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-purple-700 shadow">
          NFT Ticket
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
          {ticket.onchainMetadata.name}
        </h3>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500">Event</p>
            <p className="font-medium text-gray-900">
              {ticket.onchainMetadata.event || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Seat</p>
            <p className="font-medium text-gray-900">
              {ticket.onchainMetadata.seat || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Price</p>
            <p className="font-medium text-gray-900">
              {ticket.onchainMetadata.price_inr || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Issued</p>
            <p className="text-xs font-medium text-gray-900">
              {ticket.onchainMetadata.issuedAt
                ? new Date(ticket.onchainMetadata.issuedAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center border-t pt-4">
          <div className="text-center">
            <p className="mb-2 text-xs font-medium text-gray-600">
              Scan to Verify Authenticity
            </p>
            {verificationUrl && (
              <QRCodeSVG
                value={verificationUrl}
                size={120}
                level="H"
                includeMargin
                className="mx-auto"
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          {ticket.mintTxHash && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-200 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View on Explorer
            </a>
          )}

          {onBurn && (
            <button
              onClick={() => onBurn(ticket)}
              disabled={isBurning}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="h-4 w-4" />
              {isBurning ? "Canceling..." : "Cancel Ticket"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}