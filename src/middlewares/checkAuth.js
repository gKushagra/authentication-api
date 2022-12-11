const config = require('../config');
const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization && authorization.split(" ")[0] === "Bearer") {
        const token = authorization.split(" ")[1];
        const decoded = jwt.verify(token, config.tokenSecret);
        req.email = decoded.email;
        next();
    } else {
        return res.status(401).json({});
    }
};

module.exports = checkAuth;