import mongoose from "mongoose";

const fixtureSchema = new mongoose.Schema({
  date: String,
  time: String,
  homeTeam: String,
  awayTeam: String,
  leagueId: String,
  homeLogo: String,
  awayLogo: String,
}, { timestamps: true });

export default mongoose.model("Fixture", fixtureSchema);
