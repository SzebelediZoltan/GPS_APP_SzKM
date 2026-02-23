require("dotenv").config({ path: "./.env.test", quiet: true });

const request = require("supertest");
const app = require("../app");
const { cleanDb, makeAuthCookie, createBaseUsers, db } = require("./api.helpers");

beforeAll(async () => {
    await db.sequelize.sync({ force: true });
});

afterAll(async () => {
    await db.sequelize.close();
});

describe("/api/friends-with", () => {
    let adminUser;
    let senderUser;
    let receiverUser;
    let adminCookie;
    let senderCookie;
    let receiverCookie;

    beforeAll(async () => {
        await cleanDb();

        ({ adminUser, normalUser: senderUser, adminCookie, userCookie: senderCookie } =
            await createBaseUsers({
                adminUsername: "fw_admin",
                adminEmail: "fw_admin@gpass.test",
                normalUsername: "fw_sender",
                normalEmail: "fw_sender@gpass.test",
            }));

        receiverUser = await db.User.create({
            username: "fw_receiver",
            email: "fw_receiver@gpass.test",
            password: "Receiver1234!",
            isAdmin: false,
        });

        receiverCookie = makeAuthCookie({
            ID: receiverUser.ID,
            username: receiverUser.username,
            email: receiverUser.email,
            isAdmin: receiverUser.isAdmin,
        });
    });

    afterAll(async () => {
        await cleanDb();
    });

    // ── POST /api/friends-with ────────────────────────────────────────────────
    describe("POST /api/friends-with – barátkérelem küldése", () => {
        test("bejelentkezett user küldhet barátkérelmet", async () => {
            const res = await request(app)
                .post("/api/friends-with")
                .set("Cookie", senderCookie)
                .send({ sender_id: senderUser.ID, receiver_id: receiverUser.ID });

            expect(res.status).toBe(201);
            expect(res.body.sender_id).toBe(senderUser.ID);
            expect(res.body.receiver_id).toBe(receiverUser.ID);
            expect(res.body.status).toBe("sent");
        });

        test("duplikált kérelem esetén hibát ad vissza", async () => {
            const res = await request(app)
                .post("/api/friends-with")
                .set("Cookie", senderCookie)
                .send({ sender_id: senderUser.ID, receiver_id: receiverUser.ID });

            expect([400, 500]).toContain(res.status);
        });

        test("hiányzó sender_id esetén 400-at ad vissza", async () => {
            const res = await request(app)
                .post("/api/friends-with")
                .set("Cookie", senderCookie)
                .send({ receiver_id: receiverUser.ID });

            expect(res.status).toBe(400);
        });

        test("hiányzó receiver_id esetén 400-at ad vissza", async () => {
            const res = await request(app)
                .post("/api/friends-with")
                .set("Cookie", senderCookie)
                .send({ sender_id: senderUser.ID });

            expect(res.status).toBe(400);
        });

        test("hitelesítés nélkül 401-et kap", async () => {
            const res = await request(app)
                .post("/api/friends-with")
                .send({ sender_id: senderUser.ID, receiver_id: receiverUser.ID });

            expect(res.status).toBe(401);
        });
    });

    // ── GET /api/friends-with (admin) ─────────────────────────────────────────
    describe("GET /api/friends-with – teljes lista (admin)", () => {
        test("admin látja az összes barátkapcsolatot", async () => {
            const res = await request(app)
                .get("/api/friends-with")
                .set("Cookie", adminCookie);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(1);
        });

        test("sima felhasználó 401-et kap", async () => {
            const res = await request(app)
                .get("/api/friends-with")
                .set("Cookie", senderCookie);

            expect(res.status).toBe(401);
        });
    });

    // ── GET /api/friends-with/pending/:userId ─────────────────────────────────
    describe("GET /api/friends-with/pending/:userId", () => {
        test("fogadó félnél megjelenik a függő kérelem", async () => {
            const res = await request(app)
                .get(`/api/friends-with/pending/${receiverUser.ID}`)
                .set("Cookie", receiverCookie);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.some((r) => r.sender_id === senderUser.ID)).toBe(true);
        });

        test("elfogadott kérelem nem jelenik meg a pending listában", async () => {
            // Először elfogadás
            const record = await db.FriendWith.findOne({
                where: { sender_id: senderUser.ID, receiver_id: receiverUser.ID },
            });

            if (record) {
                await db.FriendWith.update({ status: "accepted" }, { where: { id: record.id } });

                const res = await request(app)
                    .get(`/api/friends-with/pending/${receiverUser.ID}`)
                    .set("Cookie", receiverCookie);

                expect(res.status).toBe(200);
                expect(res.body.every((r) => r.sender_id !== senderUser.ID)).toBe(true);

                // visszaállítás
                await db.FriendWith.update({ status: "sent" }, { where: { id: record.id } });
            }
        });
    });

    // ── GET /api/friends-with/accepted/:userId ────────────────────────────────
    describe("GET /api/friends-with/accepted/:userId", () => {
        test("elfogadott barátok listája visszaadható", async () => {
            const record = await db.FriendWith.findOne({
                where: { sender_id: senderUser.ID, receiver_id: receiverUser.ID },
            });

            if (record) {
                await db.FriendWith.update({ status: "accepted" }, { where: { id: record.id } });
            }

            const res = await request(app)
                .get(`/api/friends-with/accepted/${senderUser.ID}`)
                .set("Cookie", senderCookie);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);

            if (record) {
                await db.FriendWith.update({ status: "sent" }, { where: { id: record.id } });
            }
        });
    });

    // ── GET /api/friends-with/:id (admin) ─────────────────────────────────────
    describe("GET /api/friends-with/:id – egy rekord (admin)", () => {
        test("admin ID alapján lekérhet egy barátkapcsolatot", async () => {
            const record = await db.FriendWith.findOne({
                where: { sender_id: senderUser.ID, receiver_id: receiverUser.ID },
            });

            if (!record) return;

            const res = await request(app)
                .get(`/api/friends-with/${record.id}`)
                .set("Cookie", adminCookie);

            expect(res.status).toBe(200);
            expect(res.body.id).toBe(record.id);
        });

        test("nem létező rekord esetén 404-et ad vissza", async () => {
            const res = await request(app)
                .get("/api/friends-with/99999")
                .set("Cookie", adminCookie);

            expect(res.status).toBe(404);
        });
    });

    // ── PUT /api/friends-with/:id – kérelem frissítése ────────────────────────
    describe("PUT /api/friends-with/:id – állapot frissítése", () => {
        test("kérelem accepted státuszra frissíthető", async () => {
            const record = await db.FriendWith.findOne({
                where: { sender_id: senderUser.ID, receiver_id: receiverUser.ID },
            });

            if (!record) return;

            const res = await request(app)
                .put(`/api/friends-with/${record.id}`)
                .set("Cookie", receiverCookie)
                .send({ status: "accepted" });

            expect(res.status).toBe(200);
            expect(res.body.status).toBe("accepted");

            // visszaállítás
            await db.FriendWith.update({ status: "sent" }, { where: { id: record.id } });
        });

        test("érvénytelen status esetén hibát ad vissza", async () => {
            const record = await db.FriendWith.findOne({
                where: { sender_id: senderUser.ID, receiver_id: receiverUser.ID },
            });

            if (!record) return;

            const res = await request(app)
                .put(`/api/friends-with/${record.id}`)
                .set("Cookie", receiverCookie)
                .send({ status: "rejected" }); // nincs ilyen enum érték

            expect([400, 500]).toContain(res.status);
        });

        test("nem létező rekord esetén 404-et ad vissza", async () => {
            const res = await request(app)
                .put("/api/friends-with/99999")
                .set("Cookie", senderCookie)
                .send({ status: "accepted" });

            expect(res.status).toBe(404);
        });
    });

    // ── DELETE /api/friends-with/:id ──────────────────────────────────────────
    describe("DELETE /api/friends-with/:id – törlés", () => {
        test("barátkapcsolat törölhető", async () => {
            // új kérelem törlésteszteléshez
            const toDelete = await db.FriendWith.create({
                sender_id: receiverUser.ID,
                receiver_id: senderUser.ID,
                status: "sent",
            });

            const res = await request(app)
                .delete(`/api/friends-with/${toDelete.id}`)
                .set("Cookie", senderCookie);

            expect(res.status).toBe(200);

            const found = await db.FriendWith.findByPk(toDelete.id);
            expect(found).toBeNull();
        });

        test("nem létező rekord törlése 404-et ad vissza", async () => {
            const res = await request(app)
                .delete("/api/friends-with/99999")
                .set("Cookie", senderCookie);

            expect(res.status).toBe(404);
        });
    });
});
