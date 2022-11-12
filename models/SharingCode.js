import mongoose, { Schema } from "mongoose";

const sharingCodeSchema = new Schema({
  board: {
    type: Schema.Types.ObjectId,
    ref: "Board",
  },
  expiresAt: {
    type: Date,
    default: new Date(+new Date() + 60*60*1000).toISOString()
  }
});

export const SharingCode = mongoose.model(
  "SharingCode",
  sharingCodeSchema,
  "sharingCodes"
);
