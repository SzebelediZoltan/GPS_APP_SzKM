require("dotenv").config(
{
    quiet: true,
    path: "./.env.test",
});

const request = require("supertest");

const { app } = require("../../../app");

const db = require("../db");


describe("API Marker Tesztek", () => 
{
    describe("/api/markers", () => 
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

        const markers = 
        [
            {
                creator_id: 1,
                marker_type: "poi",
                lat: 47.5,
                lng: 19.0,
            },
            {
                creator_id: 2,
                marker_type: "checkpoint",
                lat: 47.6,
                lng: 19.1,
            },
        ];

        describe("GET", () => 
        {
            test("should return all markers", async () => 
            {
                const res = await request(app).get("/api/markers");

                expect(res.status).toBe(200);

                expect(res.body).toBeDefined();
                
                expect(Array.isArray(res.body)).toBe(true);
            });
        });

        describe("POST", () => 
        {
            test("should create new marker", async () => 
            {
                const res = await request(app).post("/api/markers")
                .send({ 
                    creator_id: 1,
                    marker_type: "poi",
                    lat: 47.5,
                    lng: 19.0,
                });

                expect(res.status).toBe(201);

                expect(res.body.creator_id).toEqual(1);
                expect(res.body.marker_type).toEqual("poi");
                expect(res.body.lat).toEqual(47.5);
                expect(res.body.lng).toEqual(19.0);
            });
        });
    });

    describe("/api/markers/box", () => 
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
            test("should return markers in bounding box", async () => 
            {
                const res = await request(app).get("/api/markers/box?minLat=47&maxLat=48&minLng=19&maxLng=20");

                expect(res.status).toBe(200);

                expect(Array.isArray(res.body)).toBe(true);
            });
        });
    });

    describe("/api/markers/type/:markerType", () => 
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
            test("should return markers by type", async () => 
            {
                const res = await request(app).get("/api/markers/type/poi");

                expect(res.status).toBe(200);

                expect(Array.isArray(res.body)).toBe(true);
            });
        });
    });

    describe("/api/markers/creator/:userId", () => 
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
            test("should return markers by creator", async () => 
            {
                const res = await request(app).get("/api/markers/creator/1");

                expect(res.status).toBe(200);

                expect(Array.isArray(res.body)).toBe(true);
            });
        });
    });

    describe("/api/markers/:markerID", () => 
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
            test("should return marker with the ID: 1", async () => 
            {
                const res = await request(app).get("/api/markers/1");

                expect(res.status).toBe(200);

                expect(res.body).toBeDefined();
            });
        });

        describe("PUT", () => 
        {
            test("should update marker and return with updated data", async () => 
            {
                const res = await request(app).put("/api/markers/1")
                .send({ marker_type: "poi", score: 5, lat: 47.6, lng: 19.1 });

                expect(res.status).toBe(200);

                expect(res.body.marker_type).toEqual("poi");
            });
        });

        describe("DELETE", () => 
        {
            test("should delete marker and return result", async () => 
            {
                const res = await request(app).delete("/api/markers/1")
                .set("Accept", "application/json");

                expect(res.status).toBe(200);

                expect(res.body).toBeDefined();
            });
        });
    });
});
