const mongoose = require('mongoose');
const config = require('../config');
const {
    getDate,
    getResetPasswordSuccessEmailHtml,
    responseMessages,
} = require('../helperMethods');
const logger = require('../logger');
const sendEmailCommand = require('./sendEmailCommand');
const User = mongoose.model("User");
const ResetAuth = mongoose.model("ResetAuth");

const resetPasswordCommand = async (password, requestId) => {
    if (!password || password === '' || !requestId || requestId === '') {
        return { status: responseMessages.badRequest, data: {} }
    }

    logger.info(`${getDate().getUTCDate()}:: resetPasswordCommand execute`);

    try {
        logger.info(`${getDate().getUTCDate()}:: resetPasswordCommand connecting to db`);
        mongoose.connect(config.mongoUri, config.mongoOptions);
    } catch (error) {
        logger.error(`${getDate().getUTCDate()}:: resetPasswordCommand Error: ${error}`);
        mongoose.disconnect();
        return { status: responseMessages.serverError, data: {} }
    }

    try {
        logger.info(`${getDate().getUTCDate()}:: resetPasswordCommand find reset auth request`);
        var result = await ResetAuth.findOne({ id: requestId });
    } catch (error) {
        logger.error(`${getDate().getUTCDate()}:: resetPasswordCommand Error: ${error}`);
        mongoose.disconnect()
        return { status: responseMessages.serverError, data: {} }
    }

    if (!result) {
        mongoose.disconnect();
        return { status: responseMessages.badRequest, data: {} }
    }

    const updatedUser = new User({ email: result.email, password });
    updatedUser.setPassword(password);

    try {
        logger.info(`${getDate().getUTCDate()}:: resetPasswordCommand update user`);
        await updatedUser.findOneAndUpdate(
            { email: result.email },
            { password: updatedUser.password }
        );
    } catch (error) {
        logger.error(`${getDate().getUTCDate()}:: resetPasswordCommand Error: ${error}`);
        mongoose.disconnect()
        return { status: responseMessages.serverError, data: {} }
    }

    mongoose.disconnect();

    const html = getResetPasswordSuccessEmailHtml();

    try {
        var info = await sendEmailCommand({
            from: `Softwright Single-Sign On <${config.sendgrid.verifiedSender}>`,
            to: result.email,
            subject: "Softwright OAuth Password Reset Request",
            text: "Your account password has been reset successfully!",
            html
        });
    } catch (error) {
        logger.error(`${getDate().getUTCDate()}:: resetPasswordCommand Error: ${error}`);
        return { status: responseMessages.serverError, data: {} }
    }

    logger.info(`${getDate().getUTCDate()}:: resetPasswordCommand password reset success email sent`);

    return { status: responseMessages.ok, data: {} }
}

module.exports = resetPasswordCommand;