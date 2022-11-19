const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
    levels: winston.config.npm.levels,
    format: winston.format.json(),
    defaultMeta: { service: 'email-service' },
    transports: [
        new winston.transports.File({
            filename: path.join(__dirname + '../logs/logs.json')
        })
    ]
});

module.exports = logger;