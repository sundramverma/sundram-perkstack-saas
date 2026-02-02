const express = require("express");
const mongoose = require("mongoose");
const Claim = require("../models/Claim");
const Deal = require("../models/Deal");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

/* ================= CLAIM DEAL ================= */
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

    // ❌ duplicate claim check
    const existing = await Claim.findOne({
      user: req.user.id,
      deal: dealId,
    });

    if (existing) {
      return res.status(400).json({ message: "Deal already claimed" });
    }

    // 🔒 locked deal protection
    if (deal.isLocked && !req.user.isVerified) {
      return res
        .status(403)
        .json({ message: "Verification required to claim this deal" });
    }

    const claim = await Claim.create({
      user: req.user.id,
      deal: dealId,
    });

    res.json({
      message: "Claim request sent to admin",
      claim,
    });
  } catch (error) {
    console.error("CLAIM ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
