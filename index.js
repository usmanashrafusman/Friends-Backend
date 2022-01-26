const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config({ path: "./.env" });
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authentication");
const imageRoutes = require("./routes/images")
const postRoutes = require('./routes/userPost')

const app = express();
app.use(cors());
const port = process.env.PORT;

//middleware for browser cookie
app.use(cookieParser());

//middleware to get req JSON
app.use(express.json());

// middleware for all routes for images
app.use("/images", imageRoutes);

// middleware for all routes for auth
app.use("/user", authRoutes);

// middleware for all routes for post
app.use("/post", postRoutes);


app.listen(port, () => {
  console.log(`Friends App Server Listening at http://localhost:${port}`);
});
