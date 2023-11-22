
const express = require('express');
const User = require('../model/User');
const router = express.Router();
const crypto = require('crypto');


const hashPassword = async(password) => {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  const hashedValue = hash.digest('hex');
  return hashedValue;
}

router.post('/sign_up' , async (req , res) => { 
  try{
    // using Google Id
    if(req.body.google_id){

    }else{
      const {email  , password , name , role  , teamDetails} = req.body;
      // check if email already exist
      const already_user = await User.find({email  : email});
      if(already_user){
        return res.status(400).json({ok : false , msg : "Already User Exist"});
      }
      const hashpass = hashPassword(password);
      const user_id = Date.now().toString().substring(6);
      if(!teamDetails){
        return res.status(400).json({ok : false , msg : "Organisation is not setup"});
      }
    }
  }catch(err){
    return  res.status(500).json({ok : false , msg  : err});
  }
})

router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
