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

describe("/api/clan-members", () => {
    let adminUser;
    let normalUser;
    let secondUser;
    let adminCookie;
    let userCookie;
    let testClan;

    beforeAll(async () => {
        await cleanDb();

        ({ adminUser, normalUser, adminCookie, userCookie } = await createBaseUsers({
            adminUsername: "cm_admin",
            adminEmail: "cm_admin@gpass.test",
            normalUsername: "cm_user",
            normalEmail: "cm_user@gpass.test",
        }));

        secondUser = await db.User.create({
            username: "cm_second",
            email: "cm_second@gpass.test",
            password: "Second1234!",
            isAdmin: false,
        });

        testClan = await db.Clan.create({
            name: "MemberTestClan",
            leader_id: adminUser.ID,
        });
    });

    afterAll(async () => {
        await cleanDb();
    });

    // ── POST /api/clan-members ────────────────────────────────────────────────
    describe("POST /api/clan-members – tag hozzáadása", () => {
        test("bejelentkezett user csatlakozhat egy klánhoz", async () => {
            const res = await request(app)
                .post("/api/clan-members")
                .set("Cookie", userCookie)
                .send({ clan_id: testClan.id, user_id: normalUser.ID });

            expect(res.status).toBe(201);
            expect(res.body.clan_id).toBe(testClan.id);
            expect(res.body.user_id).toBe(normalUser.ID);
        });

        test("második felhasználó is csatlakozhat", async () => {
            const secondCookie = makeAuthCookie({
                ID: secondUser.ID,
                username: secondUser.username,
                email: secondUser.email,
                isAdmin: secondUser.isAdmin,
            });

            const res = await request(app)
                .post("/api/clan-members")
                .set("Cookie", secondCookie)
                .send({ clan_id: testClan.id, user_id: secondUser.ID });

            expect(res.status).toBe(201);
        });

        test("duplikált tagság esetén hibát ad vissza", async () => {
            const res = await request(app)
                .post("/api/clan-members")
                .set("Cookie", userCookie)
                .send({ clan_id: testClan.id, user_id: normalUser.ID }); // már tag

            expect([400, 500]).toContain(res.status);
        });

        test("hiányzó clan_id esetén 400-at ad vissza", async () => {
            const res = await request(app)
                .post("/api/clan-members")
                .set("Cookie", userCookie)
                .send({ user_id: normalUser.ID });

            expect(res.status).toBe(400);
        });

        test("hiányzó user_id esetén 400-at ad vissza", async () => {
            const res = await request(app)
                .post("/api/clan-members")
                .set("Cookie", userCookie)
                .send({ clan_id: testClan.id });

            expect(res.status).toBe(400);
        });

        test("hitelesítés nélkül 401-et kap", async () => {
            const res = await request(app)
                .post("/api/clan-members")
                .send({ clan_id: testClan.id, user_id: normalUser.ID });

            expect(res.status).toBe(401);
        });
    });

    // ── GET /api/clan-members (admin) ─────────────────────────────────────────
    describe("GET /api/clan-members – teljes lista (admin)", () => {
        test("admin látja az összes klántagságot", async () => {
            const res = await request(app)
                .get("/api/clan-members")
                .set("Cookie", adminCookie);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        test("sima user 401-et kap", async () => {
            const res = await request(app)
                .get("/api/clan-members")
                .set("Cookie", userCookie);

            expect(res.status).toBe(401);
        });
    });

    // ── GET /api/clan-members/by-clan/:clanId ─────────────────────────────────
    describe("GET /api/clan-members/by-clan/:clanId", () => {
        test("klán tagjainak listája visszaadható", async () => {
            const res = await request(app)
                .get(`/api/clan-members/by-clan/${testClan.id}`)
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.some((m) => m.user_id === normalUser.ID)).toBe(true);
            expect(res.body.some((m) => m.user_id === secondUser.ID)).toBe(true);
        });

        test("nem létező klán esetén üres tömböt vagy 404-et ad", async () => {
            const res = await request(app)
                .get("/api/clan-members/by-clan/99999")
                .set("Cookie", userCookie);

            expect([200, 404]).toContain(res.status);
            if (res.status === 200) expect(res.body).toHaveLength(0);
        });
    });

    // ── GET /api/clan-members/by-user/:userId ─────────────────────────────────
    describe("GET /api/clan-members/by-user/:userId", () => {
        test("user klántagságainak listája visszaadható", async () => {
            const res = await request(app)
                .get(`/api/clan-members/by-user/${normalUser.ID}`)
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.some((m) => m.clan_id === testClan.id)).toBe(true);
        });
    });

    // ── GET /api/clan-members/:clanId/:userId ─────────────────────────────────
    describe("GET /api/clan-members/:clanId/:userId – konkrét tagság", () => {
        test("konkrét tagság lekérhető", async () => {
            const res = await request(app)
                .get(`/api/clan-members/${testClan.id}/${normalUser.ID}`)
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);
            expect(res.body.clan_id).toBe(testClan.id);
            expect(res.body.user_id).toBe(normalUser.ID);
        });

        test("nem létező tagság esetén 404-et ad vissza", async () => {
            const res = await request(app)
                .get(`/api/clan-members/${testClan.id}/99999`)
                .set("Cookie", userCookie);

            expect(res.status).toBe(404);
        });
    });

    // ── DELETE /api/clan-members/:clanId/:userId ──────────────────────────────
    describe("DELETE /api/clan-members/:clanId/:userId – tagság törlése", () => {
        test("tagság sikeresen törölhető", async () => {
            const res = await request(app)
                .delete(`/api/clan-members/${testClan.id}/${secondUser.ID}`)
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);

            const found = await db.ClanMember.findOne({
                where: { clan_id: testClan.id, user_id: secondUser.ID },
            });
            expect(found).toBeNull();
        });

        test("nem létező tagság törlése 404-et ad vissza", async () => {
            const res = await request(app)
                .delete(`/api/clan-members/${testClan.id}/99999`)
                .set("Cookie", userCookie);

            expect(res.status).toBe(404);
        });
    });
});
