const createHttpError = require("http-errors");
const Roles = require("../constants");

class UserService {
  userRepository;
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async create({ firstName, lastName, email, password }) {
    try {
      return await this.userRepository.save({
        firstName,
        lastName,
        email,
        password,
        role: Roles.CUSTOMER,
      });
    } catch (err) {
      const error = createHttpError(
        500,
        "Failed to store data in the database"
      );
      throw error;
    }
  }
}

module.exports = { UserService };
