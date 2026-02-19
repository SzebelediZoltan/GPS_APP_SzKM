require("dotenv").config(
{
    quiet: true,
    path: "./.env.test",
});

const request = require("supertest");

const { app } = require("../../../app");

const db = require("../db");


describe("API User Tesztek", () => 
{
    describe("/api/users", () => 
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

        const users = 
        [
            {
                username: "user1",
                password: "password123",
                email: "user1@example.com",
            },
            {
                username: "user2",
                password: "password456",
                email: "user2@example.com",
            },
        ];

        describe("GET", () => 
        {
            test("should return all users", async () => 
            {
                const res = await request(app).get("/api/users");

                expect(res.status).toBe(200);

                expect(res.body).toBeDefined();
                
                expect(Array.isArray(res.body)).toBe(true);
            });
        });

        describe("POST", () => 
        {
            test("should create new user", async () => 
            {
                const res = await request(app).post("/api/users")
                .send({ 
                    username: "Kiss Dominik",
                    password: "jelszo123",
                    email: "kiss.dominik@ckik.hu",
                });

                expect(res.status).toBe(201);

                expect(res.body.username).toEqual("Kiss Dominik");
                expect(res.body.email).toEqual("kiss.dominik@ckik.hu");
            });
        });
    });

    describe("/api/users/search", () => 
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
            test("should return users matching search query", async () => 
            {
                const res = await request(app).get("/api/users/search?query=Osama");

                expect(res.status).toBe(200);

                expect(Array.isArray(res.body)).toBe(true);
            });
        });
    });

    describe("/api/users/:userID", () => 
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
            test("should return user with the ID: 1", async () => 
            {
                const res = await request(app).get("/api/users/1");

                expect(res.status).toBe(200);

                expect(res.body).toBeDefined();
            });
        });

        describe("PUT", () => 
        {
            test("should update user email", async () => 
            {
                const res = await request(app).put("/api/users/1")
                .send({ email: "kiss.dominik@ckik.hu" });

                expect(res.status).toBe(200);

                expect(res.body.email).toEqual("kiss.dominik@ckik.hu");
            });
        });

        describe("DELETE", () => 
        {
            test("should delete user", async () => 
            {
                const res = await request(app).delete("/api/users/1")
                .set("Accept", "application/json");

                expect(res.status).toBe(200);

                expect(res.body).toBeDefined();
            });
        });
    });
});