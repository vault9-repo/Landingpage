import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  date: { type: String, required: true },
  homepage: { type: Number, default: 0 },
  download: { type: Number, default: 0 },
  facebook: { type: Number, default: 0 },
  whatsapp: { type: Number, default: 0 },
  telegram: { type: Number, default: 0 },
  gmail: { type: Number, default: 0 },
  users: [{ userId: String, type: String }] // track users to avoid duplicate clicks
});

export default mongoose.model("Click", clickSchema);
