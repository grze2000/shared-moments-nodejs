import mongoose, { Schema } from "mongoose";
import { BOARD_FIELD_SHAPES } from "../enums/boardFieldShapes.enum.js";
import { BOARD_FORMATS } from "../enums/boardFormats.enum.js";
import { Document } from "mongoose";

export interface IBoardConfiguration extends Document {
  shape: BOARD_FIELD_SHAPES;
  rows: number;
  columns: number;
  tileSize: {
    width: number;
    height: number;
  };
  format: BOARD_FORMATS;
  title: string;
  activities: {
    name: string;
    icon: string;
  }[];
}

const boardConfigurationSchema = new Schema<IBoardConfiguration>({
  shape: {
    type: String,
    required: true,
    enum: Object.values(BOARD_FIELD_SHAPES),
  },
  rows: {
    type: Number,
    required: true,
  },
  columns: {
    type: Number,
    required: true,
  },
  tileSize: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  format: {
    type: String,
    required: true,
    enum: Object.values(BOARD_FORMATS),
  },
  title: {
    type: String,
    required: true,
  },
  activities: [
    {
      name: String,
      icon: String,
    },
  ],
});

export const BoardConfiguration = mongoose.model<IBoardConfiguration>(
  "BoardConfiguration",
  boardConfigurationSchema,
  "boardConfigurations"
);
