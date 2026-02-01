const express = require("express");
const User = require("../models/User");
const Deal = require("../models/Deal");
const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

const router = express.Router();

/**
 * GET /api/admin/users
 * Admin: get all users with claims
 */
router.get("/users", auth, admin, async (req, res) => {
  try {
    const users = await User.find();

    const result = await Promise.all(
      users.map(async (user) => {
        const claims = await Promise.all(
          (user.claims || []).map(async (c) => {
            const deal = await Deal.findById(c.dealId);
            return {
              dealId: c.dealId,
              dealTitle: deal ? deal.title : "Unknown Deal",
              status: c.status,
            };
          })
        );

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          claims,
        };
      })
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/admin/verify-user
 */
router.post("/verify-user", auth, admin, async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isVerified = true;
    await user.save();

    res.json({ message: "User verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/admin/claim-action
 * body: { userId, dealId, status }
 */
router.post("/claim-action", auth, admin, async (req, res) => {
  try {
    const { userId, dealId, status } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const claim = user.claims.find(
      (c) => c.dealId.toString() === dealId
    );

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    claim.status = status; // approved / rejected
    await user.save();

    res.json({ message: "Claim status updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
