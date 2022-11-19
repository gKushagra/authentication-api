const config = require('../config');
const dbDriver = require('mongoose');

const ClientConfig = dbDriver.model("ClientConfig");

const validateKey = async (req, res, next) => {
    const {
        headers: { authorization },
    } = req;

    if (authorization && authorization.split(" ")[0] === "Key") {

        dbDriver.connect(config.dbConnectionString, config.dbOptions)
            .then(() => console.log('db connected'));

        try {
            var client = await ClientConfig.findOne({ _id: authorization.split(" ")[1] });
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }

        req.client = {
            _id: client._id,
            email: client.email,
            env: {
                db: {
                    host: client.db_host,
                    port: client.db_port,
                    user: client.db_user,
                    pass: client.db_pwd,
                    db: client.db_database,
                    authdb: client.db_auth
                }
            }
        }

        req.isClient = true;

        dbDriver.disconnect().then(() => console.log('db disconnected'));

        next();
    }

    res.sendStatus(401);
}

module.exports = validateKey;