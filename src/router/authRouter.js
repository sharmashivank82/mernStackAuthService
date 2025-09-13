const express = require("express");
const router = express.Router();

const registerValidator = require("../validator/register-validator");
const loginValidator = require("../validator/login-validator");

const { AuthController } = require("../controller/AuthController");
const { UserService } = require("../services/UserService");
const { TokenService } = require("../services/TokenService");
const { CredentialService } = require("../services/CredentialService");

const AppDataSource = require("../data-source");
const UserEntity = require("../entity/User");
const TokenEntity = require("../entity/RefreshToken");

const Authenticate = require("../middlewares/Authenticate");
const ValidateRefreshToken = require("../middlewares/ValidateRefreshToken");
const ParseRefreshToken = require("../middlewares/ParseRefreshToken");

const userRepository = AppDataSource.getRepository(UserEntity);
const tokenRepository = AppDataSource.getRepository(TokenEntity);

const userService = new UserService(userRepository);
const tokenService = new TokenService(tokenRepository);
const credentialService = new CredentialService();

const authController = new AuthController(
  userService,
  tokenService,
  credentialService
);

router.post("/register", registerValidator, (req, res, next) =>
  authController.addRegister(req, res, next)
);

router.post("/login", loginValidator, (req, res, next) =>
  authController.login(req, res, next)
);

router.get("/self", Authenticate, (req, res, next) =>
  authController.self(req, res, next)
);

router.post("/refresh", ValidateRefreshToken, (req, res, next) =>
  authController.refresh(req, res, next)
);

router.post("/logout", [Authenticate, ParseRefreshToken], (req, res, next) =>
  authController.logout(req, res, next)
);

module.exports = router;
