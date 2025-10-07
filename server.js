import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cron from "node-cron";
import { v4 as uuidv4 } from "uuid";

import Fixture from "./models/Fixture.js";
import Prediction from "./models/Prediction.js";
import Click from "./models/Click.js";
import User from "./models/User.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, "public")));

// ---------- MongoDB ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ---------- ROUTES ----------

// Serve main & admin pages
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));
app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "public/admin.html")));

// ----- Fixtures -----
app.get("/admin/fixtures", async (req, res) => res.json(await Fixture.find()));

app.post("/admin/fixture", async (req, res) => {
  const { _id, date, time, homeTeam, awayTeam, leagueId } = req.body;
  const homeLogo = `/logos/${homeTeam}.png`;
  const awayLogo = `/logos/${awayTeam}.png`;
  const fixtureData = { date, time, homeTeam, awayTeam, leagueId, homeLogo, awayLogo };

  const fixture = _id
    ? await Fixture.findByIdAndUpdate(_id, fixtureData, { new: true })
    : await new Fixture(fixtureData).save();

  res.json(fixture);
});

app.delete("/admin/fixture", async (req, res) => {
  await Fixture.findByIdAndDelete(req.body._id);
  res.json({ success: true });
});

// ----- Predictions -----
app.get("/admin/predictions", async (req, res) => res.json(await Prediction.find()));

app.post("/admin/prediction", async (req, res) => {
  const { _id, homeTeam, awayTeam } = req.body;
  const homeLogo = `/logos/${homeTeam}.png`;
  const awayLogo = `/logos/${awayTeam}.png`;
  const predData = { homeTeam, awayTeam, homeLogo, awayLogo };

  const prediction = _id
    ? await Prediction.findByIdAndUpdate(_id, predData, { new: true })
    : await new Prediction(predData).save();

  res.json(prediction);
});

app.delete("/admin/prediction", async (req, res) => {
  await Prediction.findByIdAndDelete(req.body._id);
  res.json({ success: true });
});

// ----- User & Click Tracking -----
app.post("/click", async (req, res) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const { type, userId } = req.body;
    const today = new Date().toISOString().split("T")[0];

    let user = userId
      ? await User.findOne({ userId })
      : await new User({ userId: uuidv4(), ipAddress: ip }).save();

    if (!user) user = await new User({ userId: uuidv4(), ipAddress: ip }).save();

    const activeId = user.userId;

    let click = await Click.findOne({ userId: activeId, date: today });
    if (!click) {
      click = new Click({
        userId: activeId,
        date: today,
        homepageClicks: type === "homepage" ? 1 : 0,
        downloadClicks: type === "download" ? 1 : 0,
      });
    } else {
      if (type === "homepage" && click.homepageClicks === 0) click.homepageClicks = 1;
      if (type === "download" && click.downloadClicks === 0) click.downloadClicks = 1;
    }

    await click.save();
    res.json({ success: true, userId: activeId });
  } catch (err) {
    console.error("❌ Click tracking error:", err);
    res.status(500).json({ success: false });
  }
});

// ----- Click Totals -----
app.get("/admin/clicks", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const clicks = await Click.find({ date: today });
  const homepageClicks = clicks.reduce((a, c) => a + c.homepageClicks, 0);
  const downloadClicks = clicks.reduce((a, c) => a + c.downloadClicks, 0);
  res.json({ homepageClicks, downloadClicks });
});

// ----- Daily Reset -----
cron.schedule("0 0 * * *", async () => {
  await Click.deleteMany({});
  console.log("🕛 Click data reset for new day");
});

// Catch-all
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));

// ---------- START SERVER ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
