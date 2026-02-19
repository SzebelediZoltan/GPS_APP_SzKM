require("dotenv").config({ quiet: true, path: "./.env.test" });

const request = require("supertest");
const { app } = require("../../../app");
const db = require("../db");
const { withAuth } = require("../testHelper");

const mkTx = async () => {
    const t = await db.sequelize.transaction();
    app.set("getTransaction", () => t);
    return t;
};
const rollback = async () => {
    const t = app.get("getTransaction")();
    await t.rollback();
    app.set("getTransaction", undefined);
};

describe("API Clan Tesztek", () => 
{
    describe("/api/clans", () => 
    {
        beforeEach(mkTx);
        afterEach(rollback);

        describe("GET", () => 
        {
            test("should return all clans", async () => 
            {
                const res = await withAuth(request(app).get("/api/clans"));
                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
            });
        });

        describe("POST", () => 
        {
            test("should create new clan", async () => 
            {
                const res = await withAuth(request(app).post("/api/clans"))
                .send({ name: "TestClan", leader_id: 1 });
                expect(res.status).toBe(201);
                expect(res.body.name).toEqual("TestClan");
                expect(res.body.leader_id).toEqual(1);
            });
        });
    });

    describe("/api/clans/search", () => 
    {
        beforeEach(mkTx);
        afterEach(rollback);

        describe("GET", () => 
        {
            test("should return clans matching search query", async () => 
            {
                const res = await withAuth(request(app).get("/api/clans/search?query=Test"));
                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
            });
        });
    });

    describe("/api/clans/:clanID", () => 
    {
        beforeEach(mkTx);
        afterEach(rollback);

        describe("GET", () => 
        {
            test("should return clan with the ID: 1", async () => 
            {
                const res = await withAuth(request(app).get("/api/clans/1"));
                expect(res.status).toBe(200);
                expect(res.body).toBeDefined();
            });
        });

        describe("PUT", () => 
        {
            test("should update clan and return with updated data", async () => 
            {
                const res = await withAuth(request(app).put("/api/clans/1"))
                .send({ name: "UpdatedClan", leader_id: 1 });
                expect(res.status).toBe(200);
                expect(res.body.name).toEqual("UpdatedClan");
            });
        });

        describe("DELETE", () => 
        {
            test("should delete clan and return result", async () => 
            {
                const res = await withAuth(request(app).delete("/api/clans/1"));
                expect(res.status).toBe(200);
                expect(res.body).toBeDefined();
            });
        });
    });
});
