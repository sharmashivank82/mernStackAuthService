const { validationResult } = require("express-validator");

class AuthController {
  userService;
  tokenService;

  constructor(userServices, tokenService) {
    this.userService = userServices;
    this.tokenService = tokenService;
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

      const payload = {
        sub: `${user.id}`,
        role: user.role,
      };

      // use RS256 Algorithm for public/private key
      const accessToken = this.tokenService.generateAccessToken(payload);

      // persist the token
      const newRefreshToken = await this.tokenService.persistToken(user);

      // Used HS256 Algo
      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: newRefreshToken.id,
      });

      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, // 60
        httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 day
        httpOnly: true,
      });

      res.status(201).json({ user });
    } catch (err) {
      next(err);
      return;
    }
  }
}

module.exports = { AuthController };
