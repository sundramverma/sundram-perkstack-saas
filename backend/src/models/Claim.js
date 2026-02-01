const mongoose = require("mongoose");

const ClaimSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deal",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    actionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin who approved/rejected
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Claim", ClaimSchema);
