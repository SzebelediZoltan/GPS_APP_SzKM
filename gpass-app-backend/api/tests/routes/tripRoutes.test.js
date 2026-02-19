require("dotenv").config(
{
    quiet: true,
    path: "./.env.test",
});

const request = require("supertest");

const { app } = require("../../../app");

const db = require("../db");


describe("API Trip Tesztek", () => 
{
    describe("/api/trips", () => 
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

        const trips = 
        [
            {
                user_id: 1,
                trip_number: 1,
            },
            {
                user_id: 2,
                trip_number: 1,
            },
        ];

        describe("GET", () => 
        {
            test("should return all trips", async () => 
            {
                const res = await request(app).get("/api/trips");

                expect(res.status).toBe(200);

                expect(res.body).toBeDefined();
                
                expect(Array.isArray(res.body)).toBe(true);
            });
        });

        describe("POST", () => 
        {
            test("should create new trip", async () => 
            {
                const res = await request(app).post("/api/trips")
                .send({ 
                    user_id: 1,
                    trip_number: 1,
                });

                expect(res.status).toBe(201);

                expect(res.body.user_id).toEqual(1);
                expect(res.body.trip_number).toEqual(1);
            });
        });
    });

    describe("/api/trips/by-user/:userId", () => 
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
            test("should return user's trips", async () => 
            {
                const res = await request(app).get("/api/trips/by-user/1");

                expect(res.status).toBe(200);

                expect(Array.isArray(res.body)).toBe(true);
            });
        });
    });

    describe("/api/trips/by-user/:userId/number/:tripNumber", () => 
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
            test("should return trip with the userId: 1 and tripNumber: 1", async () => 
            {
                const res = await request(app).get("/api/trips/by-user/1/number/1");

                expect(res.status).toBe(200);

                expect(res.body).toBeDefined();
            });
        });
    });

    describe("/api/trips/:tripID", () => 
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
            test("should return trip with the ID: 1", async () => 
            {
                const res = await request(app).get("/api/trips/1");

                expect(res.status).toBe(200);

                expect(res.body).toBeDefined();
            });
        });

        describe("PUT", () => 
        {
            test("should update trip and return with updated data", async () => 
            {
                const res = await request(app).put("/api/trips/1")
                .send({ user_id: 1, trip_number: 2 });

                expect(res.status).toBe(200);

                expect(res.body.trip_number).toEqual(2);
            });
        });

        describe("DELETE", () => 
        {
            test("should delete trip and return result", async () => 
            {
                const res = await request(app).delete("/api/trips/1")
                .set("Accept", "application/json");

                expect(res.status).toBe(200);

                expect(res.body).toBeDefined();
            });
        });
    });
});
