import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/mongodb";
import Ticket from "@/app/models/Ticket";

const BLOCKFROST_API_URL = "https://cardano-preprod.blockfrost.io/api/v0";
const BLOCKFROST_PROJECT_ID = process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID ?? "";

export async function POST(req: NextRequest) {
  await dbConnect();
  const { assetUnit } = await req.json();

  const ticket = await Ticket.findOne({ assetUnit });
  if (!ticket) return NextResponse.json({ valid: false, reason: "Ticket not found" });

  const resp = await fetch(
    `${BLOCKFROST_API_URL}/assets/${assetUnit}/addresses`,
    { headers: { project_id: BLOCKFROST_PROJECT_ID } }
  );
  const data = await resp.json();
  const currentOwner = data[0]?.address;

  if (currentOwner !== ticket.originalOwnerWallet) {
    return NextResponse.json({ valid: false, reason: "Ticket transferred off-platform" });
  }
  return NextResponse.json({ valid: true });
}