const bcrypt = require("bcrypt");

class CredentialService {
  async comparePassword(userPassword, passwordHash) {
    // return true or false
    return await bcrypt.compare(userPassword, passwordHash);
  }
}

module.exports = { CredentialService };
