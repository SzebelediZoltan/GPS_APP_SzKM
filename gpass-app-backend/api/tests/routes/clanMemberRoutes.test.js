require("dotenv").config({ quiet: true, path: "./.env.test" });

const request = require("supertest");
const { app } = require("../../../app");
const db = require("../db");
const { withAuth } = require("../testHelper");

const mkTx = async () => { const t = await db.sequelize.transaction(); app.set("getTransaction", () => t); };
const rollback = async () => { const t = app.get("getTransaction")(); await t.rollback(); app.set("getTransaction", undefined); };

describe("API Clan Member Tesztek", () => 
{
    describe("/api/clan-members", () => 
    {
        beforeEach(mkTx);
        afterEach(rollback);

        describe("GET", () => 
        {
            test("should return all clan members", async () => 
            {
                const res = await withAuth(request(app).get("/api/clan-members"));
                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
            });
        });

        describe("POST", () => 
        {
            test("should create new clan member", async () => 
            {
                const res = await withAuth(request(app).post("/api/clan-members"))
                .send({ clan_id: 1, user_id: 1, role: "admin" });
                expect(res.status).toBe(201);
                expect(res.body.clan_id).toEqual(1);
                expect(res.body.user_id).toEqual(1);
                expect(res.body.role).toEqual("admin");
            });
        });
    });

    describe("/api/clan-members/by-clan/:clanId", () => 
    {
        beforeEach(mkTx);
        afterEach(rollback);

        describe("GET", () => 
        {
            test("should return clan members by clan ID", async () => 
            {
                const res = await withAuth(request(app).get("/api/clan-members/by-clan/1"));
                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
            });
        });
    });

    describe("/api/clan-members/by-user/:userId", () => 
    {
        beforeEach(mkTx);
        afterEach(rollback);

        describe("GET", () => 
        {
            test("should return user memberships by user ID", async () => 
            {
                const res = await withAuth(request(app).get("/api/clan-members/by-user/1"));
                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
            });
        });
    });

    describe("/api/clan-members/:clanId/:userId", () => 
    {
        beforeEach(mkTx);
        afterEach(rollback);

        describe("GET", () => 
        {
            test("should return specific clan member", async () => 
            {
                const res = await withAuth(request(app).get("/api/clan-members/1/1"));
                expect(res.status).toBe(200);
                expect(res.body).toBeDefined();
            });
        });

        describe("DELETE", () => 
        {
            test("should remove member from clan", async () => 
            {
                const res = await withAuth(request(app).delete("/api/clan-members/1/1"))
                .set("Accept", "application/json");
                expect(res.status).toBe(200);
                expect(res.body).toBeDefined();
            });
        });
    });
});
