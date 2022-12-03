const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error");

// Load ENV variables
dotenv.config({ path: "./config/config.env" });

connectDB();

// Route files
const bootcamps = require("./routes/bootcamps");

const PORT = process.env.PORT || 5000;

const app = express();

// Body parser
app.use(express.json());

// Dev loggin middleware

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/bootcamps", bootcamps);

app.use(errorHandler);

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);

// Handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error : ${err.message}`);
  server.close(() => process.exit(1));
});
