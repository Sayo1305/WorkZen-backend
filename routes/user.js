
const express = require('express');
const User = require('../model/User');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');



const hashPassword = async (password) => {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  const hashedValue = hash.digest('hex');
  return hashedValue;
}

const validatePassword = (password, hash) => {
  const hashPass = crypto.createHash('sha256');
  hashPass.update(password);
  const hashedValue = hash.digest('hex');
  return hashedValue === hash;
}

const getUserId = (token) => {
  const userid = jwt.verify(token, process.env.SECRET_KEY);
  return userid?.userId;
}

router.post('/sign_up', async (req, res) => {
  try {
    // using Google Id
    if (req.body.google_id) {
      const { email, name, google_id, profile_url } = req.body;
      const already_user = await User.find({ email: email });
      if (already_user && already_user.length > 0) {
        return res.status(400).json({ ok: false, msg: "Already User Exist" });
      }
      const user_id = Date.now().toString().substring(6);
      const newUser = new User({
        email: email,
        name: name,
        user_id: user_id,
        google_id: google_id,
        profile_url: profile_url
      });
      await newUser.save();
      const hashToken = jwt.sign({ userId: user_id }, process.env.SECRET_KEY);
      return res.status(201).json({ ok: true, msg: "User created successfully", token: hashToken });

    } else {
      const { email, password, name } = req.body;
      // check if email already exist
      const already_user = await User.find({ email: email }).lean().exec();
      if (already_user && already_user.length > 0) {
        return res.status(400).send({ ok: false, msg: "Already User Exist" });
      }
      const hashpass = hashPassword(password);
      const user_id = Date.now().toString().substring(6);
      const newUser = new User({
        email: email,
        password: hashpass?.Promise,
        name: name,
        user_id: user_id,
      });
      await newUser.save();
      const hashToken = jwt.sign({ userId: user_id }, process.env.SECRET_KEY);
      return res.status(201).json({ ok: true, msg: "User created successfully", token: hashToken });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, msg: err });
  }
})




// make for login here

router.post('/login', async (req, res) => {
  // console.log(req.body);
  try {
    if (req.body.google_id) {
      const { email, name, google_id, profile_url } = req.body;
      const already_user = await User.find({ email: email });
      if(!already_user){
        return res.status(400).json({ ok: false, msg: "User must sign up first" });
      }
      const hashToken = jwt.sign({ userId: already_user[0].user_id }, process.env.SECRET_KEY);
      return res.status(201).json({ ok: true, msg: "User created successfully", data: { hashToken, user :  already_user } });

    } else {
      const { email, password } = req.body;
      const findUser = await User.findOne({"email": email});
      // console.log(findUser);

      if (findUser) {
        if (validatePassword(password, findUser.password)) {
          const hashToken = jwt.sign({ userId: findUser.user_id }, process.env.SECRET_KEY);
          return res.status(201).json({ ok: true, msg: "User created successfully", data: { hashToken, user :  findUser } });
        } else {
          return res.status(404).json({ ok: false, msg: "wrong password" });
        }
      }else{
        return res.status(404).json({ ok: false, msg: "User not registered" });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, msg: err });
  }
});


router.get('/get_users', async (req, res) => {
  try {
      var user_id = null;
      try{
            user_id = getUserId(
                  req.headers["authorization"].replace("Bearer ", "")
            );
      }catch(err){
            console.log(err);
            return res.status(401).json({ok : false , msg : "Authentication failed"});
      }
    const users = await User.find({user_id  : user_id});
    if(!users){
      return res.status(404).json({ok : false , msg : "user not found"});
    }
    return res.status(200).json({ok : true , data : users});
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
