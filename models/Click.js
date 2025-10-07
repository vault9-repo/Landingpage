import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  homepageClicks: { type: Number, default: 0 },
  downloadClicks: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Click", clickSchema);
