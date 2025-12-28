import mongoose, { Schema, models, model } from "mongoose";

const TicketSchema = new Schema(
  {
  assetUnit: { type: String, required: true, unique: true },
  mintTxHash: { type: String, required: true },
  originalOwnerWallet: { type: String, required: true },
  status: { type: String, default: "VALID" }
  },
  { timestamps: true }
);

export default models.Ticket || model("Ticket", TicketSchema);