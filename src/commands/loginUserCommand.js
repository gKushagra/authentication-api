const mongoose = require('mongoose');
const config = require('../config');
const { getDate, responseMessages } = require('../helperMethods');
const logger = require('../logger');
const User = mongoose.model("User");

const loginUserCommand = async (user) => {
    if (!user || !user['email'] || !user['password']
        || user['email'] === '' || user['password'] === '') {
        return { status: responseMessages.badRequest, data: {} }
    }

    logger.info(`${getDate().getUTCDate()}:: loginUserCommand execute`);

    try {
        logger.info(`${getDate().getUTCDate()}:: loginUserCommand connecting to db`);
        mongoose.connect(config.mongoUri, config.mongoOptions);
    } catch (error) {
        logger.error(`${getDate().getUTCDate()}:: loginUserCommand Error: ${error}`);
        mongoose.disconnect();
        return { status: responseMessages.serverError, data: {} }
    }

    try {
        logger.info(`${getDate().getUTCDate()}:: loginUserCommand checking email unique`);
        var result = await User.findOne({ email: user.email });
    } catch (error) {
        logger.error(`${getDate().getUTCDate()}:: loginUserCommand Error: ${error}`);
        mongoose.disconnect();
        return { status: responseMessages.serverError, data: {} }
    }

    mongoose.disconnect();

    if (result) {
        logger.info(`${getDate().getUTCDate()}:: loginUserCommand user found`);

        const existingUser = new User(result);
        const validPassword = await existingUser.validatePassword(
            user.password,
            existingUser.password
        );

        if (validPassword) {
            logger.info(`${getDate().getUTCDate()}:: loginUserCommand login success`);
            const token = existingUser.getToken();
            return { status: responseMessages.ok, data: { token } }
        } else {
            logger.info(`${getDate().getUTCDate()}:: loginUserCommand invalid password`);
            return { status: responseMessages.unauthorized, data: {} }
        }
    } else {
        return { status: responseMessages.badRequest, data: {} }
    }
}

module.exports = loginUserCommand;