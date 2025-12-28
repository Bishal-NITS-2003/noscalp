import { Lucid } from "lucid-cardano";

const BLOCKFROST_API_URL =
  process.env.NEXT_PUBLIC_BLOCKFROST_API_URL ??
  "https://cardano-preprod.blockfrost.io/api/v0";
const BLOCKFROST_PROJECT_ID =
  process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID ?? "";

export type NftTicket = {
  unit: string;
  policyId: string;
  assetName: string;
  quantity: string;
  onchainMetadata: {
    name: string;
    image: string;
    description?: string;
    event?: string;
    seat?: string;
    price_inr?: string;
    max_resale_price_inr?: string;
    issuedAt?: string;
    metadataUrl?: string;
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

        try {
          const assetId = `${policyId}${assetNameHex}`;
          const response = await fetch(
            `${BLOCKFROST_API_URL}/assets/${assetId}`,
            {
              headers: {
                project_id: BLOCKFROST_PROJECT_ID,
              },
            }
          );

          if (!response.ok) {
            throw new Error(await response.text());
          }

          const assetInfo: {
            onchain_metadata?: Record<string, unknown>;
            metadata?: Record<string, unknown>;
            initial_mint_tx_hash?: string;
          } = await response.json();

          const metadata =
            assetInfo.onchain_metadata ?? assetInfo.metadata ?? {};

          const getName = (obj: Record<string, unknown>): string => {
            return typeof obj.name === "string" ? obj.name : assetName;
          };

          const getString = (value: unknown): string => {
            return typeof value === "string" ? value : "";
          };

          nfts.push({
            unit,
            policyId,
            assetName,
            quantity: quantity.toString(),
            onchainMetadata: {
              name: getName(metadata),
              image: getString(metadata.image),
              description: getString(metadata.description),
              event: getString(metadata.event),
              seat: getString(metadata.seat),
              price_inr: getString(metadata.price_inr),
              max_resale_price_inr: getString(metadata.max_resale_price_inr),
              issuedAt: getString(metadata.issuedAt),
              metadataUrl: getString(metadata.metadataUrl),
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
