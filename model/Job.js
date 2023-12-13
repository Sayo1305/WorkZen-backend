

const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  job_id: {
    type: String,
    default: Date.now().toString().substring(6),
  },
  team_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  user_connector_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assign_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  Priority: {
    type: String,
    required: true,
  },
  issue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "issueLabel",
  },
  label: {
    type: String,
//     required: true,
  },
  due_date: {
    type: String,
  },
  start_date: {
    type: String,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categoryLabel",
  },
  linked_jobs: [
    {
      issue: {
        type: String,
      },
      job_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    },
  ],
  status: {
    type: String,
    default: "pending",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Job = mongoose.model("Job", JobSchema);

module.exports = Job;
