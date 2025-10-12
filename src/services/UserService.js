const createHttpError = require("http-errors");
const Roles = require("../constants");
const bcrypt = require("bcrypt");
const Tenant = require("../entity/Tenant");

class UserService {
  userRepository;
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async HashPassword({ password }) {
    const saltRound = 10;
    return await bcrypt.hash(password, saltRound);
  }

  async create({ firstName, lastName, email, password, role }) {
    // Check email is registered or not before
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (user) {
      const error = createHttpError(400, "Email is already registered!");
      throw error;
    }

    // Hashed the password First
    const hashedPassword = await this.HashPassword({ password });

    try {
      return await this.userRepository.save({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role || Roles.CUSTOMER,
      });
    } catch (err) {
      const error = createHttpError(
        500,
        "Failed to store data in the database"
      );
      throw error;
    }
  }

  async findByEmail(email) {
    const user = await this.userRepository.findOne({ where: { email: email } });
    return user;
  }

  async findById(id) {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: { tenant: true },
    });
    return user;
  }

  async findAllUsers() {
    const user = await this.userRepository.find();
    return user;
  }
}

module.exports = { UserService };
