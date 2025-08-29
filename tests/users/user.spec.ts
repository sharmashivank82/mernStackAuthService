const app = require("../../src/app.js");
const request = require("supertest");

const UserEntity = require('../../src/entity/User.js');
const AppDataSource = require('../../src/data-source.js')

const truncateTables = async (connection) => {
  const entities = connection.entityMetadatas;
  for (const entity of entities) {
    const repository = connection.getRepository(entity.name);
    await repository?.clear();
  }
};

describe("App", () => {
  let dataSource;
  let userRepo;

  beforeAll(async () => {
    dataSource = await AppDataSource.initialize();
     // ✅ use entity object, not "User"
  });

  beforeEach(async () => {
    await truncateTables(dataSource)
  });

  afterAll(async () => {
    await dataSource?.close();
  });

  it("should persist the user in the database", async () => {
    const userData = {
      firstName: "shivank",
      lastName: "sharma",
      email: "ss@yopmail.com",
      password: "password"
    };

    // hit the API
    await request(app).post("/auth/register").send(userData);

    // verify user saved in DB
    userRepo = dataSource.getRepository(UserEntity);
    const users = await userRepo.find();
    expect(users).toHaveLength(1)

  });
});
