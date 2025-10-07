import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema({
  uniqueId: { type: String, default: uuidv4, unique: true },
  username: String,
  email: String,
  joinedAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
