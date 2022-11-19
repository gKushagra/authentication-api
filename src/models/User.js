const config = require('../config');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const UserSchema = new Schema({
    email: String,
    password: String
});

UserSchema.methods.setPassword = (unencryptedPassword) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(unencryptedPassword, salt);
    this.password = hash;
}

UserSchema.methods.validatePassword = (unencryptedPassword, hash) => {
    return bcrypt.compareSync(unencryptedPassword, hash);
}

UserSchema.methods.getToken = () => {
    return jwt.sign({ email: this.email }, config.tokenSecret, { expiresIn: 60 * 60 });
}

mongoose.model("User", UserSchema);