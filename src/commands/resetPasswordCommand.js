const mongoose = require('mongoose');
const config = require('../config');
const {
    getDate,
    getResetPasswordSuccessEmailHtml,
} = require('../helperMethods');
const logger = require('../logger');
const sendEmailCommand = require('./sendEmailCommand');

const User = mongoose.model("User");
const ResetAuth = mongoose.model("ResetAuth");

const resetPasswordCommand = async (password, requestId) => {
    logger.info(`${getDate().getUTCDate()}:: resetPasswordCommand execute`);

    try {
        logger.info(`${getDate().getUTCDate()}:: resetPasswordCommand connecting to db`);
        mongoose.connect(config.mongoUri, config.mongoOptions);
    } catch (error) {
        logger.error(`${getDate().getUTCDate()}:: resetPasswordCommand Error: ${error}`);
        mongoose.disconnect();
        throw new Error(error);
    }

    try {
        logger.info(`${getDate().getUTCDate()}:: resetPasswordCommand find reset auth request`);
        var result = await ResetAuth.findOne({ id: requestId });
    } catch (error) {
        logger.error(`${getDate().getUTCDate()}:: resetPasswordCommand Error: ${error}`);
        mongoose.disconnect()
        throw new Error(error);
    }

    if (!result) {
        mongoose.disconnect();
        return { message: "invalid reset request" }
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
        throw new Error(error);
    }

    mongoose.disconnect();

    const html = getResetPasswordSuccessEmailHtml();

    await sendEmailCommand({
        to: result.email,
        subject: "Softwright OAuth Password Reset Request",
        text: "Your account password has been reset successfully!",
        html
    });

    logger.info(`${getDate().getUTCDate()}:: resetPasswordCommand password reset success email sent`);

    return { message: "password reset successfully" }
}

module.exports = resetPasswordCommand;