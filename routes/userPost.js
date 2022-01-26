const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const conn = require("../db");
const upload = require("../middlewares/uploadImage")
const authenticate = require("../middlewares/authenticate")
const Post = require("../models/Post")


//retriving image from DB
router.post("/addpost",authenticate,upload.single("file"),  async(req, res) => {
  try {
        console.log(req.body)
      //sending data to DB.
      const post = new Post({
        user: req.user._id,
        caption : req.body.caption,
        image: req.file.id
      });
      //Saving note of DB
      const addedPost = await post.save();
      res.send(addedPost);
  } catch (error) {
    console.log(error);
    res.status(500).send("Post Not Uploaded Error Occured")
  }
});

module.exports = router;
