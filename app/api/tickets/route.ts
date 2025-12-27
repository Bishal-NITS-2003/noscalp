import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/mongodb";
import Ticket from "@/app/models/Ticket";

export async function POST(req: NextRequest) {
  await dbConnect();
  const ticket = await req.json();

  //Validate input before saving
  if (!ticket.assetUnit || !ticket.mintTxHash || !ticket.originalOwnerWallet) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const created = await Ticket.create(ticket);
    return NextResponse.json(created);
  } catch (e: any) {
    //Handle duplicate key error
    if (e.code === 11000) {
      return NextResponse.json(
        { error: "Ticket already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function GET() {
  await dbConnect();
  const tickets = await Ticket.find();
  return NextResponse.json(tickets);
}