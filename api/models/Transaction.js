const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    paidBy: {
      type: String, // username
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    splitBetween: {
      type: [String], // usernames
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Food & Dining",
        "Entertainment",
        "Travel",
        "Party/Events",
        "Gifts",
        "Groceries",
        "Utilities",
        "Rent",
        "Household Supplies",
        "Cleaning Services",
        "Medical",
        "Education",
        "Transportation",
        "Miscellaneous",
      ],
      default: "Miscellaneous",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
