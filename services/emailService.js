const config = require('../config/config');
const mailer = require('nodemailer');

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

module.exports = {
    sendEmail,
}