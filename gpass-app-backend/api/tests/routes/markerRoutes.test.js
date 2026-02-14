const request = require("supertest");
const app = require("../../../app");


describe("/api/markers", () => 
{
    describe("GET", () => 
    {
        test("should return 200 with all markers", async () => 
        {
            const res = await request(app).get("/api/markers");

            expect(res.status).toBe(200);
        });
    });

    describe("POST", () => 
    {
        test("should create new marker and respond with object", async () => 
        {
            const res = await request(app).post("/api/markers")
            .send({ 
                creator_id: 1,
                marker_type: "poi",
                lat: 47.5,
                lng: 19.0,
            });

            expect(res.body).toBeDefined();
            expect(res.body.creator_id).toEqual(1);
            expect(res.body.marker_type).toEqual("poi");
            expect(res.body.lat).toEqual(47.5);
            expect(res.body.lng).toEqual(19.0);
        });
    });
});

describe("/api/markers/box", () => 
{
    describe("GET", () => 
    {
        test("should return 200 with markers in box", async () => 
        {
            const res = await request(app).get("/api/markers/box?minLat=47&maxLat=48&minLng=19&maxLng=20");

            expect(res.status).toBe(200);
        });
    });
});

describe("/api/markers/type/:markerType", () => 
{
    describe("GET", () => 
    {
        test("should return 200 with markers by type", async () => 
        {
            const res = await request(app).get("/api/markers/type/poi");

            expect(res.status).toBe(200);
        });
    });
});

describe("/api/markers/creator/:userId", () => 
{
    describe("GET", () => 
    {
        test("should return 200 with markers by creator", async () => 
        {
            const res = await request(app).get("/api/markers/creator/1");

            expect(res.status).toBe(200);
        });
    });
});

describe("/api/markers/:markerID", () => 
{
    describe("GET", () => 
    {
        test("should return marker with the ID: 1", async () => 
        {
            const res = await request(app).get("/api/markers/1");

            expect(res.status).toBe(200);
        });
    });

    describe("PUT", () => 
    {
        test("should update marker and return with updated data", async () => 
        {
            const res = await request(app).put("/api/markers/1")
            .send({ marker_type: "poi", score: 5, lat: 47.6, lng: 19.1 });

            expect(res.body).toBeDefined();
            expect(res.body.marker_type).toEqual("poi");
        });
    });

    describe("DELETE", () => 
    {
        test("should delete marker and return result", async () => 
        {
            const res = await request(app).delete("/api/markers/1");

            expect(res.body).toBeDefined();
        });
    });
});
