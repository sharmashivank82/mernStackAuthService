class UserService {
  userRepository;
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async create({ firstName, lastName, email, password }) {
    await this.userRepository.save({ firstName, lastName, email, password });
  }
}

module.exports = { UserService };
