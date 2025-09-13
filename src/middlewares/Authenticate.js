const { expressjwt } = require("express-jwt");
const jwksClient = require("jwks-rsa");
const { JWKS_URI } = require("../config");

module.exports = expressjwt({
  secret: jwksClient.expressJwtSecret({
    jwksUri: JWKS_URI,
    cache: true,
    rateLimit: true,
  }),
  algorithms: ["RS256"],
  getToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.split(" ")[1] !== undefined) {
      const token = authHeader.split(" ")[1];
      if (token) return token;
    }

    if (req.cookies) {
      const { accessToken } = req.cookies;
      return accessToken;
    }

    return null;
  },
});
