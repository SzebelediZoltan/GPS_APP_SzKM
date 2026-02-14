const request = require("supertest");
const app = require("../../../app");


describe("/api/clans", () => 
{
    describe("GET", () => 
    {
        test("should return 200 with all clans", async () => 
        {
            const res = await request(app).get("/api/clans");

            expect(res.status).toBe(200);
        });
    });

    describe("POST", () => 
    {
        test("should create new clan and respond with object", async () => 
        {
            const res = await request(app).post("/api/clans")
            .send({ 
                name: "TestClan",
                leader_id: 1,
            });

            expect(res.body).toBeDefined();
            expect(res.body.name).toEqual("TestClan");
            expect(res.body.leader_id).toEqual(1);
        });
    });
});

describe("/api/clans/search", () => 
{
    describe("GET", () => 
    {
        test("should return 200 with search results", async () => 
        {
            const res = await request(app).get("/api/clans/search?query=Test");

            expect(res.status).toBe(200);
        });
    });
});

describe("/api/clans/:clanID", () => 
{
    describe("GET", () => 
    {
        test("should return clan with the ID: 1", async () => 
        {
            const res = await request(app).get("/api/clans/1");

            expect(res.status).toBe(200);
        });
    });

    describe("PUT", () => 
    {
        test("should update clan and return with updated data", async () => 
        {
            const res = await request(app).put("/api/clans/1")
            .send({ name: "UpdatedClan", leader_id: 1 });

            expect(res.body).toBeDefined();
            expect(res.body.name).toEqual("UpdatedClan");
        });
    });

    describe("DELETE", () => 
    {
        test("should delete clan and return result", async () => 
        {
            const res = await request(app).delete("/api/clans/1");

            expect(res.body).toBeDefined();
        });
    });
});
