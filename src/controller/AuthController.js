const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const fs = require("fs");
const path = require("path");
const createHttpError = require("http-errors");
const { REFRESH_TOKEN_SECRET } = require("../config");

const AppDataSource = require("../../src/data-source.js");
const RefreshTokenEntity = require("../../src/entity/RefreshToken.js");

class AuthController {
  userService;

  constructor(userServices) {
    this.userService = userServices;
  }

  async addRegister(req, res, next) {
    try {
      // validation
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }

      const { firstName, lastName, email, password } = req.body;
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
      });

      let privateKey;
      try {
        // return the buffer
        privateKey = fs.readFileSync(
          path.join(__dirname, `../../certs/private.pem`)
        );
      } catch (err) {
        const error = createHttpError(
          500,
          "Error while reading the private key"
        );
        next(error);
        return;
      }

      const payload = {
        sub: `${user.id}`,
        role: user.role,
      };

      // use RS256 Algorithm for public/private key
      const accessToken = jwt.sign(payload, privateKey, {
        algorithm: "RS256",
        expiresIn: "1h",
        issuer: "auth-service", // who issue this token
      });

      // persist the token
      const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365; // 1 year
      const refreshTokenRepo = AppDataSource.getRepository(RefreshTokenEntity);
      const newRefreshToken = await refreshTokenRepo.save({
        userId: user,
        expireAt: new Date(Date.now() + MS_IN_YEAR),
      });

      // const accessToken = "12345";
      const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "1y",
        issuer: "auth-service",
        jwtid: `${newRefreshToken.id}`, // this variable expect string
      });

      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, // 60
        httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 day
        httpOnly: true,
      });

      res.status(201).json({ user });
    } catch (err) {
      next(err);
      return;
    }
  }
}

module.exports = { AuthController };
