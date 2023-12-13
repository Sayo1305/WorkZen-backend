const mongoose = require("mongoose");

const issueLabelSchema = new mongoose.Schema({
  issue_id: {
    type: String,
    required: true,
  },
  team_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
  },
  name: {
    type: String,
    required: true,
  },
  user_connector_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const issueLabel = mongoose.model("issueLabel", issueLabelSchema);

module.exports = issueLabel;
