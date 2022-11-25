const loginUserCommand = require("../commands/loginUserCommand");
const registerUserCommand = require("../commands/registerUserCommand");
const resetPasswordLinkCommand = require("../commands/resetPasswordLinkCommand");
const resetPasswordCommand = require("../commands/resetPasswordCommand");
const { unwrapResult } = require('../helperMethods');
const logger = require("../logger");
const date = new Date();

const registerController = async (req, res) => {
    logger.info(`${date.getUTCDate()}:: registerController called`);
    const result = unwrapResult(await registerUserCommand(req.body));
    logger.info(`${date.getUTCDate()}:: registerController done`);
    res.status(result.code).json(result.data);
}

const loginController = async (req, res) => {
    logger.info(`${date.getUTCDate()}:: loginController called`);
    const result = unwrapResult(await loginUserCommand(req.body));
    logger.info(`${date.getUTCDate()}:: loginController done`);
    res.status(result.code).json(result.data);
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