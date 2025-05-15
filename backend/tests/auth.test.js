const request = require("supertest");
const app = require("../server");

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "testuser", email: "test@example.com", password: "password123" });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered");
  });

  it("should login a user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});