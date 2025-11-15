import { Blockfrost, Lucid } from "lucid-cardano";

let lucid: Lucid | null = null;

export async function getLucidServer() {
  if (lucid) return lucid;

  const apiKey = process.env.BLOCKFROST_API_KEY!;
  if (!apiKey) throw new Error("BLOCKFROST_API_KEY missing");

  const network = (process.env.BLOCKFROST_NETWORK || "Preprod") as "Mainnet" | "Preprod" | "Preview";

  lucid = await Lucid.new(
    new Blockfrost(
      "https://cardano-preprod.blockfrost.io/api/v0",
      apiKey
    ),
    network
  );

  return lucid;
}


