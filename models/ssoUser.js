require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const SSOUserSchema = new Schema({
    email: String,
    password: String
});

SSOUserSchema.methods.setPassword = function (password) {
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) console.log(err);
        this.password = hash;
    });
}

SSOUserSchema.methods.validatePassword = function (password, hash) {
    return bcrypt.compare(password, hash, (err, result) => {
        if (err) console.log(err);
        return result;
    });
}

SSOUserSchema.methods.getToken = function (userID) {
    return jwt.sign({ id: userID }, process.env.TOKEN_SKT);
}

mongoose.model("SSOUsers", SSOUserSchema);