const express = require("express");
const Deal = require("../models/Deal");

const router = express.Router();

/**
 * GET /api/deals
 * Public – get all deals
 */
router.get("/", async (req, res) => {
  try {
    const deals = await Deal.find().sort({ createdAt: -1 });
    res.json(deals);
  } catch (error) {
    console.error("FETCH DEALS ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/deals/:id
 * Public – get single deal
 */
router.get("/:id", async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    res.json(deal);
  } catch (error) {
    console.error("FETCH DEAL ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
