const mongoose = require("mongoose");
const colors = require("colors")

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {});

  console.log(`MongoDB Connected: ${conn.connection.host}`.yellow.underline);
};

module.exports = connectDB;
