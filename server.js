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

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));

// =================== FIXTURES ===================
app.get("/admin/fixtures", async (req, res) => {
  const fixtures = await Fixture.find().sort({ date: 1, time: 1 });
  res.json(fixtures);
});

app.post("/admin/fixture", async (req, res) => {
  console.log("📥 Fixture POST:", req.body);
  const { _id, date, time, homeTeam, awayTeam, leagueId } = req.body;

  try {
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
      const fixture = new Fixture({
        date,
        time,
        homeTeam,
        awayTeam,
        leagueId,
        homeLogo,
        awayLogo,
      });
      await fixture.save();
      return res.json(fixture);
    }
  } catch (err) {
    console.error("❌ Fixture save failed:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/admin/fixture", async (req, res) => {
  const { _id } = req.body;
  await Fixture.findByIdAndDelete(_id);
  res.json({ success: true });
});

// =================== PREDICTIONS ===================
app.get("/admin/predictions", async (req, res) => {
  const preds = await Prediction.find();
  res.json(preds);
});

app.post("/admin/prediction", async (req, res) => {
  console.log("📥 Prediction POST:", req.body);
  const { _id, homeTeam, awayTeam } = req.body;

  try {
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
      const pred = new Prediction({ homeTeam, awayTeam, homeLogo, awayLogo });
      await pred.save();
      return res.json(pred);
    }
  } catch (err) {
    console.error("❌ Prediction save failed:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/admin/prediction", async (req, res) => {
  const { _id } = req.body;
  await Prediction.findByIdAndDelete(_id);
  res.json({ success: true });
});

// =================== CLICK TRACKING ===================
app.get("/admin/clicks", async (req, res) => {
  let clicks = await Click.findOne();
  if (!clicks) clicks = await Click.create({});
  res.json(clicks);
});

app.post("/click/:type", async (req, res) => {
  const { type } = req.params;
  let clicks = await Click.findOne();
  if (!clicks) clicks = await Click.create({});
  if (type === "home") clicks.homepageClicks++;
  if (type === "download") clicks.downloadClicks++;
  await clicks.save();
  res.json(clicks);
});

// =================== RUN SERVER ===================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🌍 Server running on http://localhost:${PORT}`)
);
