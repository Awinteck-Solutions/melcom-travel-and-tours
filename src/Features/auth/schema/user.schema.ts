const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: false },
    firstname: { type: String, default: null },
    lastname: { type: String, default: null },
    phone: { type: String, default: null },
    dateOfBirth: { type: Date, default: null },
    address: { type: String, default: null },
    image: { type: String, default: null },
    otp: { type: String, required: true },
    status: {
      type: String,
      enum: ["ACTIVE", "DEACTIVE"],
      default: "ACTIVE",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
