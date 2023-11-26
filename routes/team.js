const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Team = require('../model/Team');
const User = require('../model/User');

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


module.exports = router;