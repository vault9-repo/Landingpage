import express from "express";
import Fixture from "../models/Fixture.js";
import Prediction from "../models/Prediction.js";
import Click from "../models/Click.js";

const router = express.Router();

// Fixtures
router.get("/fixtures", async (req, res) => {
  const data = await Fixture.find({}).lean();
  res.json(data);
});

router.post("/fixture", async (req, res) => {
  const { _id, date, time, homeTeam, awayTeam, leagueId } = req.body;
  if (_id) {
    await Fixture.findByIdAndUpdate(_id, { date, time, homeTeam, awayTeam, leagueId });
  } else {
    await Fixture.create({ date, time, homeTeam, awayTeam, leagueId });
  }
  res.json({ success: true });
});

router.delete("/fixture", async (req, res) => {
  const { _id } = req.body;
  await Fixture.findByIdAndDelete(_id);
  res.json({ success: true });
});

// Predictions
router.get("/predictions", async (req, res) => {
  const data = await Prediction.find({}).lean();
  res.json(data);
});

router.post("/prediction", async (req, res) => {
  const { _id, homeTeam, awayTeam } = req.body;
  if (_id) {
    await Prediction.findByIdAndUpdate(_id, { homeTeam, awayTeam });
  } else {
    await Prediction.create({ homeTeam, awayTeam });
  }
  res.json({ success: true });
});

router.delete("/prediction", async (req, res) => {
  const { _id } = req.body;
  await Prediction.findByIdAndDelete(_id);
  res.json({ success: true });
});

// Clicks summary
router.get("/clicks", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const clicks = await Click.find({ date: today }).lean();
  const summary = {};
  clicks.forEach(c => summary[c.type] = c.count);
  res.json(summary);
});

export default router;
