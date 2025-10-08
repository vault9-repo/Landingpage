import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  type: { type: String, required: true },      // 'homepage' or 'download'
  date: { type: String, required: true },      // YYYY-MM-DD
  count: { type: Number, default: 0 },
  users: { type: [String], default: [] }      // store unique userIds
});

// Ensure one document per type per day
clickSchema.index({ type: 1, date: 1 }, { unique: true });

export default mongoose.model("Click", clickSchema);
