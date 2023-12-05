const mongoose = require("mongoose");

const categoryLabelSchema = new mongoose.Schema({
  category_id: {
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

const categoryLabel = mongoose.model("categoryLabel", categoryLabelSchema);

module.exports = categoryLabel;
