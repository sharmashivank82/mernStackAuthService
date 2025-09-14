const express = require("express");
const router = express.Router();

const { UserController } = require("../controller/UserController");

const { UserService } = require("../services/UserService");

const Authenticate = require("../middlewares/Authenticate");
const CanAccess = require("../middlewares/CanAccess");

const Roles = require("../constants");
const AppDataSource = require("../data-source");
const UserEntity = require("../entity/User");

const userRepository = AppDataSource.getRepository(UserEntity);

const userService = new UserService(userRepository);
const userController = new UserController(userService);

// Only Admin Can access this route you need to add Authenticate for Admin
router.post(
  "/create",
  [Authenticate, CanAccess([Roles.ADMIN])],
  (req, res, next) => userController.create(req, res, next)
);

module.exports = router;
