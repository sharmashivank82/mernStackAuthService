const app = require("../../src/app.js");
const request = require("supertest");

describe("App", () => {
  it("Should return 200 status", async () => {
    const response = await request(app).get("/auth/register").send();
    expect(response.statusCode).toBe(200);
  });

  // it("should persist the user in the database", async() => {
  //   const userData = {
  //     firstName: 'shivank',
  //     lastName: "sharma",
  //     email: "ss@yopmail.com",
  //     password: "secret"
  //   }

  //   await request(app).post("/auth/register").send(userData);

  // })
});
