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
        username: overrides.username || "clanuser",
        email: overrides.email || "clanuser@example.com",
        password: hashedPassword,
        isAdmin: overrides.isAdmin ?? false,
    }, { transaction: t });
};

const createTestClan = async (app, leaderId, overrides = {}) => {
    const t = app.get("getTransaction")();
    return db.Clan.create({
        name: overrides.name || "TestClan",
        leader_id: leaderId,
        description: overrides.description || "Teszt klán",
    }, { transaction: t });
};

describe("/api/clans", () => {

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

        test("should get all clans", async () => {
            const user = await createTestUser(app, { username: "clanlist", email: "clanlist@example.com" });
            const token = makeToken(user);
            await createTestClan(app, user.ID, { name: "ListClan" });

            const res = await request(app)
                .get("/api/clans")
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

        test("should create clan", async () => {
            const user = await createTestUser(app, { username: "clanmaker", email: "clanmaker@example.com" });
            const token = makeToken(user);

            const res = await request(app)
                .post("/api/clans")
                .set("Cookie", `user_token=${token}`)
                .send({ name: "NovaClan", leader_id: user.ID, description: "Új klán" });

            expect(res.status).toBe(201);
            expect(res.body.name).toBe("NovaClan");
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

            test("should search clans", async () => {
                const user = await createTestUser(app, { username: "clansearcher", email: "clansearcher@example.com" });
                const token = makeToken(user);
                await createTestClan(app, user.ID, { name: "SearchableClan" });

                const res = await request(app)
                    .get("/api/clans/search?query=Search")
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
            });
        });
    });

    describe("/:clanID", () => {

        describe("GET", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should get clan by ID", async () => {
                const user = await createTestUser(app, { username: "clangetone", email: "clangetone@example.com" });
                const token = makeToken(user);
                const clan = await createTestClan(app, user.ID, { name: "GetOneClan" });

                const res = await request(app)
                    .get(`/api/clans/${clan.id}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
                expect(res.body.name).toBe("GetOneClan");
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

            test("should update clan", async () => {
                const user = await createTestUser(app, { username: "clanupdater", email: "clanupdater@example.com" });
                const token = makeToken(user);
                const clan = await createTestClan(app, user.ID, { name: "UpdateableClan" });

                const res = await request(app)
                    .put(`/api/clans/${clan.id}`)
                    .set("Cookie", `user_token=${token}`)
                    .send({ name: "UpdatedClan", leader_id: user.ID, description: "Frissített" });

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

            test("should delete clan", async () => {
                const user = await createTestUser(app, { username: "clandeleter", email: "clandeleter@example.com" });
                const token = makeToken(user);
                const clan = await createTestClan(app, user.ID, { name: "DeletableClan" });

                const res = await request(app)
                    .delete(`/api/clans/${clan.id}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
            });
        });
    });
});