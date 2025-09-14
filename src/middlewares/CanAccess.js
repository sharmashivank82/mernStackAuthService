const createHttpError = require("http-errors");

const CanAccess = (roles = []) => {
  return (req, res, next) => {
    const roleFromToken = req.auth.role;
    if (roles.includes(roleFromToken)) next();
    else {
      const error = createHttpError(403, "You don't have enough permissions");
      next(error);
    }
  };
};

module.exports = CanAccess;
