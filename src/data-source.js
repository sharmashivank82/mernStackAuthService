const { DataSource } = require("typeorm");
const config = require("./config/index");
console.log({ config });

const AppDataSource = new DataSource({
  type: "postgres",
  host: config.DB_HOST,
  port: Number(config.DB_PORT),
  username: config.DB_USERNAME,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  synchronize: config.NODE_ENV === "dev" || config.NODE_ENV === "test",
  logging: false,
  entities: [require("./entity/User")],
  migrations: [],
  subscribers: [],
});

module.exports = AppDataSource;
