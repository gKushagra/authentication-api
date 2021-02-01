const mongoose = require("mongoose");

const { Schema } = mongoose;

const ProfileSchema = new Schema({
  _id: String,
  name: String,
  avatar: String,
  sques: {
    qname: String,
    qvalue: String
  },
  email: String
});

mongoose.model("Profiles", ProfileSchema);
