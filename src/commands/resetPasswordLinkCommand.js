const mongoose = require('mongoose');
const config = require('../config');
const {
    getDate,
    getPasswordResetUrl,
    getResetPasswordEmailHtml,
    responseMessages,
} = require('../helperMethods');
const logger = require('../logger');
const sendEmailCommand = require('./sendEmailCommand');
const User = mongoose.model("User");
const ResetAuth = mongoose.model("ResetAuth");

const resetPasswordLinkCommand = async (email) => {
    if (!email || email === '') {
        return { status: responseMessages.badRequest, data: {} }
    }

    logger.info(`${getDate().getUTCDate()}:: resetPasswordLinkCommand execute`);

    try {
        logger.info(`${getDate().getUTCDate()}:: resetPasswordLinkCommand connecting to db`);
        mongoose.connect(config.mongoUri, config.mongoOptions);
    } catch (error) {
        logger.error(`${getDate().getUTCDate()}:: resetPasswordLinkCommand Error: ${error}`);
        mongoose.disconnect()
        return { status: responseMessages.badRequest, data: {} }
    }

    try {
        logger.info(`${getDate().getUTCDate()}:: resetPasswordLinkCommand find user account`);
        var result = await User({ email });
    } catch (error) {
        logger.error(`${getDate().getUTCDate()}:: resetPasswordLinkCommand Error: ${error}`);
        mongoose.disconnect();
        return { status: responseMessages.serverError, data: {} }
    }

    if (!result) {
        mongoose.disconnect();
        return { status: responseMessages.ok, data: {} }
    }

    const newResetAuthReq = new ResetAuth({ email, id: null });
    const requestId = newResetAuthReq.setResetRequest(email);

    try {
        logger.info(`${getDate().getUTCDate()}:: resetPasswordLinkCommand save reset request`);
        await newResetAuthReq.save();
    } catch (error) {
        logger.error(`${getDate().getUTCDate()}:: resetPasswordLinkCommand Error: ${error}`);
        mongoose.disconnect();
        return { status: responseMessages.serverError, data: {} }
    }

    mongoose.disconnect();

    const url = getPasswordResetUrl(requestId);
    if (!url) {
        logger.error(`${getDate().getUTCDate()}:: resetPasswordLinkCommand empty url`);
        return { status: responseMessages.serverError, data: {} }
    }

    const html = getResetPasswordEmailHtml(url);

    const info = await sendEmailCommand({
        to: email,
        subject: "Softwright OAuth Password Reset Request",
        text: url,
        html
    });

    logger.info(`${getDate().getUTCDate()}:: resetPasswordLinkCommand password reset email sent`);

    return { status: responseMessages.ok, data: {} }
}

module.exports = resetPasswordLinkCommand;