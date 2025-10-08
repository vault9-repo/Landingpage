import express from "express";
import Click from "../models/Click.js"; // your click model
const router = express.Router();

// Track a click
router.post("/", async (req, res) => {
  try {
    const { userId, type } = req.body; // type = 'homepage' or 'download'
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // Find today's click of this type
    let click = await Click.findOne({ type, date: today });

    if (!click) {
      // No document for today, create it with this user
      click = new Click({
        type,
        date: today,
        users: [userId],
        count: 1
      });
      await click.save();
    } else {
      // Check if user already clicked today
      if (!click.users.includes(userId)) {
        click.users.push(userId);
        click.count += 1;
        await click.save();
      } else {
        // user already clicked today, do nothing
      }
    }

    res.json({ success: true, count: click.count });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get today's counts
router.get("/", async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const homepageClick = await Click.findOne({ type: "homepage", date: today });
    const downloadClick = await Click.findOne({ type: "download", date: today });

    res.json({
      homepageClicks: homepageClick ? homepageClick.count : 0,
      downloadClicks: downloadClick ? downloadClick.count : 0
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ homepageClicks: 0, downloadClicks: 0 });
  }
});

export default router;
