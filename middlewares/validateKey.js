require('dotenv').config();
const dbDriver = require('mongoose');

const SSOUserConfig = dbDriver.model("SSOUserConfig");

const validateKey = async (req, res, next) => {
    const {
        headers: { authorization },
    } = req;

    if (authorization && authorization.split(" ")[0] === "Key") {

        dbDriver.connect(`${process.env.CENTRAL_STORE_HOST}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        }).then(() => console.log('db connected'));

        try {
            var user = await SSOUserConfig.findOne({ api_key: authorization.split(" ")[1] });
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }

        req.user = {
            email: user.email,
            db_host: user.db_host,
            db_port: user.db_port,
            db_user: user.db_user,
            db_pwd: user.db_pwd,
            db_database: user.db_database
        }

        req.externalUser = true;

        dbDriver.disconnect().then(() => console.log('db disconnected'));

        next();
    }

    res.sendStatus(401);
}

module.exports = validateKey;