const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  team_id: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  user_connector_id : {
      type: String,
      required: true,
  },
  invitation_link: {
    type: String,
    default :  Date.now().toString().substring(6),
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
