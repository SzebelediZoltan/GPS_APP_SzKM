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
        username: overrides.username || "cmuser",
        email: overrides.email || "cmuser@example.com",
        password: hashedPassword,
        isAdmin: overrides.isAdmin ?? false,
    }, { transaction: t });
};

const createTestClan = async (app, leaderId, overrides = {}) => {
    const t = app.get("getTransaction")();
    return db.Clan.create({
        name: overrides.name || "CMTestClan",
        leader_id: leaderId,
        description: overrides.description || "Teszt",
    }, { transaction: t });
};

const createTestMember = async (app, clanId, userId) => {
    const t = app.get("getTransaction")();
    return db.ClanMember.create({ clan_id: clanId, user_id: userId }, { transaction: t });
};

describe("/api/clan-members", () => {

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

        test("should get all clan members", async () => {
            const user = await createTestUser(app, { username: "cmlist", email: "cmlist@example.com" });
            const token = makeToken(user);
            const clan = await createTestClan(app, user.ID, { name: "CMListClan" });
            await createTestMember(app, clan.id, user.ID);

            const res = await request(app)
                .get("/api/clan-members")
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

        test("should add new clan member", async () => {
            const user = await createTestUser(app, { username: "cmleader", email: "cmleader@example.com" });
            const member = await createTestUser(app, { username: "cmmember", email: "cmmember@example.com" });
            const token = makeToken(user);
            const clan = await createTestClan(app, user.ID, { name: "CMPostClan" });

            const res = await request(app)
                .post("/api/clan-members")
                .set("Cookie", `user_token=${token}`)
                .send({ clan_id: clan.id, user_id: member.ID });

            expect(res.status).toBe(201);
            expect(res.body.clan_id).toBe(clan.id);
            expect(res.body.user_id).toBe(member.ID);
        });
    });

    describe("/by-clan/:clanId", () => {
        describe("GET", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should get members by clan", async () => {
                const user = await createTestUser(app, { username: "cmbyclan", email: "cmbyclan@example.com" });
                const token = makeToken(user);
                const clan = await createTestClan(app, user.ID, { name: "CMByClanClan" });
                await createTestMember(app, clan.id, user.ID);

                const res = await request(app)
                    .get(`/api/clan-members/by-clan/${clan.id}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body.length).toBeGreaterThanOrEqual(1);
            });
        });
    });

    describe("/by-user/:userId", () => {
        describe("GET", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should get memberships by user", async () => {
                const user = await createTestUser(app, { username: "cmbyuser", email: "cmbyuser@example.com" });
                const token = makeToken(user);
                const clan = await createTestClan(app, user.ID, { name: "CMByUserClan" });
                await createTestMember(app, clan.id, user.ID);

                const res = await request(app)
                    .get(`/api/clan-members/by-user/${user.ID}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
            });
        });
    });

    describe("/:clanId/:userId", () => {

        describe("GET", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should get specific clan member", async () => {
                const user = await createTestUser(app, { username: "cmgetone", email: "cmgetone@example.com" });
                const token = makeToken(user);
                const clan = await createTestClan(app, user.ID, { name: "CMGetOneClan" });
                await createTestMember(app, clan.id, user.ID);

                const res = await request(app)
                    .get(`/api/clan-members/${clan.id}/${user.ID}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
                expect(res.body.clan_id).toBe(clan.id);
                expect(res.body.user_id).toBe(user.ID);
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

            test("should remove clan member", async () => {
                const user = await createTestUser(app, { username: "cmdel", email: "cmdel@example.com" });
                const member = await createTestUser(app, { username: "cmdelmember", email: "cmdelmember@example.com" });
                const token = makeToken(user);
                const clan = await createTestClan(app, user.ID, { name: "CMDelClan" });
                await createTestMember(app, clan.id, member.ID);

                const res = await request(app)
                    .delete(`/api/clan-members/${clan.id}/${member.ID}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
            });
        });
    });
});