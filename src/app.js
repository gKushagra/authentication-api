const config = require('./config');
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

require("./models/User");
require("./models/Organization");
require("./models/ResetAuth");

const routes = require("./routes");
app.use("/api/v1", routes);

app.listen(config.port || 2048, () => {
  console.log(`OAuth service running on port: ${PORT}`);
});