import mongoose from "mongoose";

const fixtureSchema = new mongoose.Schema({
  homeTeam: String,
  awayTeam: String,
  homeLogo: String,
  awayLogo: String,
  date: String,
  time: String,
  leagueId: String
}, { timestamps: true });

export default mongoose.model("Fixture", fixtureSchema);
