const { DataSource } = require("typeorm")

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "test",
    password: "test",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [require("./entity/User")],
    migrations: [],
    subscribers: [],
})

module.exports = AppDataSource