const express = require("express");
const Deal = require("../models/Deal");

const router = express.Router();

// get all deals
router.get("/", async (req, res) => {
  const deals = await Deal.find();
  res.json(deals);
});

// get single deal
router.get("/:id", async (req, res) => {
  const deal = await Deal.findById(req.params.id);
  res.json(deal);
});

module.exports = router;
