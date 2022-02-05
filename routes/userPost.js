const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const conn = require("../db");
const upload = require("../middlewares/uploadImage");
const authenticate = require("../middlewares/authenticate");
const Post = require("../models/Post");
const User = require("../models/User");

//add a post
router.post(
  "/addpost",
  authenticate,
  upload.single("file"),
  async (req, res) => {
    try {
      //sending data to DB.
      const post = new Post({
        user: req.user._id,
        caption: req.body.caption,
        image: req.file ? req.file.id : null,
      });
      //Saving note of DB
      const addedPost = await post.save();
      res.send(addedPost);
    } catch (error) {
      console.log(error)
      res.status(500).send("Post Not Uploaded Error Occured");
    }
  }
);

//get logged in user posts
router.get("/getposts", authenticate, async (req, res) => {
  try {
    const _id = mongoose.Types.ObjectId(req.user._id);
    //sending data to DB.
    const post = await Post.find({ user: _id }).sort({ timestamp: -1 });
    //Saving note of DB
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).send("No Posts");
  }
});

//get posts by id
router.get("/postinfo/:id", async (req, res) => {
  try {
    const _id = mongoose.Types.ObjectId(req.params.id);
    //sending data to DB.
    const postInfo = await User.findById({ _id });
    //Saving note of DB
    res.json(postInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send("An Error Occured");
  }
});

// add a comment
router.put("/comment/:id", authenticate, async (req, res) => {
  try {
    const _id = mongoose.Types.ObjectId(req.params.id);
    //sending data to DB.
    const userId = mongoose.Types.ObjectId(req.user._id);
    const post = await Post.findById({ _id });

    await post.updateOne({
      $push: {
        comments: { comment: req.body.comment, user : userId},
      },
    });

    return res.status(200).json(post);

    res.status(200).json({ liked: false });
  } catch (error) {
    console.log(error);
    res.status(500).send("An Error Occured");
  }
});

// like a post
router.put("/like/:id", authenticate, async (req, res) => {
  try {
    const _id = mongoose.Types.ObjectId(req.params.id);
    //sending data to DB.
    const userId = mongoose.Types.ObjectId(req.user._id);
    const post = await Post.findById({ _id });

    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      return res.status(200).json({ liked: true });
    }
    await post.updateOne({ $pull: { likes: userId } });
    res.status(200).json({ liked: false });
  } catch (error) {
    console.log(error);
    res.status(500).send("An Error Occured");
  }
});

module.exports = router;
