const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const Deal = require("../models/Deal");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

/* ================= CLAIM DEAL ================= */
/**
 * POST /api/claim/:dealId
 */
router.post("/:dealId", auth, async (req, res) => {
  try {
    const { dealId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(dealId)) {
      return res.status(400).json({ message: "Invalid deal ID" });
    }

    const deal = await Deal.findById(dealId);
    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❌ duplicate claim check (USER SIDE)
    const alreadyClaimed = user.claims.find(
      (c) => c.dealId.toString() === dealId
    );

    if (alreadyClaimed) {
      return res.status(400).json({ message: "Deal already claimed" });
    }

    // 🔒 locked deal protection
    if (deal.isLocked && !user.isVerified) {
      return res
        .status(403)
        .json({ message: "Verification required to claim this deal" });
    }

    // ✅ THIS WAS MISSING (MAIN FIX)
    user.claims.push({
      dealId,
      status: "pending",
    });

    await user.save();

    res.json({
      message: "Claim request sent to admin",
      status: "pending",
    });
  } catch (error) {
    console.error("CLAIM ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
