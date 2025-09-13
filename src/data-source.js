const { DataSource } = require("typeorm");
const config = require("./config/index");

const AppDataSource = new DataSource({
  type: "postgres",
  host: config.DB_HOST,
  port: Number(config.DB_PORT),
  username: config.DB_USERNAME,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  synchronize: false,
  logging: false,
  // require("./entity/*.js") same like a migration file
  entities: [
    require("./entity/User"),
    require("./entity/RefreshToken"),
    require("./entity/Tenant"),
  ],
  migrations: [__dirname + "/migration/*.js"],
  subscribers: [],
});

module.exports = AppDataSource;
