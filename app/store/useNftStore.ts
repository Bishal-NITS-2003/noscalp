"use client";

import { create } from "zustand";
import toast from "react-hot-toast";
import { useAuthStore } from "@/app/store/useAuthStore";
import { fromText } from "lucid-cardano";
import { generateNativeMintingPolicy } from "@/app/lib/generateNativePolicy";
import { uploadMetadataToPinata } from "@/app/lib/uploadToPinata";
import type { NftTicket } from "@/app/lib/fetchUserNfts";

const TICKET_SCRIPT_ADDRESS =
  process.env.NEXT_PUBLIC_TICKET_SCRIPT_ADDRESS || "";

type MintTicketPayload = {
  eventName: string;
  eventDescription: string;
  seatId: string;
  priceInRupees: number;
  imageUrl: string; // <- URL from TicketListItem
};

type TicketContractState = {
  minting: boolean;
  cancelling: boolean;
  withdrawing: boolean;
  mintTicket: (payload: MintTicketPayload) => Promise<{
    txHash?: string;
    assetId?: string;
    metadataUrl?: string;
  } | void>;
  cancelTicket: (tokenUnit: string) => Promise<string | void>;
  withdrawFunds: () => Promise<string | void>;
  burnTicket: (ticket: NftTicket) => Promise<string>;
};

export const useTicketContractStore = create<TicketContractState>((set) => ({
  minting: false,
  cancelling: false,
  withdrawing: false,

  mintTicket: async ({
    eventName,
    eventDescription,
    seatId,
    priceInRupees,
    imageUrl,
  }: MintTicketPayload) => {
    console.log("mintTicket called with:", {
      eventName,
      eventDescription,
      seatId,
      priceInRupees,
      imageUrl,
    });

    const { lucid, connectedAddress } = useAuthStore.getState();
    if (!lucid || !connectedAddress) {
      toast.error("Connect wallet first");
      return;
    }

    set({ minting: true });
    try {
      // 1) Build metadata using the image URL directly
      const maxResalePrice = priceInRupees * 1.1;
      const metadata = {
        name: `${eventName} - Seat ${seatId}`,
        description: eventDescription,
        image: imageUrl, // no IPFS image upload, just URL
        attributes: [
          { trait_type: "Event", value: eventName },
          { trait_type: "Seat", value: seatId },
          { trait_type: "Price (INR)", value: `${priceInRupees} INR` },
          {
            trait_type: "Max Resale Price (INR)",
            value: `${maxResalePrice.toFixed(2)} INR`,
          },
          { trait_type: "Issued At", value: new Date().toISOString() },
        ],
        transferable: false, // ⬅️ Add this line
        note: "Transfers invalidate this ticket",
      };

      // 2) Upload metadata JSON to Pinata (optional but you already have it)
      toast("Uploading metadata to IPFS...", { icon: "☁️" });
      const metadataUrl = await uploadMetadataToPinata(metadata);
      console.log("Metadata uploaded:", metadataUrl);

      // 3) Generate native minting policy
      const {
        nativeScript,
        policyId,
        keyHash: policyKeyHash,
      } = await generateNativeMintingPolicy(lucid); // <-- Get keyHash here

      // --- START CORRECTED DEBUG LOGS ---
      const signerKeyHash =
        lucid.utils.getAddressDetails(connectedAddress).paymentCredential?.hash;

      console.log("DEBUG: Connected address:", connectedAddress);
      console.log("DEBUG: Policy requires keyHash:", policyKeyHash);
      console.log("DEBUG: Signer provides keyHash:", signerKeyHash);

      if (policyKeyHash !== signerKeyHash) {
        toast.error(
          "CRITICAL: KeyHash mismatch! Policy and signer do not match."
        );
        console.error(
          "CRITICAL: KeyHash mismatch! Policy requires",
          policyKeyHash,
          "but signer is",
          signerKeyHash
        );
        set({ minting: false });
        return;
      }
      // --- END CORRECTED DEBUG LOGS ---

      /*
      // 4) Unique asset name per seat
      const timestamp = Date.now();
      const assetName = `Ticket-${seatId}-${timestamp}`;
      const assetNameHex = Buffer.from(assetName, "utf8").toString("hex");
      const unit = `${policyId}${assetNameHex}`;
*/
      // 4) Build a short asset name (≤ 32 bytes) using seatId + tiny nonce
      const encoder = new TextEncoder();
      const nonce = Date.now().toString(36).slice(-4); // short suffix
      const prefix = "T";
      let base = `${prefix}-${seatId}`; // keep it compact
      let tokenName = `${base}-${nonce}`;

      // Enforce max 32 bytes for AssetName (UTF-8 bytes)
      while (encoder.encode(tokenName).length > 32) {
        base = base.slice(0, -1);
        if (base.length <= 2) {
          tokenName = `${prefix}-${nonce}`;
          break;
        }
        tokenName = `${base}-${nonce}`;
      }

      // Convert to hex
      const assetNameHex = fromText(tokenName);
      const unit = `${policyId}${assetNameHex}`;

      // 5) On-chain metadata
      const onchainMetadata = {
        [policyId]: {
          [assetNameHex]: {
            name: metadata.name,
            image: imageUrl,
            description: metadata.description,
            event: eventName,
            seat: seatId,
            price_inr: `${priceInRupees} INR`,
            max_resale_price_inr: `${maxResalePrice.toFixed(2)} INR`,
            issuedAt: metadata.attributes[4].value,
            metadataUrl,
          },
        },
      };

      // 6) Build and submit tx
      const tx = await lucid
        .newTx()
        .addSigner(connectedAddress)
        .mintAssets({ [unit]: 1n })
        .attachMintingPolicy(nativeScript)
        .payToAddress(connectedAddress, { [unit]: 1n })
        .attachMetadata(721, onchainMetadata)
        .complete();

      console.log("DEBUG: Transaction details:", tx);

      const signed = await tx.sign().complete();
      toast("Minting ticket NFT...", { icon: "⏳" });
      const txHash = await signed.submit();
      toast.success(`Ticket minted! TX: ${txHash.slice(0, 10)}...`);
      console.log(
        "Explorer:",
        `https://preprod.cardanoscan.io/transaction/${txHash}`
      );

      await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetUnit: unit,
          mintTxHash: txHash,
          originalOwnerWallet: connectedAddress,
          status: "VALID",
        }),
      });

      return { txHash, assetId: unit, metadataUrl };
    } catch (err) {
      console.error("mintTicket error", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error("Mint failed: " + errorMessage);
      throw err;
    } finally {
      set({ minting: false });
    }
  },

  cancelTicket: async (tokenUnit) => {
    // unchanged...
    const { lucid } = useAuthStore.getState();
    if (!lucid) {
      toast.error("Connect wallet first");
      return;
    }
    if (!TICKET_SCRIPT_ADDRESS) {
      toast.error("Script address not configured");
      return;
    }
    set({ cancelling: true });
    try {
      const tx = await lucid
        .newTx()
        .payToAddress(TICKET_SCRIPT_ADDRESS, { [tokenUnit]: BigInt(1) })
        .complete();

      const signed = await tx.sign().complete();
      toast("Cancelling ticket...", { icon: "⏳" });
      const txHash = await signed.submit();
      toast.success("Ticket cancelled: " + txHash);
      return txHash;
    } catch (err) {
      console.error("cancelTicket error", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error("Cancel failed: " + errorMessage);
      throw err;
    } finally {
      set({ cancelling: false });
    }
  },

  withdrawFunds: async () => {
    toast.error("Withdraw must be performed by contract owner (server/admin).");
    return;
  },

  burnTicket: async (ticket: NftTicket) => {
    const { lucid, connectedAddress } = useAuthStore.getState();

    if (!lucid || !connectedAddress) {
      throw new Error("Wallet not connected");
    }

    toast("Burning ticket NFT...", { icon: "🔥" });

    try {
      const { nativeScript } = await generateNativeMintingPolicy(lucid);

      const tx = await lucid
        .newTx()
        .addSigner(connectedAddress)
        .mintAssets({ [ticket.unit]: -1n })
        .attachMintingPolicy(nativeScript)
        .complete();

      const signed = await tx.sign().complete();
      const txHash = await signed.submit();

      toast.success(`Ticket burned! TX: ${txHash.slice(0, 10)}...`);
      console.log(
        "Burn TX:",
        `https://preprod.cardanoscan.io/transaction/${txHash}`
      );

      await lucid.awaitTx(txHash);

      return txHash;
    } catch (error) {
      console.error("burnTicket error", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to burn ticket";
      toast.error(errorMessage);
      throw error;
    }
  },
}));
