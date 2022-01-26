const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  try {
    //getting user token
    const token = req.cookies.token;
    //verifying token
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    //getting user data with throught _id & token
    
    const userData = await User.findOne({
      _id:verifyToken._id,
      "tokens.tokens": token,
    });
    req.user = userData;
    console.log("Next is Next")
    next();
  } catch (error) {
    console.log(error)
    res.status(401).send("You are Unauthorized");
  }
};

module.exports =  authenticate;
