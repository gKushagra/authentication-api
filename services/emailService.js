const config = require('../config/config');
const mailer = require('nodemailer');
const axios = require('axios').default;

const sendEmail = async (
    _ = { from: string = "Softwright Single-Sign On Service", to, subject, text, html }
) => {
    console.log(config.email);
    console.log(_);
    const transporter = await mailer.createTransport(config.email);

    try {
        let info = await transporter.sendMail({
            from: _.from,
            to: _.to,
            subject: _.subject,
            text: _.text,
            html: _.html
        });
        console.log("Email info: " + info);
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

const sendEmailSendgrid = async (
    _ = { to, subject, text, html }
) => {
    // console.log(_);

    axios.post(config.emailApi, _)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log(error);
            throw new Error(error);
        });
};

module.exports = {
    sendEmail,
    sendEmailSendgrid,
}