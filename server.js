import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import Fixture from "./models/Fixture.js";
import Prediction from "./models/Prediction.js";
import Click from "./models/Click.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- PATH SETUP ----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------- DATABASE ----------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB error:", err));

// ---------------- STATIC FILES ----------------
app.use(express.static(path.join(__dirname, "public")));

// ---------------- FIXTURES ----------------
app.get("/admin/fixtures", async (req, res) => {
  const fixtures = await Fixture.find().sort({ date: 1, time: 1 });
  res.json(fixtures);
});

app.post("/admin/fixture", async (req, res) => {
  const { _id, date, time, homeTeam, awayTeam, leagueId } = req.body;
  if (_id) {
    await Fixture.findByIdAndUpdate(_id, { date, time, homeTeam, awayTeam, leagueId });
  } else {
    const fixture = new Fixture({ date, time, homeTeam, awayTeam, leagueId });
    await fixture.save();
  }
  res.json({ success: true });
});

app.delete("/admin/fixture", async (req, res) => {
  const { _id } = req.body;
  await Fixture.findByIdAndDelete(_id);
  res.json({ success: true });
});

// ---------------- PREDICTIONS ----------------
app.get("/admin/predictions", async (req, res) => {
  const predictions = await Prediction.find();
  res.json(predictions);
});

app.post("/admin/prediction", async (req, res) => {
  const { _id, homeTeam, awayTeam } = req.body;
  if (_id) {
    await Prediction.findByIdAndUpdate(_id, { homeTeam, awayTeam });
  } else {
    const prediction = new Prediction({ homeTeam, awayTeam });
    await prediction.save();
  }
  res.json({ success: true });
});

app.delete("/admin/prediction", async (req, res) => {
  const { _id } = req.body;
  await Prediction.findByIdAndDelete(_id);
  res.json({ success: true });
});

// ---------------- CLICK TRACKING ----------------
app.post("/api/click/homepage", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  let clicks = await Click.findOne({ date: today });
  if (!clicks) clicks = new Click({ date: today });
  clicks.homepageClicks += 1;
  await clicks.save();
  res.json({ success: true });
});

app.post("/api/click/download", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  let clicks = await Click.findOne({ date: today });
  if (!clicks) clicks = new Click({ date: today });
  clicks.downloadClicks += 1;
  await clicks.save();
  res.json({ success: true });
});

app.get("/admin/clicks", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const clicks = await Click.findOne({ date: today });
  res.json(clicks || { homepageClicks: 0, downloadClicks: 0 });
});

// ---------------- FRONTEND ROUTES ----------------
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
