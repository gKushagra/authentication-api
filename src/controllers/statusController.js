const logger = require('../logger');
const getApiStatusCommand = require('../commands/getApiStatusCommand');
const { unwrapResult } = require('../helperMethods');
const date = new Date();

const getApiStatusController = async (req, res) => {
    logger.info(`${date.getUTCDate()}:: getApiStatusController called`);
    const result = unwrapResult(await getApiStatusCommand());
    logger.info(`${date.getUTCDate()}:: getApiStatusController done`);
    res.status(result.code).json(result.data);
}

module.exports = {
    getApiStatusController,
}