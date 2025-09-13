const Roles = require("../../src/constants/index.js");
const app = require("../../src/app.js");
const request = require("supertest");
const { createJWKSMock } = require("mock-jwks");

const UserEntity = require("../../src/entity/User.js");
const RefreshTokenEntity = require("../../src/entity/RefreshToken.js");

const AppDataSource = require("../../src/data-source.js");

const isJwt = (token) => {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  // each jwt parts is a base64 string
  try {
    parts.forEach((part) => {
      // Buffer is a global object
      // we try to convert base64 string to utf-8 if it's done then it means it's a base 64 err
      Buffer.from(part, "base64").toString("utf-8");
    });
    return true;
  } catch (err) {
    return false;
  }
};

describe("App", () => {
  let dataSource;
  let userRepo;
  let jwks;

  beforeAll(async () => {
    jwks = createJWKSMock("http://localhost:5555");

    dataSource = await AppDataSource.initialize();
    // ✅ use entity object, not "User"
  });

  beforeEach(async () => {
    jwks.start();
    await dataSource.dropDatabase();
    await dataSource.synchronize();
    // await truncateTables(dataSource)
  });

  afterEach(() => {
    jwks.stop();
  });

  afterAll(async () => {
    await dataSource?.close();
  });

  it.skip("should persist the user in the database", async () => {
    const userData = {
      firstName: "shivank",
      lastName: "sharma",
      email: "ss@yopmail.com",
      password: "password",
    };

    // hit the API
    await request(app).post("/auth/register").send(userData);

    // verify user saved in DB
    userRepo = dataSource.getRepository(UserEntity);
    const users = await userRepo.find();
    expect(users).toHaveLength(1);
  });

  it.skip("should assign role to customer", async () => {
    const userData = {
      firstName: "shivank",
      lastName: "sharma",
      email: "ss@yopmail.com",
      password: "password",
    };

    // hit the API
    await request(app).post("/auth/register").send(userData);

    userRepo = dataSource.getRepository(UserEntity);
    const users = await userRepo.find();
    expect(users[0]).toHaveProperty("role");
    expect(users[0].role).toBe(Roles.CUSTOMER);
  });

  it.skip("Should store the hash password", async () => {
    const userData = {
      firstName: "shivank",
      lastName: "sharma",
      email: "ss@yopmail.com",
      password: "password",
    };

    // hit the API
    await request(app).post("/auth/register").send(userData);

    userRepo = dataSource.getRepository(UserEntity);
    const users = await userRepo.find();
    expect(users[0].password).not.toBe(userData.password);
  });

  it.skip("should return 400 status code if email is already registered", async () => {
    const userData = {
      firstName: "shivank",
      lastName: "sharma",
      email: "ss@yopmail.com",
      password: "password",
    };

    // Directly save the data in the database without the execute of route
    userRepo = dataSource.getRepository(UserEntity);
    await userRepo.save({ ...userData, role: Roles.CUSTOMER });

    // hit the API
    const response = await request(app).post("/auth/register").send(userData);

    const user = await userRepo.find();

    expect(response.statusCode).toBe(400);
    expect(user).toHaveLength(1);
  });

  describe.skip("fields are missing", () => {
    it("should return 400 status code if email field is missing", async () => {
      const userData = {
        firstName: "shivank",
        lastName: "sharma",
        email: "",
        password: "password",
      };

      const response = await request(app).post("/auth/register").send(userData);
      console.log(response.body);
      expect(response.statusCode).toBe(400);

      userRepo = dataSource.getRepository(UserEntity);
      const users = await userRepo.find();
      expect(users).toHaveLength(0);
    });
  });

  describe.skip("Fields are not in proper format", () => {
    it("should trim the email field", async () => {
      const userData = {
        firstName: "shivank",
        lastName: "sharma",
        email: "shivank@yopmail.com",
        password: "password",
      };

      await request(app).post("/auth/register").send(userData);

      userRepo = dataSource.getRepository(UserEntity);
      const users = await userRepo.find();
      const user = users[0];
      expect(user.email).toBe("shivank@yopmail.com");
    });
  });

  describe.skip("json web token test", () => {
    it("should return the access token and refresh token inside a cookie", async () => {
      const userData = {
        firstName: "shivank",
        lastName: "sharma",
        email: "shivank@yopmail.com",
        password: "password",
      };

      const response = await request(app).post("/auth/register").send(userData);

      let accessToken;
      let refreshToken;

      const cookies = response.headers["set-cookie"] || [];
      cookies.forEach((cookie) => {
        if (cookie.startsWith("accessToken=")) {
          accessToken = cookie.split(";")[0].split("=")[1];
        }

        if (cookie.startsWith("refreshToken=")) {
          refreshToken = cookie.split(";")[0].split("=")[1];
        }
      });

      expect(accessToken).not.toBeUndefined();
      expect(refreshToken).not.toBeUndefined();

      expect(isJwt(accessToken)).toBeTruthy();
      expect(isJwt(refreshToken)).toBeTruthy();
    });

    it("should store the refresh token in the database", async () => {
      const userData = {
        firstName: "shivank",
        lastName: "sharma",
        email: "shivank@yopmail.com",
        password: "password",
      };

      const response = await request(app).post("/auth/register").send(userData);

      const refreshTokenRepo = dataSource.getRepository(RefreshTokenEntity);

      // const tokens = await refreshTokenRepo
      //   .createQueryBuilder("refreshToken")
      //   .where("refreshToken.userId = :userDataId", {
      //     userDataId: response.body.user.id,
      //   })
      //   .getMany();

      const tokens = await refreshTokenRepo
        .createQueryBuilder("refreshToken")
        .leftJoin("refreshToken.userId", "userDetails") // join the relation
        .where("userDetails.id = :userDataId", {
          userDataId: response.body.user.id,
        })
        .getMany();

      // userDetails, userDataId <--- These are act like a variables only

      console.log({ tokens });

      expect(tokens).toHaveLength(1);
      // const refreshToken = await refreshTokenRepo.find();
    });
  });

  describe.skip("Get /auth/self", () => {
    it("should return 200 code", async () => {
      const accessToken = jwks.token({ sub: `1`, role: Roles.CUSTOMER });

      const response = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send();
      expect(response.statusCode).toBe(200);
    });

    it("should return user code", async () => {
      // Register user
      const userData = {
        firstName: "shivank",
        lastName: "sharma",
        email: "shivank@yopmail.com",
        password: "password",
      };

      const userRepo = dataSource.getRepository(UserEntity);
      const data = await userRepo.save({ ...userData, role: Roles.CUSTOMER });
      // Generate token
      const accessToken = jwks.token({ sub: `${data.id}`, role: data.role });

      // Add token to cookie
      const response = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken};`])
        .send();
      // Assert
      // check is user id matches with register user id
      expect(response.body.id).toBe(data.id);
      console.log({ response: response.body });
      expect(response.body).not.toHaveProperty("password");
    });
  });
});
