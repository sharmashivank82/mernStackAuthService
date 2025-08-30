const express = require("express");
const router = express.Router();

const { AuthController } = require("../controller/AuthController");
const { UserService } = require("../services/UserService");

const AppDataSource = require("../data-source");
const UserEntity = require("../entity/User");

const userRepository = AppDataSource.getRepository(UserEntity);
const userService = new UserService(userRepository);
const authController = new AuthController(userService);

router.post("/register", (req, res) => authController.addRegister(req, res));

module.exports = router;
