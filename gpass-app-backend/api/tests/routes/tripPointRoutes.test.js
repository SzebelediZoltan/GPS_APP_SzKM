const request = require("supertest");
const app = require("../../../app");


describe("/api/trip-points", () => 
{
    describe("GET", () => 
    {
        test("should return 200 with all trip points", async () => 
        {
            const res = await request(app).get("/api/trip-points");

            expect(res.status).toBe(200);
        });
    });

    describe("POST", () => 
    {
        test("should create new trip point and respond with object", async () => 
        {
            const res = await request(app).post("/api/trip-points")
            .send({ 
                trip_id: 1,
                lat: 47.5,
                lng: 19.0,
            });

            expect(res.body).toBeDefined();
            expect(res.body.trip_id).toEqual(1);
            expect(res.body.lat).toEqual(47.5);
            expect(res.body.lng).toEqual(19.0);
        });
    });
});

describe("/api/trip-points/by-trip/:tripId", () => 
{
    describe("GET", () => 
    {
        test("should return 200 with trip points for specific trip", async () => 
        {
            const res = await request(app).get("/api/trip-points/by-trip/1");

            expect(res.status).toBe(200);
        });
    });
});

describe("/api/trip-points/:pointID", () => 
{
    describe("GET", () => 
    {
        test("should return trip point with the ID: 1", async () => 
        {
            const res = await request(app).get("/api/trip-points/1");

            expect(res.status).toBe(200);
        });
    });

    describe("PUT", () => 
    {
        test("should update trip point and return with updated data", async () => 
        {
            const res = await request(app).put("/api/trip-points/1")
            .send({ lat: 47.6, lng: 19.1, recorded_at: new Date() });

            expect(res.body).toBeDefined();
            expect(res.body.lat).toEqual(47.6);
            expect(res.body.lng).toEqual(19.1);
        });
    });

    describe("DELETE", () => 
    {
        test("should delete trip point and return result", async () => 
        {
            const res = await request(app).delete("/api/trip-points/1");

            expect(res.body).toBeDefined();
        });
    });
});
