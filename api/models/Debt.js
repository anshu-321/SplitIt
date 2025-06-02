const mongoose = require("mongoose");

const debtSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    from: {
      type: String, // username of the person who owes // person who will pay the money
      required: true,
    },
    to: {
      type: String, // username of the person owed to // person who will receive the money
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    tag: {
      type: String,
      enum: ["active", "completed"],
      required: true,
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Debt", debtSchema);
