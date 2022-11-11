import mongoose, { Schema } from "mongoose";

const boardSchema = new Schema({
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  name: String,
  activities: [
    {
      name: String,
      icon: String,
      isCompleted: {
        type: Boolean,
        default: false,
      },
      completionDate: {
        type: Date,
        default: null,
      },
      photo: {
        type: String,
        default: null,
      },
    }
  ]
});

export const Board = mongoose.model('Board', boardSchema, 'boards');
