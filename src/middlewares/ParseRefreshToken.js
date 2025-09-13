const { expressjwt } = require("express-jwt");
const config = require("../config");

// for refresh token we used the HS 256 Algo
module.exports = expressjwt({
  secret: config.REFRESH_TOKEN_SECRET,
  algorithms: ["HS256"],
  getToken(req) {
    const { refreshToken } = req.cookies;
    return refreshToken;
  },
});
