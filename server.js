const app = require("./src/app.js");
const Config = require("./src/config");
const AppDataSource = require("./src/data-source.js");
require("reflect-metadata");

const startServer = async () => {
  const PORT = Config.PORT;
  try {
    await AppDataSource.initialize();
    console.log("Database is connected successfully...");

    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    if (err instanceof Error) {
      //   logger.error(err.message);
      setTimeout(() => {
        process.exit(1);
      }, 1500);
    }
  }
};

startServer();
