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

// Tranzakción belül hoz létre barátságot (írás tesztekhez)
const createFriendship = async (app, senderId, receiverId, status = "sent") => {
    const t = app.get("getTransaction")();
    return db.FriendWith.create(
        { sender_id: senderId, receiver_id: receiverId, status },
        { transaction: t }
    );
};

const makeToken = (user) =>
    jwt.sign(
        { userID: user.ID, username: user.username, isAdmin: user.isAdmin, email: user.email },
        process.env.JWT_SECRET
    );

describe("/api/friends-with", () => {

    describe("GET", () => {
        beforeEach(async () => {
            await transactionSetup(app, db);
        });

        afterEach(async () => {
            await transactionTeardown(app);
        });

        test("should get all friendships", async () => {
            const admin = await getSeedUser("seed_admin");
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
        });

        test("should create friendship", async () => {
            const sender = await getSeedUser("seed_admin");
            const receiver = await getSeedUser("seed_user1");
            const token = makeToken(sender);

            // Ha maradt volna előző futásból, töröljük (a tranzakció úgyis visszavonja)
            await db.FriendWith.destroy({
                where: { sender_id: sender.ID, receiver_id: receiver.ID },
            });

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
            });

            test("should get friendship by ID", async () => {
                const user1 = await getSeedUser("seed_user1");
                const user2 = await getSeedUser("seed_user2");
                const admin = await getSeedUser("seed_admin");
                const token = makeToken(admin);
                const friendship = await createFriendship(app, user1.ID, user2.ID);

                const res = await request(app)
                    .get(`/api/friends-with/${friendship.id}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
            });
        });

        describe("PUT", () => {
            let friendship;

            beforeEach(async () => {
                const user1 = await getSeedUser("seed_user1");
                const user2 = await getSeedUser("seed_user2");

                // Tranzakción kívül hozzuk létre, hogy ne legyen deadlock
                await db.FriendWith.destroy({ where: { sender_id: user1.ID, receiver_id: user2.ID } });
                friendship = await db.FriendWith.create({ sender_id: user1.ID, receiver_id: user2.ID, status: "sent" });

                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);

                // Cleanup
                if (friendship) await db.FriendWith.destroy({ where: { id: friendship.id } });
            });

            test("should update friendship status", async () => {
                const user1 = await getSeedUser("seed_user1");
                const token = makeToken(user1);

                const res = await request(app)
                    .put(`/api/friends-with/${friendship.id}`)
                    .set("Cookie", `user_token=${token}`)
                    .send({ status: "accepted" });

                expect(res.status).toBe(200);
            });
        });

        describe("DELETE", () => {
            let friendship;

            beforeEach(async () => {
                const user1 = await getSeedUser("seed_user1");
                const user2 = await getSeedUser("seed_user2");

                // Tranzakción kívül hozzuk létre, hogy ne legyen deadlock
                await db.FriendWith.destroy({ where: { sender_id: user1.ID, receiver_id: user2.ID } });
                friendship = await db.FriendWith.create({ sender_id: user1.ID, receiver_id: user2.ID, status: "sent" });

                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);

                // Cleanup (ha a delete nem sikerült)
                if (friendship) await db.FriendWith.destroy({ where: { id: friendship.id } });
            });

            test("should delete friendship", async () => {
                const user1 = await getSeedUser("seed_user1");
                const token = makeToken(user1);

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
            });

            test("should get pending friendships for user", async () => {
                // seed_user2 kapja a 'sent' kérést seed_user1-től — seederből látható
                const user2 = await getSeedUser("seed_user2");
                const token = makeToken(user2);

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
            });

            test("should get accepted friendships for user", async () => {
                // seed_user2 → seed_user3 (status: accepted) — seederből látható
                const user2 = await getSeedUser("seed_user2");
                const token = makeToken(user2);

                const res = await request(app)
                    .get(`/api/friends-with/accepted/${user2.ID}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
            });
        });
    });
});