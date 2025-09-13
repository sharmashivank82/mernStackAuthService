const { expressjwt } = require("express-jwt");
const config = require("../config");
const AppDataSource = require("../data-source");
const RefreshToken = require("../entity/RefreshToken");

// for refresh token we used the HS 256 Algo
module.exports = expressjwt({
  secret: config.REFRESH_TOKEN_SECRET,
  algorithms: ["HS256"],
  getToken(req) {
    const { refreshToken } = req.cookies;
    return refreshToken;
  },
  // this predefined function in express jwt we have to return true or false
  async isRevoked(req, tokenDetails) {
    try {
      const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);
      const refreshToken = await refreshTokenRepo.findOne({
        where: {
          id: parseInt(tokenDetails?.payload?.id),
          userId: { id: parseInt(tokenDetails?.payload?.sub) },
        },
      });
      return refreshToken === null; // isRevoke() tell to middle ware that token is revoked from DB or not
      // if I return true means token is remove from DB then throw error
      // If token is present is DB then token === null (false)
    } catch (err) {
      console.log("Error while getting the refreshToken");
    }
    return true;
  },
});
