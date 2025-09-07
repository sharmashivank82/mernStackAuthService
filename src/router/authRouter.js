const express = require("express");
const router = express.Router();

const registerValidator = require("../validator/register-validator");
const { AuthController } = require("../controller/AuthController");
const { UserService } = require("../services/UserService");
const { TokenService } = require("../services/TokenService");

const AppDataSource = require("../data-source");
const UserEntity = require("../entity/User");

const userRepository = AppDataSource.getRepository(UserEntity);

const userService = new UserService(userRepository);
const tokenService = new TokenService(userRepository);

const authController = new AuthController(userService, tokenService);

router.post("/register", registerValidator, (req, res, next) =>
  authController.addRegister(req, res, next)
);

module.exports = router;
