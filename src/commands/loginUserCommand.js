const mongoose = require('mongoose');
const config = require('../config');
const { getDate } = require('../helperMethods');
const logger = require('../logger');

const User = mongoose.model("User");

const loginUserCommand = async (user) => {
    logger.info(`${getDate().getUTCDate()}:: loginUserCommand execute`);

    try {
        logger.info(`${getDate().getUTCDate()}:: loginUserCommand connecting to db`);
        mongoose.connect(config.mongoUri, config.mongoOptions);
    } catch (error) {
        logger.error(`${getDate().getUTCDate()}:: loginUserCommand Error: ${error}`);
        throw new Error(error);
    }

    try {
        logger.info(`${getDate().getUTCDate()}:: loginUserCommand checking email unique`);
        var result = await User.findOne({ email: user.email });
    } catch (error) {
        logger.error(`${getDate().getUTCDate()}:: loginUserCommand Error: ${error}`);
        mongoose.disconnect();
        throw new Error(error);
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
            return { message: "authorized", token }
        } else {
            logger.info(`${getDate().getUTCDate()}:: loginUserCommand invalid password`);
            return { message: "unauthorized" }
        }
    } else {
        return { message: "user not found" }
    }
}

module.exports = loginUserCommand;