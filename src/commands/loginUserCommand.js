const mongoose = require('mongoose');
const config = require('../config');
const { getDate } = require('../helperMethods');
const logger = require('../logger');

const User = mongoose.model("User");

const registerUserCommand = async (user) => {
    logger.info(`${getDate().getUTCDate()}:: registerUserCommand execute`);

    try {
        logger.info(`${getDate().getUTCDate()}:: registerUserCommand connecting to db`);
        mongoose.connect(config.mongoUri, config.mongoOptions);
    } catch (error) {
        logger.error(`${getDate().getUTCDate()}:: registerUserCommand Error: ${error}`);
        throw new Error(error);
    }

    try {
        logger.info(`${getDate().getUTCDate()}:: registerUserCommand checking email unique`);
        var result = await User.exists({ email: user.email });
    } catch (error) {
        logger.error(`${getDate().getUTCDate()}:: registerUserCommand Error: ${error}`);
        mongoose.disconnect();
        throw new Error(error);
    }

    if (result) {
        logger.info(`${getDate().getUTCDate()}:: registerUserCommand user exists`);
        mongoose.disconnect();
        return { message: "email exists" }
    }

    logger.info(`${getDate().getUTCDate()}:: registerUserCommand creating user object`);
    const newUser = new User(user);
    newUser.setPassword(user.password);

    try {
        logger.info(`${getDate().getUTCDate()}:: registerUserCommand inserting doc`);
        await newUser.save();
    } catch (error) {
        logger.error(`${getDate().getUTCDate()}:: registerUserCommand Error: ${error}`);
        mongoose.disconnect();
        throw new Error(error);
    }

    logger.info(`${getDate().getUTCDate()}:: registerUserCommand doc inserted`);
    const token = newUser.getToken();
    mongoose.disconnect();

    return { message: "user created", token }
}

module.exports = registerUserCommand;