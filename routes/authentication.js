const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const upload = require("../middlewares/uploadImage");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

//Route : 1 Create a user using POST : No Login Required
router.post(
  "/createuser",
  upload.single("file"),
  [
    body("firstName", "Enter a valid first name").isLength({ min: 3 }),
    body("lastName", "Enter a valid last name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atlest 5 characters").isLength({
      min: 5,
    }),
    body("gender", "Please select your gender").isLength({ min: 3 }),
  ],
  async (req, res) => {
    let success = false;
    //if any error occur show error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      //check if your with same email exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success,
          errors: [
            { param: "email", msg: "User already exists with this emil" },
          ],
        });
      }
      //hasing the user's given password then sending data go MongoDB
      let password = await bcrypt.hash(req.body.password, 12);
      //creating a user
      user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password,
        gender: req.body.gender,
        image: req.file.id,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      //generating auth token
      const authtoken = await user.getAuthToken();
      success = true;
      //sending token to browser setHeader
      res.cookie("token", authtoken, {
        httpOnly: true,
      });
      //sending respond
      res.json({ success, authtoken });
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

//Route : 2 Loging in a user using POST : No Login Required
router.post(
  "/loginuser",
  [
    body("password", "Enter a valid password").isLength({
      min: 5,
    }),
    body("email", "Enter a valid email").isEmail(),
  ],
  async (req, res) => {
    console.log("Login Api Triggered");
    let success = false;
    //if any error occur show error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    //destruturing email & password from body
    const { email, password } = req.body;
    try {
      //checking if user's provided email exists in our DB.
      let user = await User.findOne({ email });
      // if email not exist's
      if (!user) {
        return res.status(400).json({
          success,
          errors: [
            { param: "email", msg: "Please login with correct credentials" },
          ],
        });
      }

      //compareing passwords by the hashed password of DB.
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({
          success,
          errors: [
            { param: "email", msg: "Please login with correct credentials" },
          ],
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };

      //generating auth token
      const authtoken = await user.getAuthToken();
      success = true;
      //sending token to browser cookie
      res.cookie("token", authtoken, {
        httpOnly: true,
      });

      res.json({ success, authtoken });
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

//Route 3 : verifying user token & getting user data : Login Required
router.get("/getuser", authenticate, (req, res) => {
  res.send(req.user);
});

module.exports = router;
