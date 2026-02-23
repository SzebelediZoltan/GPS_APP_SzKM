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

describe("/api/trips", () => {
    let adminUser;
    let normalUser;
    let adminCookie;
    let userCookie;
    let testTrip;

    beforeAll(async () => {
        await cleanDb();

        ({ adminUser, normalUser, adminCookie, userCookie } = await createBaseUsers({
            adminUsername: "trip_admin",
            adminEmail: "trip_admin@gpass.test",
            normalUsername: "trip_user",
            normalEmail: "trip_user@gpass.test",
        }));

        testTrip = await db.Trip.create({
            user_id: normalUser.ID,
            trip_number: 1,
        });
    });

    afterAll(async () => {
        await cleanDb();
    });

    // ── GET /api/trips ────────────────────────────────────────────────────────
    describe("GET /api/trips", () => {
        test("bejelentkezett user látja az összes tripet", async () => {
            const res = await request(app)
                .get("/api/trips")
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.some((t) => t.id === testTrip.id)).toBe(true);
        });

        test("hitelesítés nélkül 401-et kap", async () => {
            const res = await request(app).get("/api/trips");
            expect(res.status).toBe(401);
        });
    });

    // ── GET /api/trips/by-user/:userId ────────────────────────────────────────
    describe("GET /api/trips/by-user/:userId", () => {
        test("user ID szerint szűrve visszaadja az utazásokat", async () => {
            const res = await request(app)
                .get(`/api/trips/by-user/${normalUser.ID}`)
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.every((t) => t.user_id === normalUser.ID)).toBe(true);
        });

        test("nem létező user esetén üres tömböt ad vissza", async () => {
            const res = await request(app)
                .get("/api/trips/by-user/99999")
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(0);
        });
    });

    // ── GET /api/trips/by-user/:userId/number/:tripNumber ─────────────────────
    describe("GET /api/trips/by-user/:userId/number/:tripNumber", () => {
        test("user + trip_number kombináció alapján lekérhető", async () => {
            const res = await request(app)
                .get(`/api/trips/by-user/${normalUser.ID}/number/1`)
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);
            expect(res.body.user_id).toBe(normalUser.ID);
            expect(res.body.trip_number).toBe(1);
        });

        test("nem létező kombináció esetén 404-et ad vissza", async () => {
            const res = await request(app)
                .get(`/api/trips/by-user/${normalUser.ID}/number/9999`)
                .set("Cookie", userCookie);

            expect(res.status).toBe(404);
        });
    });

    // ── GET /api/trips/:tripID ────────────────────────────────────────────────
    describe("GET /api/trips/:tripID", () => {
        test("trip lekérhető ID alapján", async () => {
            const res = await request(app)
                .get(`/api/trips/${testTrip.id}`)
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);
            expect(res.body.id).toBe(testTrip.id);
            expect(res.body.user_id).toBe(normalUser.ID);
            expect(res.body.trip_number).toBe(1);
        });

        test("nem létező trip esetén 404-et ad vissza", async () => {
            const res = await request(app)
                .get("/api/trips/99999")
                .set("Cookie", userCookie);

            expect(res.status).toBe(404);
        });
    });

    // ── POST /api/trips ───────────────────────────────────────────────────────
    describe("POST /api/trips – létrehozás", () => {
        test("bejelentkezett user utazást hozhat létre", async () => {
            const res = await request(app)
                .post("/api/trips")
                .set("Cookie", userCookie)
                .send({ user_id: normalUser.ID, trip_number: 2 });

            expect(res.status).toBe(201);
            expect(res.body.user_id).toBe(normalUser.ID);
            expect(res.body.trip_number).toBe(2);
        });

        test("hiányzó user_id esetén 400-at ad vissza", async () => {
            const res = await request(app)
                .post("/api/trips")
                .set("Cookie", userCookie)
                .send({ trip_number: 3 });

            expect(res.status).toBe(400);
        });

        test("hiányzó trip_number esetén 400-at ad vissza", async () => {
            const res = await request(app)
                .post("/api/trips")
                .set("Cookie", userCookie)
                .send({ user_id: normalUser.ID });

            expect(res.status).toBe(400);
        });

        test("duplikált user_id + trip_number kombináció esetén hibát ad vissza", async () => {
            const res = await request(app)
                .post("/api/trips")
                .set("Cookie", userCookie)
                .send({ user_id: normalUser.ID, trip_number: 1 }); // már létezik

            expect([400, 500]).toContain(res.status);
        });

        test("hitelesítés nélkül 401-et kap", async () => {
            const res = await request(app)
                .post("/api/trips")
                .send({ user_id: normalUser.ID, trip_number: 99 });

            expect(res.status).toBe(401);
        });
    });

    // ── PUT /api/trips/:tripID ────────────────────────────────────────────────
    describe("PUT /api/trips/:tripID – frissítés", () => {
        test("trip sorszáma sikeresen módosítható", async () => {
            const res = await request(app)
                .put(`/api/trips/${testTrip.id}`)
                .set("Cookie", userCookie)
                .send({ trip_number: 50 });

            expect(res.status).toBe(200);
            expect(res.body.trip_number).toBe(50);

            // visszaállítás
            await db.Trip.update({ trip_number: 1 }, { where: { id: testTrip.id } });
        });

        test("nem létező trip módosítása 404-et ad vissza", async () => {
            const res = await request(app)
                .put("/api/trips/99999")
                .set("Cookie", userCookie)
                .send({ trip_number: 5 });

            expect(res.status).toBe(404);
        });
    });

    // ── DELETE /api/trips/:tripID (admin) ─────────────────────────────────────
    describe("DELETE /api/trips/:tripID – törlés (admin)", () => {
        test("admin sikeresen törölhet utazást", async () => {
            const toDelete = await db.Trip.create({
                user_id: normalUser.ID,
                trip_number: 100,
            });

            const res = await request(app)
                .delete(`/api/trips/${toDelete.id}`)
                .set("Cookie", adminCookie);

            expect(res.status).toBe(200);

            const found = await db.Trip.findByPk(toDelete.id);
            expect(found).toBeNull();
        });

        test("sima felhasználó 401-et kap törlésnél", async () => {
            const res = await request(app)
                .delete(`/api/trips/${testTrip.id}`)
                .set("Cookie", userCookie);

            expect(res.status).toBe(401);
        });

        test("nem létező trip törlése 404-et ad vissza", async () => {
            const res = await request(app)
                .delete("/api/trips/99999")
                .set("Cookie", adminCookie);

            expect(res.status).toBe(404);
        });
    });
});
