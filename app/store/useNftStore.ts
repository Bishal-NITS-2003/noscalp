"use client";

import { create } from "zustand";
import toast from "react-hot-toast";
import { useAuthStore } from "@/app/store/useAuthStore";
import { Data } from "lucid-cardano";
import { generateNativeMintingPolicy } from "@/app/lib/generateNativePolicy";
import { uploadMetadataToPinata } from "@/app/lib/uploadToPinata";

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
  mintTicket: (
    payload: MintTicketPayload
  ) => Promise<{ txHash?: string; assetId?: string; metadataUrl?: string } | void>;
  cancelTicket: (tokenUnit: string) => Promise<string | void>;
  withdrawFunds: () => Promise<string | void>;
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
      };

      // 2) Upload metadata JSON to Pinata (optional but you already have it)
      toast("Uploading metadata to IPFS...", { icon: "☁️" });
      const metadataUrl = await uploadMetadataToPinata(metadata);
      console.log("Metadata uploaded:", metadataUrl);

      // 3) Generate native minting policy
      const { nativeScript, policyId } = await generateNativeMintingPolicy(lucid);

      // 4) Unique asset name per seat
      const timestamp = Date.now();
      const assetName = `Ticket-${seatId}-${timestamp}`;
      const assetNameHex = Buffer.from(assetName, "utf8").toString("hex");
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
        .mintAssets({ [unit]: BigInt(1) }, Data.void())
        .attachMintingPolicy(nativeScript)
        .payToAddress(connectedAddress, { [unit]: BigInt(1) })
        .attachMetadata(721, onchainMetadata)
        .complete();

      const signed = await tx.sign().complete();
      toast("Minting ticket NFT...", { icon: "⏳" });
      const txHash = await signed.submit();

      toast.success(`Ticket minted! TX: ${txHash.slice(0, 10)}...`);
      console.log(
        "Explorer:",
        `https://preprod.cardanoscan.io/transaction/${txHash}`
      );

      return { txHash, assetId: unit, metadataUrl };
    } catch (err: any) {
      console.error("mintTicket error", err);
      toast.error("Mint failed: " + (err?.message ?? String(err)));
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
    } catch (err: any) {
      console.error("cancelTicket error", err);
      toast.error("Cancel failed: " + (err?.message ?? String(err)));
      throw err;
    } finally {
      set({ cancelling: false });
    }
  },

  withdrawFunds: async () => {
    toast.error("Withdraw must be performed by contract owner (server/admin).");
    return;
  },
}));