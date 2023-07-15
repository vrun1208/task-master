require("dotenv").config();
const express = require("express");
const server = express();
const router = require("./routes/router");

// for parsing the req.body for postman
server.use(express.json());
// for brwoser
server.use(express.urlencoded({ extended: false }));

// middleware for routes
server.use("/api/v1", router);

// require connectDB from db/connect
const connectDB = require("./db/connect");

// creating a start function that will connect to database and run the server
const start = async () => {
  try {
    await connectDB(process.env.MONGOOSE_URI);
    server.listen(
      process.env.PORT,
      console.log("running at port", process.env.PORT)
    );
  } catch (error) {
    console.log("::error::", error);
  }
};
start();
