import mongoose, { Document, Schema, Types } from "mongoose";
import { IUser } from "./User.model";

export interface IBoard extends Document {
  _id: Types.ObjectId;
  users: IUser[];
  name?: string;
  activities: {
    _id: Types.ObjectId;
    name?: string;
    icon?: string;
    isCompleted: boolean;
    completionDate: Date;
    photo: string;
  }[];
}

const boardSchema = new Schema<IBoard>({
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
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
    },
  ],
});

export const Board = mongoose.model<IBoard>("Board", boardSchema, "boards");
