import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  date: { type: String, required: true },
  homepageClicks: { type: Number, default: 0 },
  downloadClicks: { type: Number, default: 0 },
});

export default mongoose.model("Click", clickSchema);
