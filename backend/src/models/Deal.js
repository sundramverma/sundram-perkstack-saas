const mongoose = require("mongoose");

const DealSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    category: {
      type: String,
      enum: ["Hosting", "Design", "Marketing", "Finance", "Tools"],
      required: true,
    },

    partner: { type: String, required: true },

    discount: {
      type: String,
      required: true, // e.g. "50% OFF", "$100 Credit"
    },

    isLocked: {
      type: Boolean,
      default: true, // 🔒 locked until claimed
    },

    eligibility: {
      type: String, // e.g. "Startups under 1 year"
    },

    isActive: {
      type: Boolean,
      default: true, // admin can disable deal
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deal", DealSchema);
