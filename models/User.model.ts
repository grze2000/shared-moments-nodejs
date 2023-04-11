import mongoose, { Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends mongoose.Document {
  _id: string;
  fullname: string;
  password: string;
  email: string;
}

export interface IUserMethods {
  comparePassword: (
    password: string,
    cb: (error: Error | null, isMath?: boolean) => void
  ) => void;
}

export type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  fullname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", function (next) {
  if (!this.isNew) return next();
  bcrypt.hash(this.password, 10, (err, hash) => {
    this.password = hash;
    next();
  });
});

userSchema.method(
  "comparePassword",
  function (
    password: string,
    cb: (error: Error | null, isMath?: boolean) => void
  ) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  }
);

export const User = mongoose.model<IUser, UserModel>("User", userSchema, "users");
