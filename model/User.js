const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  gender: {
    type: String,
    enum: ["male", "female", "any"],
  },
  google_id : {
    type: String,
  },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  role: {
    type: String,
    enum: ["user", "manager", "admin"],
//     admin -> main one who create organisation
//     manager-> who regulate or create task or maintain the overall work
//     user -> who can see  task and mark them complete or ask doubt about this
    default: "user",
  },
  job_profile: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  profile_url: {
    type: String,
    default:
      "https://res.cloudinary.com/dqpirrbuh/image/upload/v1700517682/blank-profile-picture_b84iuc.png",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
