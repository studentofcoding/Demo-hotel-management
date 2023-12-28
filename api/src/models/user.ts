import mongoose from "mongoose";

export type UserType = {      //here the same type used here is used in userSchema below it is because for keep the correct type of the data within the project
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;