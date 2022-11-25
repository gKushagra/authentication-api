const { responseMessages } = require("../helperMethods");

const getApiStatusCommand = async () => {
    /** @todo check database connection status */
    /** @todo check smtp & imap connection status */
    return { status: responseMessages.ok, data: "API is running" }
}

module.exports = getApiStatusCommand;