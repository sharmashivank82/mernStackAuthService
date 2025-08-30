const Roles =  require("../../src/constants");
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
    await dataSource.dropDatabase();
    await dataSource.synchronize();
    // await truncateTables(dataSource)
  });

  afterAll(async () => {
    await dataSource?.close();
  });

  it.skip("should persist the user in the database", async () => {
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

  it.skip("should assign role to customer", async () => {
    const userData = {
      firstName: "shivank",
      lastName: "sharma",
      email: "ss@yopmail.com",
      password: "password"
    };

    // hit the API
    await request(app).post("/auth/register").send(userData);

    userRepo = dataSource.getRepository(UserEntity);
    const users = await userRepo.find();
    expect(users[0]).toHaveProperty('role')
    expect(users[0].role).toBe(Roles.CUSTOMER)

  })

  it.skip("Should store the hash password", async () => {
    const userData = {
      firstName: "shivank",
      lastName: "sharma",
      email: "ss@yopmail.com",
      password: "password"
    };

    // hit the API
    await request(app).post("/auth/register").send(userData);

    userRepo = dataSource.getRepository(UserEntity);
    const users = await userRepo.find();
    expect(users[0].password).not.toBe(userData.password);
  })

  it.skip("should return 400 status code if email is already registered", async () => {
    const userData = {
      firstName: "shivank",
      lastName: "sharma",
      email: "ss@yopmail.com",
      password: "password"
    };

    // Directly save the data in the database without the execute of route
    userRepo = dataSource.getRepository(UserEntity);
    await userRepo.save({...userData, role: Roles.CUSTOMER});
    
    // hit the API
    const response = await request(app).post("/auth/register").send(userData);

    const user = await userRepo.find()

    expect(response.statusCode).toBe(400)
    expect(user).toHaveLength(1)

  })

  describe('fields are missing', () => {
    it("should return 400 status code if email field is missing", async () => {
      const userData = {
        firstName: "shivank",
        lastName: "sharma",
        email: "",
        password: "password"
      };

      const response = await request(app).post("/auth/register").send(userData)
      console.log(response.body)
      expect(response.statusCode).toBe(400)

      userRepo = dataSource.getRepository(UserEntity);
      const users = await userRepo.find();
      expect(users).toHaveLength(0);

    })
  })

});
