const express = require("express");
const User = require("../models/User");
const Deal = require("../models/Deal");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * GET /api/dashboard
 * USER DASHBOARD
 */
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    // 🚫 BLOCK ADMIN
    if (req.user.role === "admin") {
      return res
        .status(403)
        .json({ message: "Admins have no dashboard" });
    }

    const user = await User.findById(req.user.id)
      .populate("claims.dealId")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const claims = (user.claims || [])
      .filter((c) => c.dealId) // safety
      .map((c) => ({
        _id: c.dealId._id,
        title: c.dealId.title,
        partner: c.dealId.partner,
        status: c.status,
      }));

    res.json({
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      claims,
    });
  } catch (error) {
    console.error("DASHBOARD ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
