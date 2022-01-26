const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;

// createing a schema to add user data in db
const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//method to generate JWT Token to authenticate user
UserSchema.methods.getAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
  } catch (e) {
    console.log(e);
  }
};

const User = mongoose.model("user", UserSchema);
module.exports = User;
