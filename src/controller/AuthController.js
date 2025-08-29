const AppDataSource = require("../data-source");
const UserEntity = require("../entity/User");

class AuthController {
  async addRegister(req, res) {
    const { firstName, lastName, email, password } = req.body;
    console.log({ body: req.body });

    const userRepository = AppDataSource.getRepository(UserEntity);
    await userRepository.save({ firstName, lastName, email, password });
    res.status(201).json();
  }
}

module.exports = { AuthController };
