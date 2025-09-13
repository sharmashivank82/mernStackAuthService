const app = require("../../src/app.js");
const request = require("supertest");
const { createJWKSMock } = require("mock-jwks");

const UserEntity = require("../../src/entity/User.js");
const RefreshTokenEntity = require("../../src/entity/RefreshToken.js");
const TenantEntity = require("../../src/entity/Tenant.js");

const AppDataSource = require("../../src/data-source.js");

describe("Post /tenants", () => {
  let dataSource;
  let tenantRepo;
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

  describe("it given all field", () => {
    it("should return 201 status code and store in DB also", async () => {
      // if This variable initialize outside the it block then they get error
      tenantRepo = dataSource.getRepository(TenantEntity);

      const tenantData = {
        name: "tenant name",
        address: "tenant address",
      };

      const response = await request(app)
        .post("/tenants/create")
        .send(tenantData);

      const tenantsRecord = await tenantRepo.find();

      expect(response.statusCode).toBe(201);
      expect(tenantsRecord).toHaveLength(1);
      expect(tenantsRecord[0].name).toBe(tenantData.name);
    });
  });
});
