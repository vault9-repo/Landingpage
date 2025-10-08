import express from "express";
import Click from "../models/Click.js";
import UserClick from "../models/UserClick.js";

const router = express.Router();

const getToday = () => new Date().toISOString().split("T")[0];

router.post("/", async (req, res) => {
  try {
    const { type, userId } = req.body;
    if (!type || !userId) return res.status(400).json({ error: "Missing type or userId" });

    const today = getToday();
    const existing = await UserClick.findOne({ userId, type, date: today });
    if (existing) return res.json({ success: true, message: "Already counted today" });

    await UserClick.create({ userId, type, date: today });
    const click = await Click.findOneAndUpdate(
      { type, date: today },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
    res.json({ success: true, click });
  } catch (err) {
    console.error("Error recording click:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
