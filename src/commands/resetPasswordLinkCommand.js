const mongoose = require('mongoose');
const config = require('../config');
const {
    getDate,
    getPasswordResetUrl,
    getResetPasswordEmailHtml,
} = require('../helperMethods');
const logger = require('../logger');
const sendEmailCommand = require('./sendEmailCommand');

const User = mongoose.model("User");
const ResetAuth = mongoose.model("ResetAuth");

const resetPasswordLinkCommand = async (email) => {
    logger.info(`${getDate().getUTCDate()}:: resetPasswordLinkCommand execute`);

    try {
        logger.info(`${getDate().getUTCDate()}:: resetPasswordLinkCommand connecting to db`);
        mongoose.connect(config.mongoUri, config.mongoOptions);
    } catch (error) {
        logger.error(`${getDate().getUTCDate()}:: resetPasswordLinkCommand Error: ${error}`);
        mongoose.disconnect()
        throw new Error(error);
    }

    try {
        logger.info(`${getDate().getUTCDate()}:: resetPasswordLinkCommand find user account`);
        var result = await User({ email });
    } catch (error) {
        logger.error(`${getDate().getUTCDate()}:: resetPasswordLinkCommand Error: ${error}`);
        mongoose.disconnect();
        throw new Error(error);
    }

    if (!result) {
        mongoose.disconnect();
        return { message: "user not found" }
    }

    const newResetAuthReq = new ResetAuth({ email, id: null });
    const requestId = newResetAuthReq.setResetRequest(email);

    try {
        logger.info(`${getDate().getUTCDate()}:: resetPasswordLinkCommand save reset request`);
        await newResetAuthReq.save();
    } catch (error) {
        logger.error(`${getDate().getUTCDate()}:: resetPasswordLinkCommand Error: ${error}`);
        mongoose.disconnect();
        throw new Error(error);
    }

    mongoose.disconnect();

    const url = getPasswordResetUrl(requestId);
    if (!url) {
        logger.error(`${getDate().getUTCDate()}:: resetPasswordLinkCommand empty url`);
        throw new Error(error);
    }

    const html = getResetPasswordEmailHtml(url);

    await sendEmailCommand({
        to: email,
        subject: "Softwright OAuth Password Reset Request",
        text: url,
        html
    });

    logger.info(`${getDate().getUTCDate()}:: resetPasswordLinkCommand password reset email sent`);

    return { message: "reset link sent" }
}

module.exports = resetPasswordLinkCommand;