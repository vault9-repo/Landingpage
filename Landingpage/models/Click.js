import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  userId: String,
  date: String,
  homepageClicked: { type: Boolean, default: false },
  downloadClicked: { type: Boolean, default: false }
});

export default mongoose.model("Click", clickSchema);
