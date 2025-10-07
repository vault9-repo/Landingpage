import express from "express";
import User from "../models/User.js";

const router = express.Router();

// ✅ Register user (auto unique ID)
router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ success: true, userId: user.uniqueId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Get user by ID
router.get("/:id", async (req, res) => {
  const user = await User.findOne({ uniqueId: req.params.id });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json(user);
});

export default router;
