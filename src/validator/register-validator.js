const { body } = require("express-validator");

const validator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Not a valid email")
    .trim(),
];

module.exports = validator;
