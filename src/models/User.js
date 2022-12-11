const config = require('../config');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const UserSchema = new Schema({
    email: String,
    password: String
});

UserSchema.methods.getHash = async (unencryptedPassword) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(unencryptedPassword, salt);
    return hash;
}

UserSchema.methods.validatePassword = async (unencryptedPassword, hash) => {
    return await bcrypt.compare(unencryptedPassword, hash);
}

UserSchema.methods.getToken = (email) => {
    return jwt.sign({ email }, config.tokenSecret, { expiresIn: 60 * 60 });
}

mongoose.model("User", UserSchema);