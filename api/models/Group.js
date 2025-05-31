const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    members: {
      type: [String], // Array of usernames (strings)
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Upcoming", "Settled"],
      default: "Upcoming",
    },
    createdBy: {
      type: String, // username of creator
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);
