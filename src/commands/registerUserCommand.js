const mongoose = require('mongoose');
const config = require('../config');
const { getDate, responseMessages } = require('../helperMethods');
const logger = require('../logger');
const User = mongoose.model("User");

const registerUserCommand = async (user) => {
    if (!user || !user['username'] || !user['password']
        || user['username'] === '' || user['password'] === '') {
        return { status: responseMessages.badRequest, data: {} }
    }

    logger.info(`${getDate().getUTCDate()}:: registerUserCommand execute`);

    try {
        logger.info(`${getDate().getUTCDate()}:: registerUserCommand connecting to db`);
        mongoose.connect(config.mongoUri, config.mongoOptions);
    } catch (error) {
        logger.error(`${getDate().getUTCDate()}:: registerUserCommand Error: ${error}`);
        return { status: responseMessages.serverError, data: {} }
    }

    try {
        logger.info(`${getDate().getUTCDate()}:: registerUserCommand checking email unique`);
        var result = await User.exists({ email: user.email });
    } catch (error) {
        logger.error(`${getDate().getUTCDate()}:: registerUserCommand Error: ${error}`);
        mongoose.disconnect();
        return { status: responseMessages.serverError, data: {} }
    }

    if (result) {
        logger.info(`${getDate().getUTCDate()}:: registerUserCommand user exists`);
        mongoose.disconnect();
        return { status: responseMessages.badRequest, data: {} }
    }

    logger.info(`${getDate().getUTCDate()}:: registerUserCommand creating user object`);
    const newUser = new User();
    const hash = await newUser.getHash(user.password);
    newUser.email = user.email;
    newUser.password = hash;

    try {
        logger.info(`${getDate().getUTCDate()}:: registerUserCommand inserting doc`);
        await newUser.save();
    } catch (error) {
        logger.error(`${getDate().getUTCDate()}:: registerUserCommand Error: ${error}`);
        mongoose.disconnect();
        return { status: responseMessages.serverError, data: {} }
    }

    logger.info(`${getDate().getUTCDate()}:: registerUserCommand doc inserted`);
    const token = newUser.getToken();
    mongoose.disconnect();

    return { status: responseMessages.ok, data: { token } }
}

module.exports = registerUserCommand;