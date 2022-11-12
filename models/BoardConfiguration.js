import mongoose, { Schema } from "mongoose";
import { BOARD_FIELD_SHAPES } from "../enums/boardFieldShapes.js";
import { BOARD_FORMATS } from "../enums/boardFormats.js";

const boardConfigurationSchema = new Schema({
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
    }
  ]
});

export const BoardConfiguration = mongoose.model('BoardConfiguration', boardConfigurationSchema, 'boardConfigurations');
