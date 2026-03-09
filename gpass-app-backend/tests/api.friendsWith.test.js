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
        username: overrides.username || "fwuser",
        email: overrides.email || "fwuser@example.com",
        password: hashedPassword,
        isAdmin: overrides.isAdmin ?? false,
    }, { transaction: t });
};

const createTestFriendship = async (app, senderId, receiverId, overrides = {}) => {
    const t = app.get("getTransaction")();
    return db.FriendWith.create({
        sender_id: senderId,
        receiver_id: receiverId,
        status: overrides.status || "sent",
    }, { transaction: t });
};

describe("/api/friends-with", () => {

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

        test("should get all friendships", async () => {
            const admin = await createTestUser(app, { username: "fwadmin", email: "fwadmin@example.com", isAdmin: true });
            const token = makeToken(admin);

            const res = await request(app)
                .get("/api/friends-with")
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

        test("should create friendship", async () => {
            const sender = await createTestUser(app, { username: "fwsender", email: "fwsender@example.com" });
            const receiver = await createTestUser(app, { username: "fwreceiver", email: "fwreceiver@example.com" });
            const token = makeToken(sender);

            const res = await request(app)
                .post("/api/friends-with")
                .set("Cookie", `user_token=${token}`)
                .send({ sender_id: sender.ID, receiver_id: receiver.ID });

            expect(res.status).toBe(201);
            expect(res.body.sender_id).toBe(sender.ID);
            expect(res.body.receiver_id).toBe(receiver.ID);
            expect(res.body.status).toBe("sent");
        });
    });

    describe("/:id", () => {

        describe("GET", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should get friendship by ID", async () => {
                const admin = await createTestUser(app, { username: "fwgetadmin", email: "fwgetadmin@example.com", isAdmin: true });
                const token = makeToken(admin);
                const user1 = await createTestUser(app, { username: "fwget1", email: "fwget1@example.com" });
                const user2 = await createTestUser(app, { username: "fwget2", email: "fwget2@example.com" });
                const friendship = await createTestFriendship(app, user1.ID, user2.ID);

                const res = await request(app)
                    .get(`/api/friends-with/${friendship.id}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
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

            test("should update friendship", async () => {
                const user1 = await createTestUser(app, { username: "fwput1", email: "fwput1@example.com" });
                const user2 = await createTestUser(app, { username: "fwput2", email: "fwput2@example.com" });
                const token = makeToken(user1);
                const friendship = await createTestFriendship(app, user1.ID, user2.ID, { status: "sent" });

                const res = await request(app)
                    .put(`/api/friends-with/${friendship.id}`)
                    .set("Cookie", `user_token=${token}`)
                    .send({ status: "accepted" });

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

            test("should delete friendship", async () => {
                const user1 = await createTestUser(app, { username: "fwdel1", email: "fwdel1@example.com" });
                const user2 = await createTestUser(app, { username: "fwdel2", email: "fwdel2@example.com" });
                const token = makeToken(user1);
                const friendship = await createTestFriendship(app, user1.ID, user2.ID);

                const res = await request(app)
                    .delete(`/api/friends-with/${friendship.id}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
            });
        });
    });

    describe("/pending/:userId", () => {
        describe("GET", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should get pending friendships for user", async () => {
                const user1 = await createTestUser(app, { username: "fwpend1", email: "fwpend1@example.com" });
                const user2 = await createTestUser(app, { username: "fwpend2", email: "fwpend2@example.com" });
                const token = makeToken(user2);
                await createTestFriendship(app, user1.ID, user2.ID, { status: "sent" });

                const res = await request(app)
                    .get(`/api/friends-with/pending/${user2.ID}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
            });
        });
    });

    describe("/accepted/:userId", () => {
        describe("GET", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should delete friendship", async () => {
                const user1 = await createTestUser(app, { username: "fwacc1", email: "fwacc1@example.com" });
                const user2 = await createTestUser(app, { username: "fwacc2", email: "fwacc2@example.com" });
                const token = makeToken(user1);
                await createTestFriendship(app, user1.ID, user2.ID, { status: "accepted" });

                const res = await request(app)
                    .get(`/api/friends-with/accepted/${user1.ID}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
            });
        });
    });
});