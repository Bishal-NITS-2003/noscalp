"use client";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { CheckCircle, XCircle, ExternalLink } from "lucide-react";

// Disable static generation
export const dynamic = "force-dynamic";

const BLOCKFROST_API = "https://cardano-preprod.blockfrost.io/api/v0";

interface TicketMetadata {
  event?: string;
  name?: string;
  seat?: string;
  price_inr?: string;
  issuedAt?: string;
  mintTxHash?: string;
  policyId?: string;
  [key: string]: unknown;
}

function TicketVerifier({
  ticketId,
  unit: unitParam,
  txHash: txHashParam,
}: {
  ticketId: string | null;
  unit: string | null;
  txHash: string | null;
}) {
  // Support both formats: ticketId=unit+txHash OR unit=...&txHash=...
  let unit = unitParam;
  let txHash = txHashParam;

  if (ticketId && !unit && !txHash) {
    const parts = ticketId.split("+");
    unit = parts[0] || null;
    txHash = parts[1] || null;
  }

  const [verifying, setVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [ticketData, setTicketData] = useState<TicketMetadata | null>(null);

  useEffect(() => {
    if (unit && txHash) {
      verifyTicket();
    } else {
      setVerifying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, txHash]);

  const verifyTicket = async () => {
    try {
      setVerifying(true);

      // 1. Check original owner via backend API
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetUnit: unit }),
      });
      const result = await res.json();
      setIsValid(result.valid);

      if (!result.valid) {
        setTicketData(null);
        return; // Stop if not valid
      }

      // 2. (Optional) Also check transaction exists
      const projectId = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY!;
      const txRes = await fetch(`${BLOCKFROST_API}/txs/${txHash}`, {
        headers: { project_id: projectId },
      });
      if (!txRes.ok) throw new Error("Transaction not found");

      // 3. Fetch asset metadata for display
      const assetRes = await fetch(`${BLOCKFROST_API}/assets/${unit}`, {
        headers: { project_id: projectId },
      });
      if (!assetRes.ok) throw new Error("Asset not found");

      const assetInfo = await assetRes.json();
      if (assetInfo && assetInfo.onchain_metadata) {
        setTicketData({
          ...assetInfo.onchain_metadata,
          mintTxHash: txHash,
          policyId: unit!.slice(0, 56),
        } as TicketMetadata);
      } else {
        setTicketData(null);
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setIsValid(false);
      setTicketData(null);
    } finally {
      setVerifying(false);
    }
  };

  if (!unit || !txHash) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navbar with background */}
        <div className="relative z-10">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url('/Hero/background.png')`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "top",
            }}
          />
          <div className="absolute inset-0 z-10 bg-linear-to-br from-[#ED4690] to-[#5522CC] opacity-90" />
          <Navbar />
        </div>
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="text-center">
            <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              Invalid QR Code
            </h2>
            <p className="mt-2 text-gray-600">
              Missing verification parameters.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar with background */}
      <div className="relative z-10">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('/Hero/background.png')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "top",
          }}
        />
        <div className="absolute inset-0 z-10 bg-linear-to-br from-[#ED4690] to-[#5522CC] opacity-90" />
        <Navbar />
      </div>

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        {verifying ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Verifying Ticket on Cardano Blockchain...
            </h2>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-white p-8 shadow-lg"
          >
            {isValid ? (
              <>
                <div className="mb-6 text-center">
                  <CheckCircle className="mx-auto mb-4 h-20 w-20 text-green-500" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    ✅ Authentic Ticket
                  </h2>
                  <p className="mt-2 text-gray-600">
                    This ticket is verified on the Cardano blockchain.
                  </p>
                </div>

                <div className="space-y-4 border-t pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Event</p>
                      <p className="font-medium text-gray-900">
                        {ticketData?.event || ticketData?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Seat</p>
                      <p className="font-medium text-gray-900">
                        {ticketData?.seat || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium text-gray-900">
                        {ticketData?.price_inr || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Issued</p>
                      <p className="font-medium text-gray-900">
                        {ticketData?.issuedAt
                          ? new Date(ticketData.issuedAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="mb-2 text-sm text-gray-500">Policy ID</p>
                    <p className="break-all font-mono text-xs text-gray-700">
                      {ticketData?.policyId || "N/A"}
                    </p>
                  </div>

                  <a
                    href={`https://preprod.cardanoscan.io/transaction/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white hover:bg-purple-700 transition-colors"
                  >
                    <ExternalLink className="h-5 w-5" />
                    View on Cardano Explorer
                  </a>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <XCircle className="mx-auto mb-4 h-20 w-20 text-red-500" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    ❌ Invalid Ticket
                  </h2>
                  <p className="mt-2 text-gray-600">
                    This ticket could not be verified on the blockchain.
                  </p>
                  <p className="mt-4 text-sm text-gray-500">
                    Possible reasons: fake ticket, wrong network, or transaction
                    not yet confirmed.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}

function VerifyTicketContent() {
  const params = useSearchParams();
  const ticketId = params.get("ticketId");
  const unit = params.get("unit");
  const txHash = params.get("txHash");

  return <TicketVerifier ticketId={ticketId} unit={unit} txHash={txHash} />;
}

export default function VerifyTicketPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <VerifyTicketContent />
    </Suspense>
  );
}
