const mailer = require('nodemailer');
const config = require('../config');
const logger = require('../logger');
const { getDate } = require('../helperMethods');

const sendEmailCommand = async (
    _ = { from: "Softwright Single-Sign On", to, subject, text, html }
) => {
    logger.info(`${getDate().getUTCDate()}:: sendEmailCommand sending email: ${_}`);
    const transporter = await mailer.createTransport(config.email.smtp);
    try {
        let info = await transporter.sendMail({
            from: _.from,
            to: _.to,
            subject: _.subject,
            text: _.text,
            html: _.html
        });
        logger.info(`${getDate().getUTCDate()}:: sendEmailCommand email sent! info: ${info}`);
        return info;
    } catch (error) {
        logger.error(`${getDate().getUTCDate()}:: sendEmailCommand Error: ${error}`)
        throw new Error("Error occurred while sending email");
    }
};

module.exports = sendEmailCommand;