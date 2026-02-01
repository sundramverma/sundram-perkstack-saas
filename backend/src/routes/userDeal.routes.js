const express = require("express");
const User = require("../models/User");
const Deal = require("../models/Deal");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

// 🔓 GET DEAL WITH USER CONTEXT
router.get("/:dealId", auth, async (req, res) => {
  try {
    const { dealId } = req.params;

    const deal = await Deal.findById(dealId);
    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ SAFE access
    const claim = user.claims?.find(
      (c) => c.dealId.toString() === dealId
    );

    res.json({
      unlocked: claim?.status === "approved",
      claimStatus: claim ? claim.status : null,
    });
  } catch (error) {
    console.error("USER-DEAL ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
