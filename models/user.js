require('dotenv').config();
const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const { Schema } = mongoose;

const UsersSchema = new Schema({
  username: String,
  hash: String,
  salt: String,
});

UsersSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

UsersSchema.methods.validatePassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

UsersSchema.methods.generateJWT = function () {
  const today = new Date();
  const expiration = new Date(today);
  expiration.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      expiry: parseInt(expiration.getTime() / 1000, 10),
    },
    process.env.TOKEN_SKT
  );
};

UsersSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    token: this.generateJWT(),
  };
};

UsersSchema.methods.toAuthJSONnoID = function (id) {
  const today = new Date();
  const expiration = new Date(today);
  expiration.setDate(today.getDate() + 60);

  const token = jwt.sign(
    {
      id: id,
      expiry: parseInt(expiration.getTime() / 1000, 10),
    },
    process.env.TOKEN_SKT
  );
  return {
    _id: id,
    token: token
  }
}
mongoose.model("Users", UsersSchema);
