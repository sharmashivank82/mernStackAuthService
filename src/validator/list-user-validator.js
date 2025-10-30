const { query } = require("express-validator");

const listUserValidator = [
  query("q")
    .optional()
    .trim()
    .customSanitizer((value) => {
      return value ? value : "";
    }),
  query("role")
    .optional()
    .customSanitizer((value) => {
      return value ? value : "";
    }),
  query("currentPage")
    .notEmpty()
    .escape()
    .customSanitizer((value) => {
      const parsedValue = Number(value);
      return Number.isNaN(parsedValue) ? 1 : parsedValue;
    }),
  query("perPage")
    .notEmpty()
    .escape()
    .customSanitizer((value) => {
      const parsedValue = Number(value);
      return Number.isNaN(parsedValue) ? 2 : parsedValue;
    }),
  ,
];

module.exports = listUserValidator;
