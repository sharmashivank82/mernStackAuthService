class AuthController {
  userService;

  constructor(userServices) {
    this.userService = userServices;
  }

  async addRegister(req, res) {
    const { firstName, lastName, email, password } = req.body;
    await this.userService.create({ firstName, lastName, email, password });
    res.status(201).json();
  }
}

module.exports = { AuthController };
