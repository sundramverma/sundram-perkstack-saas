const express = require("express");
const Claim = require("../models/Claim");
const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

const router = express.Router();

/* ================= GET ALL CLAIMS ================= */
router.get("/claims", auth, admin, async (req, res) => {
  const claims = await Claim.find()
    .populate("user", "name email isVerified")
    .populate("deal", "title isLocked")
    .populate("actionBy", "name email");

  res.json(claims);
});

/* ================= APPROVE CLAIM ================= */
router.put("/claims/:id/approve", auth, admin, async (req, res) => {
  const claim = await Claim.findById(req.params.id);

  if (!claim) {
    return res.status(404).json({ message: "Claim not found" });
  }

  claim.status = "approved";
  claim.actionBy = req.user.id;
  await claim.save();

  res.json({ message: "Claim approved" });
});

/* ================= REJECT CLAIM ================= */
router.put("/claims/:id/reject", auth, admin, async (req, res) => {
  const claim = await Claim.findById(req.params.id);

  if (!claim) {
    return res.status(404).json({ message: "Claim not found" });
  }

  claim.status = "rejected";
  claim.actionBy = req.user.id;
  await claim.save();

  res.json({ message: "Claim rejected" });
});

module.exports = router;
