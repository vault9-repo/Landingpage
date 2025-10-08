// models/Click.js
import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ["homepage", "download"], required: true },
  date: { type: String, required: true } // store date as YYYY-MM-DD
});

export default mongoose.model("Click", clickSchema);
