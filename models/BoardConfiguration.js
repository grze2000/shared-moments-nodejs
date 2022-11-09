import { Schema } from "mongoose";
import { BOARD_FIELD_SHAPES } from "../enums/boardFieldShapes";

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
