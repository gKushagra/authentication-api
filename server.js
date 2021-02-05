require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// init app
const app = express();

// for integration test
app.get("/test", function (req, res) {
  res.send("Hi! You have reached OddFellow SSO REST API Test endpoint");
});

// configure app
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// import data models
require("./models/ssoUser");
require("./models/resetAuth");
require("./models/user");
require("./models/profile");

// passport configuration
require("./config/passport");

// import authentication and user routes
const apiAccessRoutes = require("./routes/apiAccessRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/v1/api", apiAccessRoutes);
app.use("/v1/auth", authRoutes);
app.use("/v1/user", userRoutes);

app.listen(2048, () => {
  console.log("api running on port 2048");
});

module.exports = app;
