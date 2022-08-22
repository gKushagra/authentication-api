require('dotenv').config();

var config = {};

config["environment"] = process.env.ENV;

if (config.environment === 'dev') {
    config["dbConnectionString"] = process.env.DEV_DB;
    config["resetUrl"] = process.env.DEV_RESET_URL;
} else {
    config["dbConnectionString"] = process.env.CENTRAL_STORE_HOST;
    config["resetUrl"] = process.env.RESET_URL;
}

config["email"] = {
    host: process.env.IMAP_HOST,
    port: process.env.IMAP_PORT,
    secure: true,
    auth: {
        user: process.env.IMAP_USER,
        pass: process.env.IMAP_PASS
    }
}

config["secretKey"] = process.env.TOKEN_SKT;

config["dbOptions"] = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
};

config["emailApi"] = process.env.EMAIL_API;

module.exports = config;