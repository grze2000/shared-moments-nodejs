import mongoose, { Schema } from "mongoose";

const refreshTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    required: true,
  },
});

export const RefreshToken = mongoose.model(
  "RefreshToken",
  refreshTokenSchema,
  "refreshTokens"
);
