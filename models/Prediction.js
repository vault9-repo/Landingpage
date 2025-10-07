import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema({
  homeTeam: String,
  awayTeam: String
}, { timestamps: true });

export default mongoose.model("Prediction", predictionSchema);
