import { Blockfrost, Lucid } from "lucid-cardano";

let lucid: Lucid | null = null;

export async function getLucidFront() {
  if (lucid) return lucid;
  const apiKey = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY;
  if (!apiKey)
    throw new Error(
      "NEXT_PUBLIC_BLOCKFROST_API_KEY missing in environment variables"
    );

  lucid = await Lucid.new(
    new Blockfrost("https://cardano-preprod.blockfrost.io/api/v0", apiKey),
    "Preprod"
  );

  return lucid;
}

export function resetLucidFront() {
  lucid = null;
}
