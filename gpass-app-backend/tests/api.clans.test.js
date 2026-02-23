require("dotenv").config({ path: "./.env.test", quiet: true });

const request = require("supertest");
const app = require("../app");
const { cleanDb, createBaseUsers, db } = require("./api.helpers");

beforeAll(async () => {
    await db.sequelize.sync({ force: true });
});

afterAll(async () => {
    await db.sequelize.close();
});

describe("/api/clans", () => {
    let adminUser;
    let normalUser;
    let adminCookie;
    let userCookie;
    let testClan;

    beforeAll(async () => {
        await cleanDb();

        ({ adminUser, normalUser, adminCookie, userCookie } = await createBaseUsers({
            adminUsername: "clan_admin",
            adminEmail: "clan_admin@gpass.test",
            normalUsername: "clan_user",
            normalEmail: "clan_user@gpass.test",
        }));

        testClan = await db.Clan.create({
            name: "TestClan",
            leader_id: adminUser.ID,
        });
    });

    afterAll(async () => {
        await cleanDb();
    });

    // ── GET /api/clans ────────────────────────────────────────────────────────
    describe("GET /api/clans", () => {
        test("bejelentkezett user listázhatja a klánokat", async () => {
            const res = await request(app)
                .get("/api/clans")
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.some((c) => c.name === "TestClan")).toBe(true);
        });

        test("hitelesítés nélkül 401-et kap", async () => {
            const res = await request(app).get("/api/clans");
            expect(res.status).toBe(401);
        });
    });

    // ── GET /api/clans/search ─────────────────────────────────────────────────
    describe("GET /api/clans/search", () => {
        test("névtöredékre visszaadja a találatokat", async () => {
            const res = await request(app)
                .get("/api/clans/search?query=Test")
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.some((c) => c.name === "TestClan")).toBe(true);
        });

        test("nem létező névre üres tömböt ad vissza", async () => {
            const res = await request(app)
                .get("/api/clans/search?query=xxxxxxx_nem_letezik")
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(0);
        });

        test("üres query esetén 400-at ad vissza", async () => {
            const res = await request(app)
                .get("/api/clans/search")
                .set("Cookie", userCookie);

            expect(res.status).toBe(400);
        });
    });

    // ── GET /api/clans/:clanID ────────────────────────────────────────────────
    describe("GET /api/clans/:clanID", () => {
        test("klán lekérhető ID alapján", async () => {
            const res = await request(app)
                .get(`/api/clans/${testClan.id}`)
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);
            expect(res.body.name).toBe("TestClan");
            expect(res.body.leader_id).toBe(adminUser.ID);
        });

        test("nem létező klán esetén 404-et ad vissza", async () => {
            const res = await request(app)
                .get("/api/clans/99999")
                .set("Cookie", userCookie);

            expect(res.status).toBe(404);
        });
    });

    // ── POST /api/clans ───────────────────────────────────────────────────────
    describe("POST /api/clans – létrehozás", () => {
        test("bejelentkezett user klán hozhat létre", async () => {
            const res = await request(app)
                .post("/api/clans")
                .set("Cookie", userCookie)
                .send({ name: "BrandNewClan", leader_id: normalUser.ID });

            expect(res.status).toBe(201);
            expect(res.body.name).toBe("BrandNewClan");
            expect(res.body.leader_id).toBe(normalUser.ID);
        });

        test("hiányzó name esetén 400-at ad vissza", async () => {
            const res = await request(app)
                .post("/api/clans")
                .set("Cookie", userCookie)
                .send({ leader_id: normalUser.ID });

            expect(res.status).toBe(400);
        });

        test("hiányzó leader_id esetén 400-at ad vissza", async () => {
            const res = await request(app)
                .post("/api/clans")
                .set("Cookie", userCookie)
                .send({ name: "NoLeaderClan" });

            expect(res.status).toBe(400);
        });

        test("duplikált klán névvel 400-at ad vissza", async () => {
            const res = await request(app)
                .post("/api/clans")
                .set("Cookie", userCookie)
                .send({ name: "TestClan", leader_id: normalUser.ID }); // már létezik

            expect(res.status).toBe(400);
        });

        test("hitelesítés nélkül 401-et kap", async () => {
            const res = await request(app)
                .post("/api/clans")
                .send({ name: "UnauthorizedClan", leader_id: 1 });

            expect(res.status).toBe(401);
        });
    });

    // ── PUT /api/clans/:clanID ────────────────────────────────────────────────
    describe("PUT /api/clans/:clanID – frissítés", () => {
        test("klán neve sikeresen módosítható", async () => {
            const res = await request(app)
                .put(`/api/clans/${testClan.id}`)
                .set("Cookie", adminCookie)
                .send({ name: "UpdatedClan" });

            expect(res.status).toBe(200);
            expect(res.body.name).toBe("UpdatedClan");

            // visszaállítás
            await db.Clan.update({ name: "TestClan" }, { where: { id: testClan.id } });
        });

        test("nem létező klán módosítása 404-et ad vissza", async () => {
            const res = await request(app)
                .put("/api/clans/99999")
                .set("Cookie", adminCookie)
                .send({ name: "GhostClan" });

            expect(res.status).toBe(404);
        });
    });

    // ── DELETE /api/clans/:clanID ─────────────────────────────────────────────
    describe("DELETE /api/clans/:clanID", () => {
        test("bejelentkezett user törölheti a klánt", async () => {
            const toDelete = await db.Clan.create({
                name: "ClanToDelete",
                leader_id: adminUser.ID,
            });

            const res = await request(app)
                .delete(`/api/clans/${toDelete.id}`)
                .set("Cookie", adminCookie);

            expect(res.status).toBe(200);

            const found = await db.Clan.findByPk(toDelete.id);
            expect(found).toBeNull();
        });

        test("nem létező klán törlése 404-et ad vissza", async () => {
            const res = await request(app)
                .delete("/api/clans/99999")
                .set("Cookie", adminCookie);

            expect(res.status).toBe(404);
        });

        test("hitelesítés nélkül 401-et kap", async () => {
            const res = await request(app).delete(`/api/clans/${testClan.id}`);
            expect(res.status).toBe(401);
        });
    });
});
