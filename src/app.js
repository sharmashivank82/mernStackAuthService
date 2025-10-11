const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const AuthRouter = require("./router/authRouter");
const TenantsRouter = require("./router/tenantRouter");
const UserRouter = require("./router/userRouter");

// app.use(express.static("public")); // by default server doesn't allow .files they consider those files are hidden
app.use(express.static("public", { dotfiles: "allow" }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    // todo: move to env file
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.get("/", async (req, res) => {
  res.send("Welcome to the Auth Service");
});

app.use("/auth", AuthRouter);
app.use("/tenants", TenantsRouter);
app.use("/user", UserRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
  //   logger.error(err.message);
  const statusCode = err.statusCode || err.status || 500;
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
