import mongoose from "mongoose";

const userClickSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: String, required: true },
});

userClickSchema.index({ userId: 1, type: 1, date: 1 }, { unique: true });

export default mongoose.model("UserClick", userClickSchema);
