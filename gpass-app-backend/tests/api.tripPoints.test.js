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

describe("/api/trip-points", () => {
    let adminUser;
    let normalUser;
    let adminCookie;
    let userCookie;
    let testTrip;
    let testPoint;

    beforeAll(async () => {
        await cleanDb();

        ({ adminUser, normalUser, adminCookie, userCookie } = await createBaseUsers({
            adminUsername: "tp_admin",
            adminEmail: "tp_admin@gpass.test",
            normalUsername: "tp_user",
            normalEmail: "tp_user@gpass.test",
        }));

        testTrip = await db.Trip.create({
            user_id: normalUser.ID,
            trip_number: 1,
        });

        testPoint = await db.TripPoint.create({
            trip_id: testTrip.id,
            lat: 47.497912,
            lng: 19.040235,
        });
    });

    afterAll(async () => {
        await cleanDb();
    });

    // ── GET /api/trip-points ──────────────────────────────────────────────────
    describe("GET /api/trip-points – teljes lista", () => {
        test("bejelentkezett user látja az összes pontot", async () => {
            const res = await request(app)
                .get("/api/trip-points")
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.some((p) => p.id === testPoint.id)).toBe(true);
        });

        test("hitelesítés nélkül 401-et kap", async () => {
            const res = await request(app).get("/api/trip-points");
            expect(res.status).toBe(401);
        });
    });

    // ── GET /api/trip-points/by-trip/:tripId ──────────────────────────────────
    describe("GET /api/trip-points/by-trip/:tripId", () => {
        test("trip alapján visszaadja a pontokat", async () => {
            const res = await request(app)
                .get(`/api/trip-points/by-trip/${testTrip.id}`)
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.every((p) => p.trip_id === testTrip.id)).toBe(true);
        });

        test("nem létező trip esetén üres tömböt ad vissza", async () => {
            const res = await request(app)
                .get("/api/trip-points/by-trip/99999")
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(0);
        });
    });

    // ── GET /api/trip-points/:pointID ─────────────────────────────────────────
    describe("GET /api/trip-points/:pointID", () => {
        test("pont lekérhető ID alapján", async () => {
            const res = await request(app)
                .get(`/api/trip-points/${testPoint.id}`)
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);
            expect(res.body.id).toBe(testPoint.id);
            expect(res.body.trip_id).toBe(testTrip.id);
            expect(parseFloat(res.body.lat)).toBeCloseTo(47.497912, 4);
            expect(parseFloat(res.body.lng)).toBeCloseTo(19.040235, 4);
        });

        test("nem létező pont esetén 404-et ad vissza", async () => {
            const res = await request(app)
                .get("/api/trip-points/99999")
                .set("Cookie", userCookie);

            expect(res.status).toBe(404);
        });
    });

    // ── POST /api/trip-points ─────────────────────────────────────────────────
    describe("POST /api/trip-points – létrehozás", () => {
        test("bejelentkezett user útvonalpontot hozhat létre", async () => {
            const res = await request(app)
                .post("/api/trip-points")
                .set("Cookie", userCookie)
                .send({ trip_id: testTrip.id, lat: 47.5, lng: 19.05 });

            expect(res.status).toBe(201);
            expect(res.body.trip_id).toBe(testTrip.id);
            expect(parseFloat(res.body.lat)).toBeCloseTo(47.5, 2);
            expect(parseFloat(res.body.lng)).toBeCloseTo(19.05, 2);
        });

        test("több pont is felvehető ugyanahhoz a triphez", async () => {
            const points = [
                { lat: 47.51, lng: 19.06 },
                { lat: 47.52, lng: 19.07 },
                { lat: 47.53, lng: 19.08 },
            ];

            for (const point of points) {
                const res = await request(app)
                    .post("/api/trip-points")
                    .set("Cookie", userCookie)
                    .send({ trip_id: testTrip.id, ...point });

                expect(res.status).toBe(201);
            }
        });

        test("hiányzó trip_id esetén 400-at ad vissza", async () => {
            const res = await request(app)
                .post("/api/trip-points")
                .set("Cookie", userCookie)
                .send({ lat: 47.5, lng: 19.05 });

            expect(res.status).toBe(400);
        });

        test("hiányzó lat esetén 400-at ad vissza", async () => {
            const res = await request(app)
                .post("/api/trip-points")
                .set("Cookie", userCookie)
                .send({ trip_id: testTrip.id, lng: 19.05 });

            expect(res.status).toBe(400);
        });

        test("hiányzó lng esetén 400-at ad vissza", async () => {
            const res = await request(app)
                .post("/api/trip-points")
                .set("Cookie", userCookie)
                .send({ trip_id: testTrip.id, lat: 47.5 });

            expect(res.status).toBe(400);
        });

        test("érvénytelen koordináta esetén hibát ad vissza", async () => {
            const res = await request(app)
                .post("/api/trip-points")
                .set("Cookie", userCookie)
                .send({ trip_id: testTrip.id, lat: 200, lng: 19.05 }); // lat > 90

            expect([400, 500]).toContain(res.status);
        });

        test("hitelesítés nélkül 401-et kap", async () => {
            const res = await request(app)
                .post("/api/trip-points")
                .send({ trip_id: testTrip.id, lat: 47.5, lng: 19.05 });

            expect(res.status).toBe(401);
        });
    });

    // ── PUT /api/trip-points/:pointID ─────────────────────────────────────────
    describe("PUT /api/trip-points/:pointID – frissítés", () => {
        test("pont koordinátái frissíthetők", async () => {
            const res = await request(app)
                .put(`/api/trip-points/${testPoint.id}`)
                .set("Cookie", userCookie)
                .send({ lat: 48.0, lng: 20.0 });

            expect(res.status).toBe(200);
            expect(parseFloat(res.body.lat)).toBeCloseTo(48.0, 2);
            expect(parseFloat(res.body.lng)).toBeCloseTo(20.0, 2);

            // visszaállítás
            await db.TripPoint.update(
                { lat: 47.497912, lng: 19.040235 },
                { where: { id: testPoint.id } }
            );
        });

        test("nem létező pont módosítása 404-et ad vissza", async () => {
            const res = await request(app)
                .put("/api/trip-points/99999")
                .set("Cookie", userCookie)
                .send({ lat: 47.5, lng: 19.0 });

            expect(res.status).toBe(404);
        });
    });

    // ── DELETE /api/trip-points/:pointID (admin) ──────────────────────────────
    describe("DELETE /api/trip-points/:pointID – törlés (admin)", () => {
        test("admin sikeresen törölhet pontot", async () => {
            const toDelete = await db.TripPoint.create({
                trip_id: testTrip.id,
                lat: 49.0,
                lng: 21.0,
            });

            const res = await request(app)
                .delete(`/api/trip-points/${toDelete.id}`)
                .set("Cookie", adminCookie);

            expect(res.status).toBe(200);

            const found = await db.TripPoint.findByPk(toDelete.id);
            expect(found).toBeNull();
        });

        test("sima felhasználó 401-et kap törlésnél", async () => {
            const res = await request(app)
                .delete(`/api/trip-points/${testPoint.id}`)
                .set("Cookie", userCookie);

            expect(res.status).toBe(401);
        });

        test("nem létező pont törlése 404-et ad vissza", async () => {
            const res = await request(app)
                .delete("/api/trip-points/99999")
                .set("Cookie", adminCookie);

            expect(res.status).toBe(404);
        });
    });
});
