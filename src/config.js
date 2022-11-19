require('dotenv').config();
var config = {};
config["env"] = process.env.ENV;
config["mongoUri"] = process.env.MONGO_URI;
config["sendgrid"] = {
    apiKey: process.env.SG_KEY,
    verifiedSender: process.env.VRF_SENDER
};
config["email"] = {
    smtp: {
        host: process.env.SMTP_HOST,
        post: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    },
    imap: {
        host: process.env.IMAP_HOST,
        port: process.env.IMAP_PORT,
        secure: true,
        auth: {
            user: process.env.IMAP_USER,
            pass: process.env.IMAP_PASS
        }
    }
};
config["port"] = process.env.PORT;
config["domain"] = process.env.DOMAIN;
config["tokenSecret"] = process.env.TOKEN_SKT;
config["mongoOptions"] = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
};
module.exports = config;