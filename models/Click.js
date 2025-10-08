import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  type: { type: String, required: true },       // "homepage" or "download"
  date: { type: String, required: true },       // YYYY-MM-DD
  users: [{ type: String }]                     // Array of userIds who clicked
});

// Ensure one document per type per date
clickSchema.index({ type: 1, date: 1 }, { unique: true });

export default mongoose.model("Click", clickSchema);
