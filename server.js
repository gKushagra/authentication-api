require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// init app
const app = express();

// for integration test
app.get("/test", function (req, res) {
  res.send('Hey there! You are at Softwright Single-Sign On - API Status Page. <a href="https://sso.softwright.in">Visit Website</a>');
});

// configure app
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// import data models
require("./models/ssoUser");
require("./models/ssoUserConfig");
require("./models/resetAuth");
require("./models/profile");

// import authentication and user routes
const apiAccessRoutes = require("./routes/apiAccessRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/v1", apiAccessRoutes);
app.use("/v1/user", userRoutes);

const PORT = process.env.PORT || 2048;

app.listen(PORT, () => {
  console.log(`api running on port ${PORT}`);
});

module.exports = app;
