

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Team = require("../model/Team");
const issueLabel = require("../model/issueLabel");
const User = require("../model/User");
const Job = require("../model/Job");
const categoryLabel = require("../model/categoryLabel");

const getUserId = (token) => {
  const userid = jwt.verify(token, process.env.SECRET_KEY);
  return userid?.userId;
};

router.post("/create_job", async (req, res) => {
  var user_id = null;
  try {
    user_id = getUserId(req.headers["authorization"].replace("Bearer ", ""));
  } catch (err) {
    console.log(err);
    return res.status(401).json({ ok: false, msg: "Authentication failed" });
  }
  try {
    const {
      team_id,
      label,
      summary,
      description,
      assign_to,
      reporter,
      Priority,
      issue,
      due_date,
      start_date,
      category_id,
      linked_issue,
      linked_job_id,
    } = req.body;

//     console.log(req.body);
    //     check for all required;
    const user = await User.findOne({ user_id: user_id });
    if (!user) {
      return res.status(404).json({ ok: false, msg: "User not found" });
    }
    const findTeam = await Team.findOne({ team_id, team_id });
    if (!findTeam) {
      return res.status(404).json({ ok: false, msg: "Team not found" });
    }
    //     it means new issue createed by user
    let issueLabelDocument;
    if (issue) {
      const findIssue = await issueLabel.findOne({ name: issue, team_id: findTeam._id });
      if (!findIssue) {
        issueLabelDocument = await issueLabel.create({
          issue_id: Date.now().toString().substring(6),
          team_id: findTeam._id,
          name: issue,
          user_connector_id: user._id,
        });
      } else {
        issueLabelDocument = findIssue;
      }
    }
    // Check if the category label exists or create a new one
    let categoryLabelDocument;
    if (category_id) {
      const findCategory = await categoryLabel.findOne({
        name: category_id,
        team_id: findTeam._id,
      });
      if (!findCategory) {
        categoryLabelDocument = await categoryLabel.create({
          category_id: Date.now().toString().substring(6),
          team_id: findTeam._id,
          name: category_id,
          user_connector_id: user._id,
        });
      } else {
        categoryLabelDocument = findCategory;
      }
    }

    //     check if link job already ther or not
    let linked_jobs = [];
    if (linked_job_id) {
      const linkJobExist = await Job.findOne({ _id: linked_job_id });
      if (linkJobExist) {
        linked_jobs.push({
          issue: linked_issue,
          job_id: linked_job_id,
        });
      }
    }

    const assign_to_user = await User.findOne({ user_id: assign_to });
    if (assign_to_user?.length === 0) {
      return res.status(404).json({ ok: false, msg: "assign user not found" });
    }
    const reporter_user = await User.findOne({ user_id: reporter });
    if (reporter_user?.length === 0) {
      return res.status(404).json({ ok: false, msg: "Reporter user not found" });
    }
    const newJob = await Job.create({
      team_id: findTeam._id,
      summary,
      description,
      user_connector_id: user._id,
      assign_to: assign_to_user?._id,
      reporter: reporter_user?.id,
      Priority,
      issue: issueLabelDocument?._id,
      label: "",
      due_date,
      start_date,
      category_id: categoryLabelDocument?._id,
      linked_jobs,
    });

    return res.status(200).json({ ok: true, job: newJob });
  } catch (er) {
    console.log(er);
    return res.status(500).json({ ok: false, msg: "Internal server error" });
  }
});

router.post("/get_issue_category", async (req, res) => {
  var user_id = null;
  try {
    user_id = getUserId(req.headers["authorization"].replace("Bearer ", ""));
  } catch (err) {
    console.log(err);
    return res.status(401).json({ ok: false, msg: "Authentication failed" });
  }

  try {
    const { team_id } = req.body;

    // Check if the team exists
    const team = await Team.findOne({ team_id });
    if (!team) {
      return res.status(404).json({ ok: false, msg: "Team not found" });
    }

    // Fetch issues for the specified team
    const issues = await issueLabel.find({ team_id: team._id });

    // Fetch categories for the specified team
    const categories = await categoryLabel.find({ team_id: team._id });
    // Extract only the names from the results
    const issueNames = issues.map((issue) => issue.name);
    const categoryNames = categories.map((category) => category.name);

    // Combine the names into a single object if needed
    const data = {
      issue: issueNames,
      category: categoryNames,
    };

    return res.status(200).json({ ok: true, data: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, msg: "Internal server error" });
  }
});

router.get('/get_job_by_user' , async(req , res) => {
  var user_id = null;
  try {
    user_id = getUserId(req.headers["authorization"].replace("Bearer ", ""));
  } catch (err) {
    console.log(err);
    return res.status(401).json({ ok: false, msg: "Authentication failed" });
  }

  const ownerUser = await User.findOne({user_id : user_id});
  if(!ownerUser){
    return res.status(401).json({ ok: false, msg: "Authentication failed" });
  }
  const userJobs = await Job.find({ assign_to: ownerUser?._id }).populate("team_id");
  // console.log(userJobs)
  return res.status(200).json({ok : true , data : userJobs});
})

router.get('/get_job_by_team/:team_id' , async(req , res) => { 
  var user_id = null;
  try {
    user_id = getUserId(req.headers["authorization"].replace("Bearer ", ""));
  } catch (err) {
    console.log(err);
    return res.status(401).json({ ok: false, msg: "Authentication failed" });
  }

  try{
    const team_id = req.params.team_id;
    const team = await Team.find({team_id : team_id});
    if (!team) {
      return res.status(404).json({ ok: false, msg: "Team not found" });
    }
    const jobs = await Job.find({ team_id: team._id });
    res.status(200).json({ ok: true, jobs: jobs });
  }catch(err){
    console.log(err);
    return res.status(401).json({ ok: false, msg: "Authentication failed" });
  }
});

router.post('/update_job_status' , async(req  , res) =>{
  var user_id = null;
  try {
    user_id = getUserId(req.headers["authorization"].replace("Bearer ", ""));
  } catch (err) {
    console.log(err);
    return res.status(401).json({ ok: false, msg: "Authentication failed" });
  }
  try{
    const { job_id , status } = req.body;
    if (!job_id || !status) {
      return res.status(400).json({ ok: false, msg: 'Invalid request data' });
    }

    // Check if the user has permission to update the job (you need to implement this logic)
    const job = await Job.findOne({ job_id: job_id });

    if (!job) {
      return res.status(403).json({ ok: false, msg: 'Permission denied' });
    }

    // Update the job status
    job.status = status;
    await job.save();

    return res.json({ ok: true, msg: 'Job status updated successfully' });

  }catch(err){
    console.log(err);
    return res.status(401).json({ ok: false, msg: "Authentication failed" });
  }
})


module.exports = router;
