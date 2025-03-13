import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "province", "district"],
    required: true,
  },
});

const user = mongoose.model("users", userSchema);
export default user;
