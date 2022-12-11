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
    logger.info(`${date.getUTCDate()}:: resetLinkController called`);
    const result = unwrapResult(await resetPasswordLinkCommand(req.params.email));
    logger.info(`${date.getUTCDate()}:: resetLinkController done`);
    res.status(result.code).json(result.data);
}

const resetController = async (req, res) => {
    logger.info(`${date.getUTCDate()}:: resetController called`);
    const result = unwrapResult(await resetPasswordCommand(req.body.password, req.params.token));
    logger.info(`${date.getUTCDate()}:: resetController done`);
    res.status(result.code).json(result.data);
}

const verifyAuthController = async (req, res) => {
    logger.info(`${date.getUTCDate()}:: authorizeController called`);
    const result = unwrapResult({ status: 'OK', data: {} })
    logger.info(`${date.getUTCDate()}:: authorizeController done`);
    res.status(result.code).json(result.data);
}

module.exports = {
    registerController,
    loginController,
    resetLinkController,
    resetController,
    verifyAuthController
};