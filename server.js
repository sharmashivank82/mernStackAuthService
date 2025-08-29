const app = require("./src/app.js");
const Config = require("./src/config");

const startServer = () => {
  const PORT = Config.PORT;
  try {
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
