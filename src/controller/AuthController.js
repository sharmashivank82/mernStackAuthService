const { validationResult } = require("express-validator");
const createHttpError = require("http-errors");

class AuthController {
  userService;
  tokenService;
  credentialService;

  constructor(userServices, tokenService, credentialService) {
    this.userService = userServices;
    this.tokenService = tokenService;
    this.credentialService = credentialService;
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

  async login(req, res, next) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }

      const { email, password } = req.body;

      // check email and then compare password then generate token and add token in cookies and return response

      const user = await this.userService.findByEmail(email);
      if (!user) {
        const error = createHttpError(400, "Email or password doesn't match");
        next(error);
        return;
      }

      const isPasswordMatch = await this.credentialService.comparePassword(
        password,
        user.password
      );

      if (!isPasswordMatch) {
        const error = createHttpError(400, "Email or password doesn't match");
        next(error);
        return;
      }

      // Now password match create access/refresh token and store them in cookie and give 200 response
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

      res.status(200).json({ id: user.id });
    } catch (err) {
      next(err);
      return;
    }
  }

  async self(req, res, next) {
    try {
      const user = await this.userService.findById(req.auth.sub);
      return res.status(200).json({ ...user, password: undefined });
    } catch (err) {
      next(err);
      return;
    }
  }

  async refresh(req, res, next) {
    try {
      // Now password match create access/refresh token and store them in cookie and give 200 response
      const payload = {
        sub: req.auth.sub,
        role: req.auth.role,
      };

      // use RS256 Algorithm for public/private key
      const accessToken = this.tokenService.generateAccessToken(payload);

      const user = await this.userService.findById(req.auth.sub);
      if (!user) {
        const error = createHttpError(
          400,
          "User with the token could not find"
        );
        next(error);
        return;
      }

      // persist the token
      const newRefreshToken = await this.tokenService.persistToken(user);

      // Delete old refresh token
      await this.tokenService.deleteRefreshToken(parseInt(req.auth.id));

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

      res.status(200).json({});
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      // delete the refresh token
      await this.tokenService.deleteRefreshToken(parseInt(req.auth.id));
      // clear the cookies
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      res.json({});
    } catch (err) {
      next(err);
    }
  }
}

module.exports = { AuthController };
