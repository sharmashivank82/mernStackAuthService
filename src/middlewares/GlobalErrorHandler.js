const uuid = require("uuid");

const globalErrorHandler = (err, req, res, next) => {
  const errorId = uuid.v4();
  const statusCode = err.status || 500;

  const isProduction = process.env.NODE_ENV === "production";
  const message = isProduction ? "Internal server error" : err.message;

  // save the original message to the logger
  // logger.error(err.message, {
  // id: errorId,
  // error: err?.stack,
  // path: req.path,
  // method: req.method,
  // statusCode
  // })

  res.status(statusCode).json({
    error: [
      {
        ref: errorId,
        type: err.name,
        msg: message,
        path: req.path,
        method: req.method,
        location: "server",
        stack: isProduction ? null : err.stack,
      },
    ],
  });
};

module.exports = globalErrorHandler;
