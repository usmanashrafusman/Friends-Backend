const mongoose = require("mongoose");
const { Schema } = mongoose;

// createing a schema to add user data in db
const PostSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  caption: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Array,
    default: [],
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      comment: {
        type: String,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Post = mongoose.model("posts", PostSchema);
module.exports = Post;
