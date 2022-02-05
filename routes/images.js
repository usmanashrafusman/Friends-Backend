const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const conn = require("../db");

let gfs;

//initilizing gfs
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
  console.log("Sever Is Ready");
});

//retriving image from DB
router.get("/:id", async(req, res) => {
  try {
    const { id } = req.params;
    const _id = mongoose.Types.ObjectId(id);
    gfs.find({_id}).toArray((err, file) => {
      const readstream = gfs.openDownloadStream(file[0]._id);
      readstream.pipe(res);
    });
  } catch (error) {
    console.log(error);
    res.status(404).send("No Image Found");
  }
});

module.exports = router;
