const loginUserCommand = require("../commands/loginUserCommand");
const registerUserCommand = require("../commands/registerUserCommand");
const resetPasswordLinkCommand = require("../commands/resetPasswordLinkCommand");
const resetPasswordCommand = require("../commands/resetPasswordCommand");
const logger = require("../logger");
const date = new Date();

const registerController = async (req, res) => {
    try {
        logger.info(`${date.getUTCDate()}:: registerController called`);
        let result = await registerUserCommand(req.body);
        logger.info(`${date.getUTCDate()}:: registerController return`);
        return res.status(200).json(result);
    } catch (error) {
        logger.error(`${date.getUTCDate()}:: registerController Error: ${error}`);
        res.sendStatus(500);
    }
}

const loginController = async (req, res) => {
    try {
        logger.info(`${date.getUTCDate()}:: loginController called`);
        let result = await loginUserCommand(req.body);
        logger.info(`${date.getUTCDate()}:: registerController return`);
        res.status(200).json(result);
    } catch (error) {
        logger.error(`${date.getUTCDate()}:: loginController Error: ${error}`);
        res.sendStatus(500);
    }
}

const resetLinkController = async (req, res) => {
    try {
        logger.info(`${date.getUTCDate()}:: resetLinkController called`);
        let result = await resetPasswordLinkCommand(req.body.email);
        logger.info(`${date.getUTCDate()}:: resetLinkController return`);
        res.status(200).json(result);
    } catch (error) {
        logger.error(`${date.getUTCDate()}:: resetLinkController Error: ${error}`);
        res.sendStatus(500);
    }
}

const resetController = async (req, res) => {
    try {
        logger.info(`${date.getUTCDate()}:: resetController called`);
        let result = await resetPasswordCommand(req.body.password, req.params.token);
        logger.info(`${date.getUTCDate()}:: resetController called`);
        res.status(200).json(result);
    } catch (error) {
        logger.error(`${date.getUTCDate()}:: resetController Error: ${error}`);
        res.sendStatus(500);
    }
}

const authorizeController = async (req, res) => {
    logger.info(`${date.getUTCDate()}:: authorizeController called`);
    res.status(200).json({ msg: "authorized" });
}

module.exports = {
    registerController,
    loginController,
    resetLinkController,
    resetController,
    authorizeController
};