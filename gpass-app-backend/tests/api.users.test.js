require("dotenv").config({ path: "./.env.test", quiet: true });
const request = require("supertest");
const app = require("../app");
const db = require("../api/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { transactionSetup, transactionTeardown } = require("./helpers/transactionHelper");

const makeToken = (user) =>
    jwt.sign(
        { userID: user.ID, username: user.username, isAdmin: user.isAdmin, email: user.email },
        process.env.JWT_SECRET
    );

const createTestUser = async (app, overrides = {}) => {
    const t = app.get("getTransaction")();
    const hashedPassword = await bcrypt.hash("TestPassword123", 10);
    return db.User.create({
        username: overrides.username || "testuser",
        email: overrides.email || "testuser@example.com",
        password: hashedPassword,
        isAdmin: overrides.isAdmin ?? false,
    }, { transaction: t });
};

describe("/api/users", () => {

    afterEach(async () => {
        jest.restoreAllMocks()
    });

    describe("GET", () => {
        beforeEach(async () => {
            await transactionSetup(app, db);
        });

        afterEach(async () => {
            await transactionTeardown(app);
            jest.restoreAllMocks()
        });

        test("should get all users", async () => {
            const admin = await createTestUser(app, { username: "adminget", email: "adminget@example.com", isAdmin: true });
            const token = makeToken(admin);

            const res = await request(app)
                .get("/api/users")
                .set("Cookie", `user_token=${token}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe("POST", () => {
        beforeEach(async () => {
            await transactionSetup(app, db);
        });

        afterEach(async () => {
            await transactionTeardown(app);
            jest.restoreAllMocks()
        });

        test("should create user", async () => {
            const res = await request(app)
                .post("/api/users")
                .send({ username: "newuser", email: "newuser@example.com", password: "SecurePass123" });

            expect(res.status).toBe(201);
            expect(res.body.username).toBe("newuser");
            expect(res.body.email).toBe("newuser@example.com");
        });
    });

    describe("/search", () => {
        describe("GET", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should search users", async () => {
                const user = await createTestUser(app, { username: "searchable", email: "searchable@example.com" });
                const token = makeToken(user);

                const res = await request(app)
                    .get("/api/users/search?query=search")
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
            });
        });
    });

    describe("/:userID", () => {

        describe("GET", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should get user by ID", async () => {
                const user = await createTestUser(app, { username: "getbyid", email: "getbyid@example.com" });
                const token = makeToken(user);

                const res = await request(app)
                    .get(`/api/users/${user.ID}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
                expect(res.body.username).toBe("getbyid");
            });
        });

        describe("PUT", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should update user", async () => {
                const user = await createTestUser(app, { username: "updateme", email: "updateme@example.com" });
                const token = makeToken(user);

                const res = await request(app)
                    .put(`/api/users/${user.ID}`)
                    .set("Cookie", `user_token=${token}`)
                    .send({ username: "updateme", email: "updated@example.com", password: "NewPass123", isAdmin: false });

                expect(res.status).toBe(200);
            });
        });

        describe("DELETE", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should delete user", async () => {
                const admin = await createTestUser(app, { username: "deladmin", email: "deladmin@example.com", isAdmin: true });
                const token = makeToken(admin);
                const target = await createTestUser(app, { username: "deltarget", email: "deltarget@example.com" });

                const res = await request(app)
                    .delete(`/api/users/${target.ID}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
            });
        });
    });

    describe("/location", () => {

        describe("PUT", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should update user location", async () => {
                const user = await createTestUser(app, { username: "locupdate", email: "locupdate@example.com" });
                const token = makeToken(user);

                const res = await request(app)
                    .put("/api/users/location")
                    .set("Cookie", `user_token=${token}`)
                    .send({ latitude: 47.5, longitude: 19.1 });

                expect(res.status).toBe(200);
            });
        });
    });

    describe("/location/:userID", () => {

        describe("GET", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should get user location", async () => {
                const user = await createTestUser(app, { username: "locget", email: "locget@example.com" });
                const token = makeToken(user);

                const res = await request(app)
                    .get(`/api/users/location/${user.ID}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
            });
        });
    });
});