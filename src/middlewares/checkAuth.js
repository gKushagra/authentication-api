const jwt = require("jsonwebtoken");

const authorize = (req, res, next) => {
    const {
        headers: { authorization },
    } = req;

    if (authorization && authorization.split(" ")[0] === "Bearer") {
        jwt.decode(authorization.split(" ")[1], (err, decoded) => {
            if (err) res.sendStatus(401);
            req._id = decoded.id;
            next();
        });
    }

    res.sendStatus(401);
};

module.exports = authorize;
