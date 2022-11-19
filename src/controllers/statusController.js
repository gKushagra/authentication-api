const logger = require('../logger');
const getApiStatusCommand = require('../commands/getApiStatusCommand');
const date = new Date();

const getApiStatusController = async (req, res) => {
    try {
        logger.info(`${date.getUTCDate()}:: getApiStatusController called`);
        const result = await getApiStatusCommand();
        logger.info(`${date.getUTCDate()}:: getApiStatusController returning response`);
        return res.status(200).json(result);
    } catch (error) {
        logger.error(`${date.getUTCDate()}:: getApiStatusController Error: ${error}`);
        return res.sendStatus(500);
    }
}

module.exports = {
    getApiStatusController,
}