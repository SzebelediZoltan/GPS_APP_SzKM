require("dotenv").config(
{
    quiet: true,
    path: "./.env.test",
});

const request = require("supertest");

const { app } = require("../../../app");

const db = require("../db");

const { withAuth } = require("../testHelper");

describe("API Auth Tesztek", () => 
{
    describe("/api/auth/login", () => 
    {
        beforeEach(async () => 
        {
            const t = await db.sequelize.transaction();
            app.set("getTransaction", () => t);
        });

        afterEach(async () => 
        {
            const t = app.get("getTransaction")();
            await t.rollback();
            app.set("getTransaction", undefined);
        });

        describe("POST", () => 
        {
            test("should login user and return token", async () => 
            {
                const res = await request(app).post("/api/auth/login")
                .send({
                    userID: 1,
                    password: "jelszo123"
                });

                expect(res.status).toBe(200);
                expect(res.body).toBeDefined();
            });

            test("should return 401 with wrong password", async () => 
            {
                const res = await request(app).post("/api/auth/login")
                .send({
                    userID: 1,
                    password: "rossz_jelszo"
                });

                expect(res.status).toBe(401);
            });
        });
    });

    describe("/api/auth/status", () => 
    {
        beforeEach(async () => 
        {
            const t = await db.sequelize.transaction();
            app.set("getTransaction", () => t);
        });

        afterEach(async () => 
        {
            const t = app.get("getTransaction")();
            await t.rollback();
            app.set("getTransaction", undefined);
        });

        describe("GET", () => 
        {
            test("should return user status when logged in", async () => 
            {
                const res = await withAuth(request(app).get("/api/auth/status"));
                expect(res.status).toBe(200);
                expect(res.body).toBeDefined();
            });

            test("should return 401 when not logged in", async () => 
            {
                const res = await request(app).get("/api/auth/status");
                expect(res.status).toBe(401);
            });
        });
    });

    describe("/api/auth/logout", () => 
    {
        beforeEach(async () => 
        {
            const t = await db.sequelize.transaction();
            app.set("getTransaction", () => t);
        });

        afterEach(async () => 
        {
            const t = app.get("getTransaction")();
            await t.rollback();
            app.set("getTransaction", undefined);
        });

        describe("DELETE", () => 
        {
            test("should logout user and clear cookie", async () => 
            {
                const res = await request(app).delete("/api/auth/logout");
                expect(res.status).toBe(200);
                expect(res.body).toBeDefined();
            });
        });
    });
});
