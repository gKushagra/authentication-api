require('dotenv').config();
const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');
const CryptoJS = require('crypto-js');

const { Schema } = mongoose;

const SSOUserConfigSchema = new Schema({
    email: String,
    api_key: String,
    db_host: String,
    db_port: Number,
    db_user: String,
    db_pwd: String,
    db_database: String,
    redirect_url: String,
});

SSOUserConfigSchema.methods.setAPIKey = function (email) {
    this.email = email;
    this.api_key = uuid();
}

SSOUserConfigSchema.methods.setDbConfig = function (dbConfig) {
    if (!dbConfig.db_host) return;

    var pass = CryptoJS.AES.encrypt(dbConfig.pass, process.env.TOKEN_SKT).toString();

    this.db_host = dbConfig.host;
    this.db_port = dbConfig.port;
    this.db_user = dbConfig.user;
    this.db_pwd = pass;
    this.db_database = dbConfig.db;
}

SSOUserConfigSchema.methods.setRedirectUrl = function (url) {
    this.redirect_url = url;
}

SSOUserConfigSchema.methods.getDbPass = function (pass) {
    var bytes = CryptoJS.AES.decrypt(pass, process.env.TOKEN_SKT);
    var _originalPass = bytes.toString(CryptoJS.enc.Utf8);
    return _originalPass;
}

mongoose.model("SSOUserConfig", SSOUserConfigSchema);