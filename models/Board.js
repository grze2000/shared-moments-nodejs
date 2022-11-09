import { Schema } from "mongoose";

const boardSchema = new Schema({
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  name: String,
  activitiesProgress: [
    {
      name: String,
      icon: String,
      isCompleted: Boolean,
      completionDate: Date,
      photo: String,
    }
  ]
});

export const Board = mongoose.model('Board', boardSchema, 'boards');
