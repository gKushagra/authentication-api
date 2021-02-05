require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const SSOUserSchema = new Schema({
    email: String,
    password: String
});

SSOUserSchema.methods.setPassword = function (password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    this.password = hash;
}

SSOUserSchema.methods.validatePassword = function (password, hash) {
    return bcrypt.compareSync(password, hash);
}

SSOUserSchema.methods.getToken = function () {
    return jwt.sign({ id: this._id }, process.env.TOKEN_SKT);
}

mongoose.model("SSOUsers", SSOUserSchema);