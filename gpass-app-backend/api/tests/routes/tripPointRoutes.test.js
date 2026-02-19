require("dotenv").config({ quiet: true, path: "./.env.test" });

const request = require("supertest");
const { app } = require("../../../app");
const db = require("../db");
const { withAuth } = require("../testHelper");

const mkTx = async () => { const t = await db.sequelize.transaction(); app.set("getTransaction", () => t); };
const rollback = async () => { const t = app.get("getTransaction")(); await t.rollback(); app.set("getTransaction", undefined); };

describe("API Trip Point Tesztek", () => 
{
    describe("/api/trip-points", () => 
    {
        beforeEach(mkTx);
        afterEach(rollback);

        describe("GET", () => 
        {
            test("should return all trip points", async () => 
            {
                const res = await withAuth(request(app).get("/api/trip-points"));
                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
            });
        });

        describe("POST", () => 
        {
            test("should create new trip point", async () => 
            {
                const res = await withAuth(request(app).post("/api/trip-points"))
                .send({ trip_id: 1, lat: 47.5, lng: 19.0 });
                expect(res.status).toBe(201);
                expect(res.body.trip_id).toEqual(1);
                expect(res.body.lat).toEqual(47.5);
                expect(res.body.lng).toEqual(19.0);
            });
        });
    });

    describe("/api/trip-points/by-trip/:tripId", () => 
    {
        beforeEach(mkTx);
        afterEach(rollback);

        describe("GET", () => 
        {
            test("should return trip points for specific trip", async () => 
            {
                const res = await withAuth(request(app).get("/api/trip-points/by-trip/1"));
                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
            });
        });
    });

    describe("/api/trip-points/:pointID", () => 
    {
        beforeEach(mkTx);
        afterEach(rollback);

        describe("GET", () => 
        {
            test("should return trip point with the ID: 1", async () => 
            {
                const res = await withAuth(request(app).get("/api/trip-points/1"));
                expect(res.status).toBe(200);
                expect(res.body).toBeDefined();
            });
        });

        describe("PUT", () => 
        {
            test("should update trip point and return with updated data", async () => 
            {
                const res = await withAuth(request(app).put("/api/trip-points/1"))
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
                const res = await withAuth(request(app).delete("/api/trip-points/1"))
                .set("Accept", "application/json");
                expect(res.status).toBe(200);
                expect(res.body).toBeDefined();
            });
        });
    });
});
