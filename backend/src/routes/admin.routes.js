const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

const router = express.Router();

/* ================= ADMIN: GET ALL CLAIMS ================= */
/**
 * GET /api/admin/claims
 */
router.get("/claims", auth, admin, async (req, res) => {
  try {
    const users = await User.find({
      "claims.0": { $exists: true },
    }).populate("claims.dealId", "title partner isLocked");

    const claims = [];

    users.forEach((user) => {
      user.claims.forEach((c) => {
        claims.push({
          userId: user._id,
          userName: user.name,
          userEmail: user.email,
          dealId: c.dealId?._id,
          title: c.dealId?.title,
          partner: c.dealId?.partner,
          isLocked: c.dealId?.isLocked,
          status: c.status,
        });
      });
    });

    res.json(claims);
  } catch (error) {
    console.error("ADMIN CLAIMS ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= ADMIN: APPROVE / REJECT ================= */
/**
 * PUT /api/admin/claims
 * body: { userId, dealId, status }
 */
router.put("/claims", auth, admin, async (req, res) => {
  try {
    const { userId, dealId, status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

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

    claim.status = status;
    await user.save();

    res.json({ message: "Claim updated successfully" });
  } catch (error) {
    console.error("ADMIN UPDATE ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
