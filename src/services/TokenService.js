const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const createHttpError = require("http-errors");
const { REFRESH_TOKEN_SECRET } = require("../config");

class TokenService {
  userRepository;
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  generateAccessToken(payload) {
    let privateKey;
    try {
      // return the buffer
      privateKey = fs.readFileSync(
        path.join(__dirname, `../../certs/private.pem`)
      );
    } catch (err) {
      const error = createHttpError(500, "Error while reading the private key");
      throw error;
    }

    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "1h",
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
}

module.exports = { TokenService };
