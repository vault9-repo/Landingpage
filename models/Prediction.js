import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema({
  homeTeam: String,
  awayTeam: String,
  homeLogo: String,
  awayLogo: String,
}, { timestamps: true });

export default mongoose.model("Prediction", predictionSchema);
