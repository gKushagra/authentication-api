require("dotenv").config();
const jwt = require("express-jwt");

const getTokensFromHeaders = (req) => {
  const {
    headers: { authorization },
  } = req;

  if (authorization && authorization.split(" ")[0] === "Token") {
    return authorization.split(" ")[1];
  }

  return null;
};

const authenticate = jwt({
  secret: process.env.TOKEN_SKT,
  userProperty: "payload",
  getToken: getTokensFromHeaders,
  algorithms: ["sha1", "RS256", "HS256"],
});

module.exports = authenticate;
