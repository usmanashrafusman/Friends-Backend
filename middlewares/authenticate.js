const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(token)
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    console.log(verifyToken._id)
    const userData = await User.findOne({
      _id: verifyToken._id,
      "tokens.tokens": token,
    });
    req.user = userData;
    console.log(userData);
    next();
  } catch (error) {
      console.log(error)
    res.status(401).send("You are Unauthorized");
  }
};

module.exports =  authenticate;
