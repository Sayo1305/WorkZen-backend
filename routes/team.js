const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Team = require('../model/Team');
const User = require('../model/User');
const mongoose = require('mongoose');


const getUserId  = (token) => {
      const userid = jwt.verify(token , process.env.SECRET_KEY);
      return userid?.userId
} 

router.post('/create_team' , async (req, res) => {
      var user_id = null;
      try{
            user_id = getUserId(
                  req.headers["authorization"].replace("Bearer ", "")
            );
      }catch(err){
            console.log(err);
            return res.status(401).json({ok : false , msg : "Authentication failed"});
      }
      try{

            const {name , plan , domain , country} = req.body;
            const team_id = Date.now().toString().substring(6);
            const owner = await User.findOne({user_id : user_id});
            if(!owner){
                  return res.status(400).json({ok : false , msg : "Owner Not exist"});
            }
            const newTeam = new Team({
                  name : name , 
                  plan : plan , 
                  domain : domain , 
                  country : country,
                  team_id : team_id,
                  user_connector_id : user_id,
            });
            newTeam.members.push(owner._id);
            await newTeam.save();
            owner.teams.push(newTeam._id);
            await owner.save();
            return res.status(201).json({ok : true , msg : "Team created successfully"});

      }catch(err){
            console.log(err);
            return res.status(500).json({ok : false , msg : "Internal server error"});
      }
})

router.post('/add_team', async (req, res) => {
      let ownerId = null;
    
      try {
        // Extract user ID from the request header
        ownerId = getUserId(req.headers['authorization'].replace('Bearer ', ''));
      } catch (err) {
        console.log(err);
        return res.status(401).json({ ok: false, msg: 'Authentication failed' });
      }
    
      try {
        const { team_id  , user_id} = req.body;
        // Check if the user is already a member of a team
        const user = await User.findById(user_id).populate('teams');
        if (user.teams.length > 0) {
          return res.status(400).json({ ok: false, msg: 'User is already a member of a team' });
        }
    
        // Assuming you have the team_id in the request body

    
        // Find the team by ID
        const team = await Team.findById(team_id);
        if (!team) {
          return res.status(404).json({ ok: false, msg: 'Team not found' });
        }
    
        // Add the user to the team's members
        team.members.push(user_id);
        await team.save();
    
        // Add the team to the user's teams
        user.teams.push(team_id);
        await user.save();
    
        return res.status(200).json({ ok: true, msg: 'User added to the team successfully' });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, msg: 'Internal Server Error' });
      }
});

router.post('/remove_member', async (req, res) => {
      let ownerId = null;
    
      try {
        // Extract user ID from the request header
        ownerId = getUserId(req.headers['authorization'].replace('Bearer ', ''));
      } catch (err) {
        console.log(err);
        return res.status(401).json({ ok: false, msg: 'Authentication failed' });
      }

      const { teamId, userId } = req.body;
    
      try {
        // Check if the team exists
        const team = await Team.findById(teamId);
        if (!team) {
          return res.status(404).json({ ok: false, msg: 'Team not found' });
        }
    
        // Check if the user is a member of the team
        if (!team.members.includes(userId)) {
          return res.status(404).json({ ok: false, msg: 'User is not a member of the team' });
        }
    
        // Update the Team document to remove the user from the members array
        await Team.findByIdAndUpdate(
          teamId,
          { $pull: { members: userId } },
          { new: true } // This option returns the modified document
        );
    
        // Update the User document to remove the team from the teams array
        await User.findByIdAndUpdate(
          userId,
          { $pull: { teams: teamId } },
          { new: true } // This option returns the modified document
        );
    
        return res.status(201).json({ ok: true, msg: 'Member removed successfully' });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, msg: 'Internal server error' });
      }
});

router.get('/user_team', async (req, res) => {
  let ownerId = null;

  try {
    // Extract user ID from the request header
    ownerId = getUserId(req.headers['authorization'].replace('Bearer ', ''));
  } catch (err) {
    console.log(err);
    return res.status(401).json({ ok: false, msg: 'Authentication failed' });
  }

  try {
  
    const user = await User.find({user_id : ownerId}).lean().exec();

    if (!user) {
      return res.status(404).json({ ok: false, msg: 'User not found' });
    }
    console.log(user)

    // Fetch the teams associated with the user
    const teamIds = user[0].teams.map(teamId => new mongoose.Types.ObjectId(teamId));

    // Fetch the teams associated with the user
    const teams = await Team.find({ _id: { $in: teamIds } });
    return res.status(200).json({ ok: true, teams });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: 'Internal server error' });
  }
});


module.exports = router;