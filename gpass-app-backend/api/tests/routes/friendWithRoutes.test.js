const request = require("supertest");
const app = require("../../../app");


describe("/api/friends-with", () => 
{
    describe("GET", () => 
    {
        test("should return 200 with all friendships", async () => 
        {
            const res = await request(app).get("/api/friends-with");

            expect(res.status).toBe(200);
        });
    });

    describe("POST", () => 
    {
        test("should create new friendship and respond with object", async () => 
        {
            const res = await request(app).post("/api/friends-with")
            .send({ 
                sender_id: 1,
                receiver_id: 2,
            });

            expect(res.body).toBeDefined();
            expect(res.body.sender_id).toEqual(1);
            expect(res.body.receiver_id).toEqual(2);
        });
    });
});

describe("/api/friends-with/:id", () => 
{
    describe("GET", () => 
    {
        test("should return friendship with the ID: 1", async () => 
        {
            const res = await request(app).get("/api/friends-with/1");

            expect(res.status).toBe(200);
        });
    });

    describe("PUT", () => 
    {
        test("should update friendship and return with updated data", async () => 
        {
            const res = await request(app).put("/api/friends-with/1")
            .send({ status: "accepted" });

            expect(res.body).toBeDefined();
            expect(res.body.status).toEqual("accepted");
        });
    });

    describe("DELETE", () => 
    {
        test("should delete friendship and return result", async () => 
        {
            const res = await request(app).delete("/api/friends-with/1");

            expect(res.body).toBeDefined();
        });
    });
});

describe("/api/friends-with/pending/:userId", () => 
{
    describe("GET", () => 
    {
        test("should return pending friendships for user", async () => 
        {
            const res = await request(app).get("/api/friends-with/pending/1");

            expect(res.status).toBe(200);
        });
    });
});

describe("/api/friends-with/accepted/:userId", () => 
{
    describe("GET", () => 
    {
        test("should return accepted friendships for user", async () => 
        {
            const res = await request(app).get("/api/friends-with/accepted/1");

            expect(res.status).toBe(200);
        });
    });
});
