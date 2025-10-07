import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cron from "node-cron";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ---------------- MongoDB ----------------
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

// ---------------- Schemas ----------------
const fixtureSchema = new mongoose.Schema({
  date: String,
  time: String,
  homeTeam: String,
  awayTeam: String,
  leagueId: String,
  homeLogo: String,
  awayLogo: String,
});

const predictionSchema = new mongoose.Schema({
  homeTeam: String,
  awayTeam: String,
  homeLogo: String,
  awayLogo: String,
});

const clickSchema = new mongoose.Schema({
  userId: String,
  date: String,
  homepageClicks: { type: Number, default: 0 },
  downloadClicks: { type: Number, default: 0 },
});

const Fixture = mongoose.model("Fixture", fixtureSchema);
const Prediction = mongoose.model("Prediction", predictionSchema);
const Click = mongoose.model("Click", clickSchema);

// ---------------- Pages ----------------
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));
app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "public/admin.html")));

// ---------------- Admin APIs ----------------
// Fixtures
app.get("/admin/fixtures", async (req, res) => {
  const fixtures = await Fixture.find();
  res.json(fixtures);
});

app.post("/admin/fixture", async (req, res) => {
  const { _id, date, time, homeTeam, awayTeam, leagueId } = req.body;
  const homeLogo = `/logos/${homeTeam}.png`;
  const awayLogo = `/logos/${awayTeam}.png`;

  if (_id) {
    const updated = await Fixture.findByIdAndUpdate(
      _id,
      { date, time, homeTeam, awayTeam, leagueId, homeLogo, awayLogo },
      { new: true }
    );
    return res.json(updated);
  } else {
    const newFixture = new Fixture({ date, time, homeTeam, awayTeam, leagueId, homeLogo, awayLogo });
    await newFixture.save();
    return res.json(newFixture);
  }
});

app.delete("/admin/fixture", async (req, res) => {
  const { _id } = req.body;
  await Fixture.findByIdAndDelete(_id);
  res.json({ success: true });
});

// Predictions
app.get("/admin/predictions", async (req, res) => {
  const predictions = await Prediction.find();
  res.json(predictions);
});

app.post("/admin/prediction", async (req, res) => {
  const { _id, homeTeam, awayTeam } = req.body;
  const homeLogo = `/logos/${homeTeam}.png`;
  const awayLogo = `/logos/${awayTeam}.png`;

  if (_id) {
    const updated = await Prediction.findByIdAndUpdate(
      _id,
      { homeTeam, awayTeam, homeLogo, awayLogo },
      { new: true }
    );
    return res.json(updated);
  } else {
    const newPred = new Prediction({ homeTeam, awayTeam, homeLogo, awayLogo });
    await newPred.save();
    return res.json(newPred);
  }
});

app.delete("/admin/prediction", async (req, res) => {
  const { _id } = req.body;
  await Prediction.findByIdAndDelete(_id);
  res.json({ success: true });
});

// ---------------- Clicks ----------------
app.post("/click", async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userId = ip.replace(/[^a-zA-Z0-9]/g, "");
  const { type } = req.body;
  const today = new Date().toISOString().split("T")[0];

  let click = await Click.findOne({ userId, date: today });
  if (!click) {
    click = new Click({
      userId,
      date: today,
      homepageClicks: type === "homepage" ? 1 : 0,
      downloadClicks: type === "download" ? 1 : 0,
    });
    await click.save();
    return res.json({ success: true, message: "New daily record created" });
  }

  if (type === "homepage" && click.homepageClicks === 0) click.homepageClicks = 1;
  if (type === "download" && click.downloadClicks === 0) click.downloadClicks = 1;

  await click.save();
  res.json({ success: true, message: "Click recorded or already counted" });
});

app.get("/admin/clicks", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const clicks = await Click.find({ date: today });
  const homepageClicks = clicks.reduce((a, c) => a + c.homepageClicks, 0);
  const downloadClicks = clicks.reduce((a, c) => a + c.downloadClicks, 0);
  res.json({ homepageClicks, downloadClicks });
});

// ---------------- Daily Reset ----------------
cron.schedule("0 0 * * *", async () => {
  try {
    await Click.deleteMany({});
    console.log("🕛 Click data reset for new day");
  } catch (err) {
    console.error("❌ Error resetting click data:", err);
  }
});

// ---------------- Fallback ----------------
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
