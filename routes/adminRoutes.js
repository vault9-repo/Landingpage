import express from "express";
import Fixture from "../models/Fixture.js";
import Prediction from "../models/Prediction.js";
import Click from "../models/Click.js";

const router = express.Router();

// --- FIXTURES ---
router.get("/fixtures", async (req, res) => {
  const fixtures = await Fixture.find().sort({ date: 1 });
  res.json(fixtures);
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
  await Fixture.findByIdAndDelete(req.body._id);
  res.json({ success: true });
});

// --- PREDICTIONS ---
router.get("/predictions", async (req, res) => {
  const predictions = await Prediction.find();
  res.json(predictions);
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
  await Prediction.findByIdAndDelete(req.body._id);
  res.json({ success: true });
});

// --- CLICKS ---
router.get("/clicks", async (req, res) => {
  let clicks = await Click.findOne();
  if (!clicks) clicks = await Click.create({});
  res.json(clicks);
});

export default router;
