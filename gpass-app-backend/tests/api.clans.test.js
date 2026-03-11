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

const getSeedClan = async (name) => {
    const clan = await db.Clan.findOne({ where: { name } });
    if (!clan) throw new Error(`Seed clan '${name}' not found. Run seeders first.`);
    return clan;
};

const makeToken = (user) =>
    jwt.sign(
        { userID: user.ID, username: user.username, isAdmin: user.isAdmin, email: user.email },
        process.env.JWT_SECRET
    );

describe("/api/clans", () => {

    describe("GET", () => {
        beforeEach(async () => {
            await transactionSetup(app, db);
        });

        afterEach(async () => {
            await transactionTeardown(app);
        });

        test("should get all clans", async () => {
            const user = await getSeedUser("seed_user1");
            const token = makeToken(user);

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
        });

        test("should create clan", async () => {
            const user = await getSeedUser("seed_user1");
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
            });

            test("should search clans", async () => {
                const user = await getSeedUser("seed_user1");
                const token = makeToken(user);

                const res = await request(app)
                    .get("/api/clans/search?query=SeedClan")
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
            });

            test("should get clan by ID", async () => {
                const user = await getSeedUser("seed_user1");
                const token = makeToken(user);
                const clan = await getSeedClan("SeedClan One");

                const res = await request(app)
                    .get(`/api/clans/${clan.id}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
                expect(res.body.name).toBe("SeedClan One");
            });
        });

        describe("PUT", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
            });

            test("should update clan", async () => {
                const user = await getSeedUser("seed_user1");
                const token = makeToken(user);
                const clan = await getSeedClan("SeedClan One");

                const res = await request(app)
                    .put(`/api/clans/${clan.id}`)
                    .set("Cookie", `user_token=${token}`)
                    .send({ name: "SeedClan One", leader_id: user.ID, description: "Frissített leírás" });

                expect(res.status).toBe(200);
            });
        });

        describe("DELETE", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
            });

            test("should delete clan", async () => {
                const user = await getSeedUser("seed_user2");
                const token = makeToken(user);
                const clan = await getSeedClan("SeedClan Two");

                const res = await request(app)
                    .delete(`/api/clans/${clan.id}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
            });
        });
    });
});