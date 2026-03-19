const request = require("supertest");
const app = require("../app");

describe("Basic Test", () => {

  test("GET / should return 200", async () => {
    const res = await request(app).get("/");

//    console.log(res.statusCode); // debug

    expect(res.statusCode).toBe(200);
  });

});
