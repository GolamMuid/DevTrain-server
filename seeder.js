const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load ENV variables
dotenv.config({ path: "./config/config.env" });

// Load Models
const Bootcamp = require("./models/Bootcamp");

// Connect to database
mongoose.connect(process.env.MONGO_URI, {});

// Read JSON Files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

// Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log("bootcamps imported");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log("bootcamps deleted");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
