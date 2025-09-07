const express = require("express");
const router = express.Router();

const registerValidator = require("../validator/register-validator");
const { AuthController } = require("../controller/AuthController");
const { UserService } = require("../services/UserService");
const { TokenService } = require("../services/TokenService");

const AppDataSource = require("../data-source");
const UserEntity = require("../entity/User");
const TokenEntity = require("../entity/RefreshToken");

const userRepository = AppDataSource.getRepository(UserEntity);
const tokenRepository = AppDataSource.getRepository(TokenEntity);

const userService = new UserService(userRepository);
const tokenService = new TokenService(tokenRepository);

const authController = new AuthController(userService, tokenService);

router.post("/register", registerValidator, (req, res, next) =>
  authController.addRegister(req, res, next)
);

module.exports = router;
