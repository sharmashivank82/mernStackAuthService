const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const createHttpError = require("http-errors");

const { REFRESH_TOKEN_SECRET, PRIVATE_KEY } = require("../config");

class TokenService {
  tokenRepository;
  constructor(tokenRepository) {
    this.tokenRepository = tokenRepository;
  }

  generateAccessToken(payload) {
    let privateKey;
    try {
      // return the buffer
      privateKey = fs.readFileSync(
        path.join(__dirname, `../../certs/private.pem`)
      );
      // if (!PRIVATE_KEY) {
      //   const error = createHttpError(500, "Secret key is not set");
      //   throw error;
      // }

      // Now we take private key from env variables
      // privateKey = PRIVATE_KEY;
    } catch (err) {
      const error = createHttpError(500, "Error while reading the private key");
      throw error;
    }

    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "1m",
      issuer: "auth-service", // who issue this token
    });

    return accessToken;
  }

  generateRefreshToken(payload) {
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "1y",
      issuer: "auth-service",
      jwtid: `${payload.id}`, // this variable expect string
    });

    return refreshToken;
  }

  async persistToken(user) {
    const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365; // 1 year
    const newRefreshToken = await this.tokenRepository.save({
      userId: user,
      expireAt: new Date(Date.now() + MS_IN_YEAR),
    });
    return newRefreshToken;
  }

  async deleteRefreshToken(tokenId) {
    try {
      return await this.tokenRepository.delete({ id: tokenId });
    } catch (err) {}
  }
}

module.exports = { TokenService };
