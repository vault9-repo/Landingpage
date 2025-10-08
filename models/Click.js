import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  type: { type: String, required: true }, // homepage, download, facebook, whatsapp, telegram, gmail
  date: { type: String, required: true },
  count: { type: Number, default: 0 },
});

clickSchema.index({ type: 1, date: 1 }, { unique: true });

export default mongoose.model("Click", clickSchema);
