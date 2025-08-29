const express = require("express");
const { AuthController } = require("../controller/AuthController");
const router = express.Router();

const authController = new AuthController();

router.get("/register", (req, res) => authController.addRegister(req, res));

module.exports = router;
