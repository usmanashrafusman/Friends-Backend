const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const conn = require("../db");

let gfs;

//initilizing gfs
conn.once("open", async() => {
  gfs = await new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
  console.log("Connected Once");
});

//retriving image from DB
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const _id = mongoose.Types.ObjectId(id);
    gfs.find({ _id }).toArray((err, file) => {
      const readstream = gfs.openDownloadStream(file[0]._id);
      readstream.pipe(res);
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
