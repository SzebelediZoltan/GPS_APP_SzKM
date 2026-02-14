const request = require("supertest");
const app = require("../../../app");


describe("/api/users", () => 
{
    describe("GET", () => 
    {
        test("should return 200", async () => 
        {
            const res = await request(app).get("/api/users");

            expect(res.status).toBe(200);
        });
    });

    describe("POST", () => 
    {
        test("should create new user and respond with object", async () => 
        {
            const res = await request(app).post("/api/users")
            .send({ 
                username: "Kiss Domink",
                password: "jelszo123",
                email: "kiss.dominik@ckik.hu",
            });


            //expect(res.status).toBe(200) ????
            expect(res.body).toBeDefined();

            expect(res.body.name).toEqual("Kiss Domink");
            expect(res.body.password).toEqual("jelszo123");
            expect(res.body.email).toEqual("kiss.dominik@ckik.hu")
        });
    });
});

describe("/api/users/search", () => 
{
    describe("GET", () => 
    {
        test("should return 200", async () => 
        {
            const res = await request(app).get("/api/users/search?query=Osama");

            expect(res.status).toBe(200);
        });
    });
});

describe("/api/users/:userID", () => 
{
    describe("GET", () => 
    {
        test("should return user with the ID: 1", async () => 
        {
            const res = await request(app).get("/api/users/1");

            expect(res.status).toBe(200);
        });
    });

    describe("PUT", () => 
    {
        test("should return with the email", async () => 
        {
            const res = await request(app).post("/api/users/1")
            .send({ email: "kiss.dominik@ckik.hu" });

            expect(res.body).toBeDefined();
            expect(res.body.email).toEqual("kiss.dominik@ckik.hu");
        });
    });


    describe("DELETE", () => 
    {
        test("should return deletedCount", async () => 
        {
            const res = await request(app).post("/api/users/1")

            expect(res.body).toBeDefined();
        });
    });
});