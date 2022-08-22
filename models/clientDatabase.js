const config = require('../config/config');
const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');

const { Schema } = mongoose;

const DatabaseSettingSchema = new Schema({
    host: String,
    port: Number,
    user: String,
    pass: String,
    database: String,
    auth_source: String
});

DatabaseSettingSchema.methods.encryptDatabasePass = function (pass) {
    var pass = CryptoJS.AES.encrypt(pass, config.secretKey).toString();
    this.pass = pass;
}

DatabaseSettingSchema.methods.getDatabasePassword = function (pass) {
    var bytes = CryptoJS.AES.decrypt(pass, config.secretKey);
    var _pass = bytes.toString(CryptoJS.enc.Utf8);
    return _pass;
}

mongoose.model("DatabaseSetting", DatabaseSettingSchema);