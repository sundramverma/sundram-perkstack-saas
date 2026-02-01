const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const Deal = require("../models/Deal");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/:dealId", auth, async (req, res) => {
  try {
    const { dealId } = req.params;

    // ✅ validate ObjectId
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

    // ✅ ensure claims array exists
    if (!Array.isArray(user.claims)) {
      user.claims = [];
    }

    const alreadyClaimed = user.claims.find(
      (c) => c.dealId.toString() === dealId
    );

    if (alreadyClaimed) {
      return res.status(400).json({ message: "Deal already claimed" });
    }

    // 🔒 locked deal protection
    if (deal.isLocked === true && user.isVerified !== true) {
      return res
        .status(403)
        .json({ message: "Verification required to claim this deal" });
    }

    user.claims.push({
      dealId: deal._id,
      status: "pending",
    });

    await user.save();

    res.json({
      message: "Deal claimed successfully. Awaiting approval.",
    });
  } catch (error) {
    console.error("CLAIM ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
