const { config } = require("dotenv");
const path = require("path");

config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });

const {
  PORT,
  NODE_ENV,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_NAME,
  DB_PASSWORD,
  REFRESH_TOKEN_SECRET,
} = process.env;

module.exports = {
  PORT,
  NODE_ENV,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_NAME,
  DB_PASSWORD,
  REFRESH_TOKEN_SECRET,
};
