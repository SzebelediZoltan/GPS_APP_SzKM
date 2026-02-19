require("dotenv").config(
{
    quiet: true,
    path: "./.env.test",
});

const request = require("supertest");

const { app } = require("../../../app");

const db = require("../db");


describe("API Trip Point Tesztek", () => 
{
    describe("/api/trip-points", () => 
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

        const tripPoints = 
        [
            {
                trip_id: 1,
                lat: 47.5,
                lng: 19.0,
            },
            {
                trip_id: 1,
                lat: 47.6,
                lng: 19.1,
            },
        ];

        describe("GET", () => 
        {
            test("should return all trip points", async () => 
            {
                const res = await request(app).get("/api/trip-points");

                expect(res.status).toBe(200);

                expect(res.body).toBeDefined();
                
                expect(Array.isArray(res.body)).toBe(true);
            });
        });

        describe("POST", () => 
        {
            test("should create new trip point", async () => 
            {
                const res = await request(app).post("/api/trip-points")
                .send({ 
                    trip_id: 1,
                    lat: 47.5,
                    lng: 19.0,
                });

                expect(res.status).toBe(201);

                expect(res.body.trip_id).toEqual(1);
                expect(res.body.lat).toEqual(47.5);
                expect(res.body.lng).toEqual(19.0);
            });
        });
    });

    describe("/api/trip-points/by-trip/:tripId", () => 
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
            test("should return trip points for specific trip", async () => 
            {
                const res = await request(app).get("/api/trip-points/by-trip/1");

                expect(res.status).toBe(200);

                expect(Array.isArray(res.body)).toBe(true);
            });
        });
    });

    describe("/api/trip-points/:pointID", () => 
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
            test("should return trip point with the ID: 1", async () => 
            {
                const res = await request(app).get("/api/trip-points/1");

                expect(res.status).toBe(200);

                expect(res.body).toBeDefined();
            });
        });

        describe("PUT", () => 
        {
            test("should update trip point and return with updated data", async () => 
            {
                const res = await request(app).put("/api/trip-points/1")
                .send({ lat: 47.6, lng: 19.1, recorded_at: new Date() });

                expect(res.status).toBe(200);

                expect(res.body.lat).toEqual(47.6);
                expect(res.body.lng).toEqual(19.1);
            });
        });

        describe("DELETE", () => 
        {
            test("should delete trip point and return result", async () => 
            {
                const res = await request(app).delete("/api/trip-points/1")
                .set("Accept", "application/json");

                expect(res.status).toBe(200);

                expect(res.body).toBeDefined();
            });
        });
    });
});
