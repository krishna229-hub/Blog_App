import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Invalid email"]
  },
  password: {
    type: String,
    required: true
  },
  profileImageUrl: {
    type: String
  },
  role: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

export const UserModel =
  mongoose.models.user || mongoose.model("user", userSchema);