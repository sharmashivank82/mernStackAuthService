class AuthController {
  userService;

  constructor(userServices) {
    this.userService = userServices;
  }

  async addRegister(req, res, next) {
    try {
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
