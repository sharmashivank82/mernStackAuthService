const express = require("express");
const app = express();
const AuthRouter = require("./router/authRouter");

app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Welcome to the Auth Service");
});

app.use("/auth", AuthRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
  //   logger.error(err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    errors: [
      {
        type: err.name,
        message: err.message,
        path: "",
        location: "",
      },
    ],
  });
});

module.exports = app;
