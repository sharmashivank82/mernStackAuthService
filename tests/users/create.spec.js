const app = require("../../src/app.js");
const request = require("supertest");
const { createJWKSMock } = require("mock-jwks");

const UserEntity = require("../../src/entity/User.js");

const AppDataSource = require("../../src/data-source.js");
const Roles = require("../../src/constants/index.js");

describe("Post /users", () => {
  let dataSource;
  let userRepo;
  let jwks;

  beforeAll(async () => {
    jwks = createJWKSMock("http://localhost:5555");

    dataSource = await AppDataSource.initialize();
    userRepo = AppDataSource.getRepository(UserEntity);
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

  describe.skip("it given all field of User", () => {
    it("should persist the user in DB", async () => {
      const accessToken = jwks.token({ sub: `1`, role: Roles.ADMIN });

      const userData = {
        firstName: "shivank",
        lastName: "sharma",
        email: "shivank@yopmail.com",
        password: "password",
        tenantId: 1,
      };

      await request(app)
        .post("/user/create")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send(userData);

      const users = await userRepo.find();

      expect(users).toHaveLength(1);
      expect(users[0].role).toBe(Roles.MANAGER);
      expect(users[0].email).toBe(userData.email);
    });

    it("should return 403 if non admin tries to create a user", () => {});
  });
});
