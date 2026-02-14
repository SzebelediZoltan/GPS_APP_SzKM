const request = require("supertest");
const app = require("../../../app");


describe("/api/clan-members", () => 
{
    describe("GET", () => 
    {
        test("should return 200 with all members", async () => 
        {
            const res = await request(app).get("/api/clan-members");

            expect(res.status).toBe(200);
        });
    });

    describe("POST", () => 
    {
        test("should add new member and respond with object", async () => 
        {
            const res = await request(app).post("/api/clan-members")
            .send({ 
                clan_id: 1,
                user_id: 1,
            });

            expect(res.body).toBeDefined();
            expect(res.body.clan_id).toEqual(1);
            expect(res.body.user_id).toEqual(1);
        });
    });
});

describe("/api/clan-members/by-clan/:clanId", () => 
{
    describe("GET", () => 
    {
        test("should return 200 with clan members", async () => 
        {
            const res = await request(app).get("/api/clan-members/by-clan/1");

            expect(res.status).toBe(200);
        });
    });
});

describe("/api/clan-members/by-user/:userId", () => 
{
    describe("GET", () => 
    {
        test("should return 200 with user memberships", async () => 
        {
            const res = await request(app).get("/api/clan-members/by-user/1");

            expect(res.status).toBe(200);
        });
    });
});

describe("/api/clan-members/:clanId/:userId", () => 
{
    describe("GET", () => 
    {
        test("should return specific clan member", async () => 
        {
            const res = await request(app).get("/api/clan-members/1/1");

            expect(res.status).toBe(200);
        });
    });

    describe("DELETE", () => 
    {
        test("should remove member from clan", async () => 
        {
            const res = await request(app).delete("/api/clan-members/1/1");

            expect(res.body).toBeDefined();
        });
    });
});
