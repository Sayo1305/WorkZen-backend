const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  team_id: {
    type: String,
    required: true,
  },
  profile_url : {
    type: String,
    default : "https://res.cloudinary.com/dqpirrbuh/image/upload/v1700758146/25726227_5000_2_08_vmuja3.jpg",
  },
  name: {
    type: String,
    required: true,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  user_connector_id : {
      type: String,
      required: true,
  },
  domain : {
    type: String,
  },
  plan : {
    type: String,
  },
  country : {
    type: String,
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
