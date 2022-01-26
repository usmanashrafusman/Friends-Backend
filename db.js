const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config({path: "./.env"});

// Mongo URI

// Conneting To Mongo

const conn = mongoose.createConnection(process.env.MONGOURI)
const connetToMongo = () => {
 mongoose.connect(process.env.MONGOURI, () => {console.log("Connected To Mongo Sucessfully");});
};
connetToMongo();
//export connetToMongo function
module.exports = conn;