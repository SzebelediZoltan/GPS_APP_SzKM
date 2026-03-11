require("dotenv").config({ path: "./.env.test", quiet: true });
const request = require("supertest");
const app = require("../app");
const db = require("../api/db");
const jwt = require("jsonwebtoken");

const { transactionSetup, transactionTeardown } = require("./helpers/transactionHelper");

const getSeedUser = async (username) => {
    const user = await db.User.findOne({ where: { username } });
    if (!user) throw new Error(`Seed user '${username}' not found. Run seeders first.`);
    return user;
};

const makeToken = (user) =>
    jwt.sign(
        { userID: user.ID, username: user.username, isAdmin: user.isAdmin, email: user.email },
        process.env.JWT_SECRET
    );

describe("/api/auth", () => {

    describe("/login", () => {
        describe("POST", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
            });

            test("should set cookie on successful login", async () => {
                // seed_user1 valódi bcrypt hashelt jelszóval szerepel az adatbázisban
                const res = await request(app)
                    .post("/api/auth/login")
                    .send({
                        userID: "seed_user1",
                        password: "TestPassword123",
                    });

                expect(res.status).toBe(200);
                expect(res.headers["set-cookie"]).toBeDefined();
                expect(res.headers["set-cookie"][0]).toMatch(/user_token=/);
                expect(typeof res.body).toBe("string");
            });

            test("should return 401 on wrong password", async () => {
                const res = await request(app)
                    .post("/api/auth/login")
                    .send({
                        userID: "seed_user1",
                        password: "WrongPassword",
                    });

                expect(res.status).toBe(401);
            });
        });
    });

    describe("/status", () => {
        describe("GET", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
            });

            test("should return user data on valid token", async () => {
                const seedUser = await getSeedUser("seed_user1");
                const token = makeToken(seedUser);

                const res = await request(app)
                    .get("/api/auth/status")
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
                expect(res.body.username).toBe("seed_user1");
                expect(res.body.email).toBe("seed_user1@example.com");
                expect(res.body.isAdmin).toBe(false);
            });

            test("should return 401 without token", async () => {
                const res = await request(app)
                    .get("/api/auth/status");

                expect(res.status).toBe(401);
            });
        });
    });

    describe("/logout", () => {
        describe("DELETE", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
            });

            test("should clear cookie on logout", async () => {
                const seedUser = await getSeedUser("seed_user1");
                const token = makeToken(seedUser);

                const res = await request(app)
                    .delete("/api/auth/logout")
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
                expect(res.headers["set-cookie"]).toBeDefined();
                expect(res.headers["set-cookie"][0]).toMatch(/user_token=;/);
            });

            test("should return 200 even without token", async () => {
                const res = await request(app)
                    .delete("/api/auth/logout");

                expect(res.status).toBe(200);
            });
        });
    });
});