import express from "express";
import Click from "../models/Click.js";
import Fixture from "../models/Fixture.js";
import Prediction from "../models/Prediction.js";

const router = express.Router();

router.get("/fixtures", async (req, res) => {
  const fixtures = await Fixture.find();
  res.json(fixtures);
});

router.get("/predictions", async (req, res) => {
  const predictions = await Prediction.find();
  res.json(predictions);
});

router.post("/click", async (req, res) => {
  const { type } = req.body;
  let clicks = await Click.findOne();
  if (!clicks) clicks = await Click.create({});
  if (type === "homepage") clicks.homepageClicks++;
  if (type === "download") clicks.downloadClicks++;
  await clicks.save();
  res.json({ success: true });
});

export default router;
