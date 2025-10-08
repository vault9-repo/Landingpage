import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema({
  homeTeam: String,
  awayTeam: String
});

export default mongoose.model("Prediction", predictionSchema);
