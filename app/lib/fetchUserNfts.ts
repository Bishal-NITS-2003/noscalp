import { Blockfrost, Lucid } from "lucid-cardano";

export type NftTicket = {
  unit: string;
  policyId: string;
  assetName: string;
  quantity: string;
  onchainMetadata: {
    name: string;
    image: string;
    description?: string;
    event?: string;          // ← from your metadata
    seat?: string;           // ← from your metadata
    price_inr?: string;      // ← from your metadata
    max_resale_price_inr?: string; // ← from your metadata
    issuedAt?: string;       // ← from your metadata
    metadataUrl?: string;    // ← from your metadata
  };
  mintTxHash?: string;
};

export async function fetchUserNfts(
  lucid: Lucid,
  address: string
): Promise<NftTicket[]> {
  try {
    const utxos = await lucid.utxosAt(address);
    const nfts: NftTicket[] = [];

    for (const utxo of utxos) {
      const assets = utxo.assets;
      for (const [unit, quantity] of Object.entries(assets)) {
        if (unit === "lovelace") continue;

        const policyId = unit.slice(0, 56);
        const assetNameHex = unit.slice(56);
        const assetName = Buffer.from(assetNameHex, "hex").toString("utf8");

        const blockfrost = lucid.provider as any;
        try {
          const assetId = `${policyId}${assetNameHex}`;
      const assetInfo = await blockfrost.assetById(assetId);
          const metadata = assetInfo.onchain_metadata || {};

          nfts.push({
            unit,
            policyId,
            assetName,
            quantity: quantity.toString(),
            onchainMetadata: {
              name: metadata.name || assetName,
              image: metadata.image || "",
              description: metadata.description,
              event: metadata.event,              // ← your field
              seat: metadata.seat,                // ← your field
              price_inr: metadata.price_inr,      // ← your field
              max_resale_price_inr: metadata.max_resale_price_inr, // ← your field
              issuedAt: metadata.issuedAt,        // ← your field
              metadataUrl: metadata.metadataUrl,  // ← your field
            },
            mintTxHash: assetInfo.initial_mint_tx_hash,
          });
        } catch (err) {
          console.warn(`Could not fetch metadata for ${unit}:`, err);
        }
      }
    }

    return nfts;
  } catch (error) {
    console.error("Error fetching user NFTs:", error);
    throw error;
  }
}