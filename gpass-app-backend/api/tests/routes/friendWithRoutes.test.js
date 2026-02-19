require("dotenv").config(
{
    quiet: true,
    path: "./.env.test",
});

const request = require("supertest");

const { app } = require("../../../app");

const db = require("../db");

describe("API FriendWith Tesztek", () => 
{
    describe("/api/friends-with", () => 
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

        const friendships = 
        [
            {
                sender_id: 1,
                receiver_id: 2,
                status: "pending",
            },
            {
                sender_id: 2,
                receiver_id: 3,
                status: "accepted",
            },
        ];

        describe("GET", () => 
        {
            test("should return all friendships", async () => 
            {
                const res = await request(app).get("/api/friends-with");

                expect(res.status).toBe(200);

                expect(res.body).toBeDefined();
                
                expect(Array.isArray(res.body)).toBe(true);
            });
        });

        describe("POST", () => 
        {
            test("should create new friendship", async () => 
            {
                const res = await request(app).post("/api/friends-with")
                .send({ 
                    sender_id: 1,
                    receiver_id: 2,
                });

                expect(res.status).toBe(201);

                expect(res.body.sender_id).toEqual(1);
                expect(res.body.receiver_id).toEqual(2);
            });
        });
    });

    describe("/api/friends-with/:id", () => 
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
            test("should return friendship with the ID: 1", async () => 
            {
                const res = await request(app).get("/api/friends-with/1");

                expect(res.status).toBe(200);

                expect(res.body).toBeDefined();
            });
        });

        describe("PUT", () => 
        {
            test("should update friendship status", async () => 
            {
                const res = await request(app).put("/api/friends-with/1")
                .send({ status: "accepted" });

                expect(res.status).toBe(200);

                expect(res.body.status).toEqual("accepted");
            });
        });

        describe("DELETE", () => 
        {
            test("should delete friendship", async () => 
            {
                const res = await request(app).delete("/api/friends-with/1")
                .set("Accept", "application/json");

                expect(res.status).toBe(200);

                expect(res.body).toBeDefined();
            });
        });
    });

    describe("/api/friends-with/pending/:userId", () => 
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
            test("should return pending friendships for user", async () => 
            {
                const res = await request(app).get("/api/friends-with/pending/1");

                expect(res.status).toBe(200);

                expect(Array.isArray(res.body)).toBe(true);
            });
        });
    });

    describe("/api/friends-with/accepted/:userId", () => 
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
            test("should return accepted friendships for user", async () => 
            {
                const res = await request(app).get("/api/friends-with/accepted/1");

                expect(res.status).toBe(200);

                expect(Array.isArray(res.body)).toBe(true);
            });
        });
    });
});
