const request = require("supertest");
const app = require("../app");

describe("Auth", () => {
    test("Protected route without token returns 401", async () => {
    const res = await request(app).get("/employees/getall");
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", true);
    });

    test("Login returns token with valid credentials", async () => {
    // Use real login details from the DB seed
    const username = process.env.ADMIN1_USER;
    const password = process.env.ADMIN_PASSWORD;

    const res = await request(app)
        .post("/auth")
        .send({ username, password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    });
});