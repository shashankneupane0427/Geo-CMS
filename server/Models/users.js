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
    enum: ["admin", "Province User", "District User"],
    required: true,
  },
  district: [String],
  province: String,
});

const user = mongoose.model("users", userSchema);
export default user;
