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

describe("/api/markers", () => {
    let adminUser;
    let normalUser;
    let adminCookie;
    let userCookie;
    let testMarker;

    beforeAll(async () => {
        await cleanDb();

        ({ adminUser, normalUser, adminCookie, userCookie } = await createBaseUsers({
            adminUsername: "marker_admin",
            adminEmail: "marker_admin@gpass.test",
            normalUsername: "marker_user",
            normalEmail: "marker_user@gpass.test",
        }));

        testMarker = await db.Marker.create({
            creator_id: normalUser.ID,
            marker_type: "danger",
            lat: 47.497912,
            lng: 19.040235,
        });
    });

    afterAll(async () => {
        await cleanDb();
    });

    // ── GET /api/markers ──────────────────────────────────────────────────────
    describe("GET /api/markers – teljes lista (admin)", () => {
        test("admin látja az összes markert", async () => {
            const res = await request(app)
                .get("/api/markers")
                .set("Cookie", adminCookie);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(1);
        });

        test("sima felhasználó 401-et kap", async () => {
            const res = await request(app)
                .get("/api/markers")
                .set("Cookie", userCookie);

            expect(res.status).toBe(401);
        });

        test("hitelesítés nélkül 401-et kap", async () => {
            const res = await request(app).get("/api/markers");
            expect(res.status).toBe(401);
        });
    });

    // ── GET /api/markers/creator/:userId ──────────────────────────────────────
    describe("GET /api/markers/creator/:userId", () => {
        test("létrehozó szerint szűrve visszaadja a markereket", async () => {
            const res = await request(app)
                .get(`/api/markers/creator/${normalUser.ID}`)
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.every((m) => m.creator_id === normalUser.ID)).toBe(true);
        });

        test("nem létező creator esetén üres tömböt ad vissza", async () => {
            const res = await request(app)
                .get("/api/markers/creator/99999")
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(0);
        });
    });

    // ── GET /api/markers/type/:markerType ─────────────────────────────────────
    describe("GET /api/markers/type/:markerType", () => {
        test("típus szerint szűrve visszaadja a markereket", async () => {
            const res = await request(app)
                .get("/api/markers/type/danger")
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.every((m) => m.marker_type === "danger")).toBe(true);
        });

        test("nem szereplő típusnál üres tömböt ad vissza", async () => {
            const res = await request(app)
                .get("/api/markers/type/speedtrap")
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(0);
        });
    });

    // ── GET /api/markers/box ──────────────────────────────────────────────────
    describe("GET /api/markers/box – térbeli szűrés", () => {
        test("bounding box-on belüli markereket adja vissza", async () => {
            const res = await request(app)
                .get("/api/markers/box?minLat=47&maxLat=48&minLng=18&maxLng=20")
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.some((m) => m.id === testMarker.id)).toBe(true);
        });

        test("box-on kívüli markereket nem adja vissza", async () => {
            const res = await request(app)
                .get("/api/markers/box?minLat=60&maxLat=70&minLng=20&maxLng=30")
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(0);
        });
    });

    // ── GET /api/markers/:markerID ────────────────────────────────────────────
    describe("GET /api/markers/:markerID", () => {
        test("marker lekérhető ID alapján", async () => {
            const res = await request(app)
                .get(`/api/markers/${testMarker.id}`)
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);
            expect(res.body.id).toBe(testMarker.id);
            expect(res.body.marker_type).toBe("danger");
            expect(parseFloat(res.body.lat)).toBeCloseTo(47.497912, 4);
            expect(parseFloat(res.body.lng)).toBeCloseTo(19.040235, 4);
        });

        test("nem létező marker esetén 404-et ad vissza", async () => {
            const res = await request(app)
                .get("/api/markers/99999")
                .set("Cookie", userCookie);

            expect(res.status).toBe(404);
        });
    });

    // ── POST /api/markers ─────────────────────────────────────────────────────
    describe("POST /api/markers – létrehozás", () => {
        test.each([
            { marker_type: "danger",     lat: 47.5,  lng: 19.0 },
            { marker_type: "police",     lat: 47.6,  lng: 19.1 },
            { marker_type: "accident",   lat: 47.4,  lng: 18.9 },
            { marker_type: "traffic",    lat: 47.3,  lng: 18.8 },
            { marker_type: "speedtrap",  lat: 47.2,  lng: 18.7 },
            { marker_type: "roadblock",  lat: 47.1,  lng: 18.6 },
            { marker_type: "other",      lat: 47.0,  lng: 18.5 },
        ])("$marker_type típusú marker sikeresen létrehozható", async ({ marker_type, lat, lng }) => {
            const res = await request(app)
                .post("/api/markers")
                .set("Cookie", userCookie)
                .send({ creator_id: normalUser.ID, marker_type, lat, lng });

            expect(res.status).toBe(201);
            expect(res.body.marker_type).toBe(marker_type);
        });

        test("érvénytelen marker_type esetén hibát ad vissza", async () => {
            const res = await request(app)
                .post("/api/markers")
                .set("Cookie", userCookie)
                .send({ creator_id: normalUser.ID, marker_type: "invalid_type", lat: 47.5, lng: 19.0 });

            expect([400, 500]).toContain(res.status);
        });

        test("hiányzó lat esetén 400-at ad vissza", async () => {
            const res = await request(app)
                .post("/api/markers")
                .set("Cookie", userCookie)
                .send({ creator_id: normalUser.ID, marker_type: "danger", lng: 19.0 });

            expect(res.status).toBe(400);
        });

        test("hiányzó lng esetén 400-at ad vissza", async () => {
            const res = await request(app)
                .post("/api/markers")
                .set("Cookie", userCookie)
                .send({ creator_id: normalUser.ID, marker_type: "danger", lat: 47.5 });

            expect(res.status).toBe(400);
        });

        test("hiányzó creator_id esetén 400-at ad vissza", async () => {
            const res = await request(app)
                .post("/api/markers")
                .set("Cookie", userCookie)
                .send({ marker_type: "danger", lat: 47.5, lng: 19.0 });

            expect(res.status).toBe(400);
        });

        test("hitelesítés nélkül 401-et kap", async () => {
            const res = await request(app)
                .post("/api/markers")
                .send({ creator_id: normalUser.ID, marker_type: "danger", lat: 47.5, lng: 19.0 });

            expect(res.status).toBe(401);
        });
    });

    // ── PUT /api/markers/:markerID ────────────────────────────────────────────
    describe("PUT /api/markers/:markerID – frissítés", () => {
        test("marker score-ja frissíthető", async () => {
            const res = await request(app)
                .put(`/api/markers/${testMarker.id}`)
                .set("Cookie", userCookie)
                .send({ score: 5 });

            expect(res.status).toBe(200);
            expect(res.body.score).toBe(5);

            // visszaállítás
            await db.Marker.update({ score: 0 }, { where: { id: testMarker.id } });
        });

        test("nem létező marker módosítása 404-et ad vissza", async () => {
            const res = await request(app)
                .put("/api/markers/99999")
                .set("Cookie", userCookie)
                .send({ score: 1 });

            expect(res.status).toBe(404);
        });
    });

    // ── DELETE /api/markers/:markerID (admin) ─────────────────────────────────
    describe("DELETE /api/markers/:markerID – törlés (admin)", () => {
        test("admin sikeresen törölhet markert", async () => {
            const toDelete = await db.Marker.create({
                creator_id: normalUser.ID,
                marker_type: "other",
                lat: 48.0,
                lng: 20.0,
            });

            const res = await request(app)
                .delete(`/api/markers/${toDelete.id}`)
                .set("Cookie", adminCookie);

            expect(res.status).toBe(200);

            const found = await db.Marker.findByPk(toDelete.id);
            expect(found).toBeNull();
        });

        test("sima felhasználó 401-et kap törlésnél", async () => {
            const res = await request(app)
                .delete(`/api/markers/${testMarker.id}`)
                .set("Cookie", userCookie);

            expect(res.status).toBe(401);
        });

        test("nem létező marker törlése 404-et ad vissza", async () => {
            const res = await request(app)
                .delete("/api/markers/99999")
                .set("Cookie", adminCookie);

            expect(res.status).toBe(404);
        });
    });
});
