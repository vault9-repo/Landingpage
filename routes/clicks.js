// routes/clicks.js
import express from "express";
import Click from "../models/Click.js";

const router = express.Router();

// Add click (unique per user per day)
router.post("/", async (req, res) => {
  try {
    const { userId, type } = req.body;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Check if user already clicked today
    const existing = await Click.findOne({ userId, type, date: today });
    if (existing) return res.status(200).json({ message: "Already counted today" });

    // Save click
    const click = new Click({ userId, type, date: today });
    await click.save();

    res.json({ success: true, message: "Click counted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get click counts (today)
router.get("/", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const homepageClicks = await Click.countDocuments({ type: "homepage", date: today });
    const downloadClicks = await Click.countDocuments({ type: "download", date: today });
    res.json({ homepageClicks, downloadClicks });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
