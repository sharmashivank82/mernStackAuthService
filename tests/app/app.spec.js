const app = require("../../src/app.js");
const request = require("supertest");

describe("App", () => {
  it("Should return 200 status", async () => {
    const response = await request(app).get("/").send();
    expect(response.statusCode).toBe(200);
  });
});
