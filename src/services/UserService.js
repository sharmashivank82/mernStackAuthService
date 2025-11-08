const createHttpError = require("http-errors");
const Roles = require("../constants");
const bcrypt = require("bcrypt");
const Tenant = require("../entity/Tenant");
const { Brackets } = require("typeorm");

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

  async findByIdAndUpdate(id, updatedData) {
    const user = await this.userRepository.update(id, {
      ...updatedData,
    });
    return user;
  }

  async findAllUsers({ currentPage, perPage, q, role }) {
    const queryBuilder = await this.userRepository.createQueryBuilder("user");

    if (q) {
      const searchTerm = `%${q}%`;
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where("CONCAT(user.firstName, ' ', user.lastName) ILIKE :q", {
            q: searchTerm,
          }).orWhere("user.email ILIKE :q", { q: searchTerm });
        })
      );
    }

    if (role) {
      queryBuilder.andWhere("user.role = :role", {
        role: role,
      });
    }

    const result = await queryBuilder
      .leftJoinAndSelect("user.tenant", "tenant")
      .skip((currentPage - 1) * perPage)
      .take(perPage)
      .orderBy("user.id", "DESC")
      .getManyAndCount();

    console.log({ query: queryBuilder.getSql() });

    return result;
  }
}

module.exports = { UserService };
