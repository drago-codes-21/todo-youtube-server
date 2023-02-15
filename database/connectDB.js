const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Conencted to database..");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connection;
