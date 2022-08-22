const config = require('../config/config');
const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;
const DatabaseSetting = mongoose.model("DatabaseSetting");

const ClientApplicationSchema = new Schema({
    domain: String,
    redirect_url: String
});

ClientApplicationSchema.methods.addClientApplication = function (
    _ = { domain, redirect_url }
) {
    this.domain = _.domain;
    this.redirect_url = _.redirect_url;
}

mongoose.model("ClientApplication", ClientApplicationSchema);

const ClientConfigSchema = new Schema({
    email: String,
    api_key: String,
    api_secret: String,
    db_setting: Object,
    applications: Array
});

ClientConfigSchema.methods.setAPIKey = function (email) {
    this.email = email;
    this.api_key = uuid();
    this.api_secret = jwt.sign(
        { user: email },
        config.secretKey,
        { expiresIn: 60 * 60 * 24 * 14 }
    );
}

ClientConfigSchema.methods.setDatabaseSetting = function (databaseSetting) {
    this.db_setting = databaseSetting;
}

mongoose.model("ClientConfig", ClientConfigSchema);