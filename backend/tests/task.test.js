const request = require("supertest");
const app = require("../server");

describe("Task API", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });
    token = res.body.token;
  });

  it("should create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Task", dueDate: "2025-12-31" });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Task");
  });
});