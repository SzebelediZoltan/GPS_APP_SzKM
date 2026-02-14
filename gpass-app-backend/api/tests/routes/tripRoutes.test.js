const request = require("supertest");
const app = require("../../../app");


describe("/api/trips", () => 
{
    describe("GET", () => 
    {
        test("should return 200 with all trips", async () => 
        {
            const res = await request(app).get("/api/trips");

            expect(res.status).toBe(200);
        });
    });

    describe("POST", () => 
    {
        test("should create new trip and respond with object", async () => 
        {
            const res = await request(app).post("/api/trips")
            .send({ 
                user_id: 1,
                trip_number: 1,
            });

            expect(res.body).toBeDefined();
            expect(res.body.user_id).toEqual(1);
            expect(res.body.trip_number).toEqual(1);
        });
    });
});

describe("/api/trips/by-user/:userId", () => 
{
    describe("GET", () => 
    {
        test("should return 200 with user trips", async () => 
        {
            const res = await request(app).get("/api/trips/by-user/1");

            expect(res.status).toBe(200);
        });
    });
});

describe("/api/trips/by-user/:userId/number/:tripNumber", () => 
{
    describe("GET", () => 
    {
        test("should return trip with the userId: 1 and tripNumber: 1", async () => 
        {
            const res = await request(app).get("/api/trips/by-user/1/number/1");

            expect(res.status).toBe(200);
        });
    });
});

describe("/api/trips/:tripID", () => 
{
    describe("GET", () => 
    {
        test("should return trip with the ID: 1", async () => 
        {
            const res = await request(app).get("/api/trips/1");

            expect(res.status).toBe(200);
        });
    });

    describe("PUT", () => 
    {
        test("should update trip and return with updated data", async () => 
        {
            const res = await request(app).put("/api/trips/1")
            .send({ user_id: 1, trip_number: 2 });

            expect(res.body).toBeDefined();
            expect(res.body.trip_number).toEqual(2);
        });
    });

    describe("DELETE", () => 
    {
        test("should delete trip and return result", async () => 
        {
            const res = await request(app).delete("/api/trips/1");

            expect(res.body).toBeDefined();
        });
    });
});
