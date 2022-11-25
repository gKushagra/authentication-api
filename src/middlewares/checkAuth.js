const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
    const {
        headers: { authorization },
    } = req;

    if (authorization && authorization.split(" ")[0] === "Bearer") {
        jwt.decode(authorization.split(" ")[1], (err, decoded) => {
            if (err) {
                return res.status(500).json({});
            }
            req._id = decoded.id;
            next();
        });
    } else {
        return res.status(401).json({});
    }
};

module.exports = checkAuth;