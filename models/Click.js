import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  type: { type: String, enum: ["homepage", "download"], required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Click", clickSchema);
