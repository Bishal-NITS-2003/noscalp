import { Lucid } from "lucid-cardano";

/**
 * Generate a native-sig minting policy derived from the connected wallet address.
 * Requires wallet is already enabled/selected in Lucid.
 */
export async function generateNativeMintingPolicy(lucid: Lucid) {
  // Make sure wallet is selected/enabled
  const addr = await lucid.wallet.address();
  if (!addr) throw new Error("Wallet not selected");

  // Get address details to obtain payment credential hash
  const { paymentCredential } = lucid.utils.getAddressDetails(addr);
  if (!paymentCredential?.hash) {
    throw new Error("Failed to derive payment credential hash");
  }

  const nativeScriptJson = {
    type: "sig",
    keyHash: paymentCredential.hash,
  } as const;

  // Convert JSON to Script object
  const nativeScript = lucid.utils.nativeScriptFromJson(nativeScriptJson);
  const policyId = lucid.utils.mintingPolicyToId(nativeScript);

  return { nativeScript, policyId };
}