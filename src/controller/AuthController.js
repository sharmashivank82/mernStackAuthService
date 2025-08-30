const { validationResult } = require("express-validator");

class AuthController {
  userService;

  constructor(userServices) {
    this.userService = userServices;
  }

  async addRegister(req, res, next) {
    try {
      // validation
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }

      const { firstName, lastName, email, password } = req.body;
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
      });
      res.status(201).json({ user });
    } catch (err) {
      next(err);
      return;
    }
  }
}

module.exports = { AuthController };
