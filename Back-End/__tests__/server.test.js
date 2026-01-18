const request = require("supertest");
const app = require("../app");

describe("Server basics", () => {
    test("GET /health returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true });
    });

    test("Unknown route returns 404 JSON", async () => {
    const res = await request(app).get("/does-not-exist");
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Route not found");
    });
});