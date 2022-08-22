const config = require('../config/config');

const generateMongoUri = async (
    credentials = { host, port, user, pass, db, authdb }
) => {

    if (!credentials ||
        !credentials.host ||
        !credentials.user ||
        !credentials.pass ||
        !credentials.db ||
        !credentials.authdb
    ) {
        return null;
    }

    if (!credentials.port) {
        credentials.port = 27017;
    }

    return `mongodb://${credentials.user}:
        ${credentials.pass}@
        ${credentials.host}:
        ${credentials.port}/
        ${credentials.db}?
        authSource=${credentials.authdb}`;
};

const getPasswordResetEmailHtml = async (url) => {
    return `
      <p>Hello User!</p><br><br>
      <a href="${url}" target="_blank">Click to reset your password</a><br><br>
      <p>Thanks,<p>
      <p>Softwright Single-Sign On (SSO) Team</p><br>
      <small>If you did not initiate this request, report at <b>sso@opensourcedapps.com</b></small>
    `;
};

const getPasswordResetSuccessEmailHtml = async () => {
    return `
      <p>Hello User!</p><br><br>
      <p>Your account password has been reset successfully!</p><br><br>
      <p>Best,<p>
      <p>Softwright Single-Sign On (SSO) Team</p><br>
      <small>If you did not initiate this request, report at <b>sso@opensourcedapps.com</b></small>
    `;
};

const getPasswordResetUrl = async (token) => {
    if (!token) {
        return null;
    } else {
        let url = new URL(config.resetUrl);
        url.searchParams.append("token", token);
        return url;
    }
};

module.exports = {
    generateMongoUri,
    getPasswordResetEmailHtml,
    getPasswordResetSuccessEmailHtml,
    getPasswordResetUrl,
}