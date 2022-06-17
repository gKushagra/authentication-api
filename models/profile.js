const mongoose = require("mongoose");

const { Schema } = mongoose;

const ProfileSchema = new Schema({
  _id: String,
  name: String,
  email: String,
  username: String
});

mongoose.model("Profiles", ProfileSchema);
