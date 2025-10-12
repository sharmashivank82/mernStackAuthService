const Roles = require("../constants");

class UserController {
  userService;

  constructor(userService) {
    this.userService = userService;
  }

  async create(req, res, next) {
    try {
      const { firstName, lastName, email, password } = req.body;
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
        role: Roles.MANAGER,
      });
      res.status(200).json({ id: user.id });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const user = await this.userService.findAllUsers();
      const updatedUser = [];
      for (let i = 0; i < user.length; i++) {
        updatedUser.push({ ...user[i], password: undefined });
      }
      res.status(200).json({ users: updatedUser });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = { UserController };
