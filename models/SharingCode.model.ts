import mongoose, { Document, Schema } from "mongoose";
import { IBoard } from "./Board.model";

export interface ISharingCode extends Document {
  board: IBoard;
  expiresAt: Date;
}

const sharingCodeSchema = new Schema<ISharingCode>({
  board: {
    type: Schema.Types.ObjectId,
    ref: "Board",
  },
  expiresAt: {
    type: Date,
    default: new Date(+new Date() + 60 * 60 * 1000),
  },
});

export const SharingCode = mongoose.model<ISharingCode>(
  "SharingCode",
  sharingCodeSchema,
  "sharingCodes"
);
