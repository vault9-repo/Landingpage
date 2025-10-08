import express from "express";
import Click from "../models/Click.js";

const router = express.Router();

// POST /api/clicks
router.post("/", async (req, res) => {
  try {
    const { userId, type } = req.body;
    const today = new Date().toISOString().slice(0,10); // YYYY-MM-DD

    // Find or create today's document for this type
    let clickDoc = await Click.findOne({ type, date: today });

    if (!clickDoc) {
      clickDoc = new Click({ type, date: today, users: [] });
    }

    // Only count if user hasn't clicked yet
    if (!clickDoc.users.includes(userId)) {
      clickDoc.users.push(userId);
      await clickDoc.save();
    }

    // Return total count
    res.json({ count: clickDoc.users.length });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/clicks?type=homepage
router.get("/", async (req, res) => {
  try {
    const type = req.query.type;
    const today = new Date().toISOString().slice(0,10);

    const clickDoc = await Click.findOne({ type, date: today });
    res.json({ count: clickDoc ? clickDoc.users.length : 0 });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
