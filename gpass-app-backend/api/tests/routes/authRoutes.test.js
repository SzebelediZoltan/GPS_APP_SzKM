const request = require("supertest");
const app = require("../../../app");


describe("/api/auth", () => 
{
    describe("POST /login", () => 
    {
        test("should login user and return token", async () => 
        {
            const res = await request(app).post("/api/auth/login")
            .send({
                userID: 1,
                password: "jelszo123"
            });

            expect(res.body).toBeDefined();
        });
    });

    describe("GET /status", () => 
    {
        test("should return user status when logged in", async () => 
        {
            const res = await request(app).get("/api/auth/status");

            expect(res.status).toBe(200);
        });
    });

    describe("DELETE /logout", () => 
    {
        test("should logout user and clear cookie", async () => 
        {
            const res = await request(app).delete("/api/auth/logout");

            expect(res.status).toBe(200);
        });
    });
});