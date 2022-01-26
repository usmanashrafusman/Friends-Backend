const { GridFsStorage } = require("multer-gridfs-storage");
const mongoose = require("mongoose");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");


//making gridFsStorage
const storage = new GridFsStorage({
  url: process.env.MONGOURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      //generating random string
      crypto.randomBytes(16, (err, buff) => {
        if (err) {
          return reject(err);
        }
        //giving unique filenamem with extension
        const filename = buff.toString("hex") + path.extname(file.originalname);
        const fileinfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileinfo);
      });
    });
  },
});

const upload = multer({ storage });

module.exports = upload;
