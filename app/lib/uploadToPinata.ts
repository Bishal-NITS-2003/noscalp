import axios from "axios";

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY!;
const PINATA_SECRET = process.env.NEXT_PUBLIC_PINATA_API_SECRET!;

/**
 * Upload file (image or JSON) to Pinata IPFS
 */
export async function uploadToPinata(file: File): Promise<string> {
  if (!PINATA_API_KEY || !PINATA_SECRET) {
    throw new Error("Pinata API keys are not configured");
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxContentLength: Infinity,
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET,
        },
      }
    );

    const ipfsHash = res.data.IpfsHash;
    return `ipfs://${ipfsHash}`;
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    throw error;
  }
}

/**
 * Upload JSON metadata to Pinata
 */
export async function uploadMetadataToPinata(metadata: object): Promise<string> {
  const blob = new Blob([JSON.stringify(metadata)], {
    type: "application/json",
  });
  const file = new File([blob], "metadata.json");
  return uploadToPinata(file);
}