require("dotenv").config({ path: "./.env.test", quiet: true });

const request = require("supertest");
const app = require("../app");
const { cleanDb, makeAuthCookie, db } = require("./api.helpers");

// ── Migráció ──────────────────────────────────────────────────────────────────
beforeAll(async () => {
    await db.sequelize.sync({ force: true });
});

afterAll(async () => {
    await db.sequelize.close();
});

// ── Teszt adatok ──────────────────────────────────────────────────────────────
describe("/api/auth", () => {
    let testUser;

    beforeAll(async () => {
        await cleanDb();

        testUser = await db.User.create({
            username: "auth_test_user",
            email: "auth@gpass.test",
            password: "TestPass1!",
            isAdmin: false,
        });
    });

    afterAll(async () => {
        await cleanDb();
    });

    // ── POST /api/auth/login ──────────────────────────────────────────────────
    describe("POST /api/auth/login", () => {
        test("sikeres bejelentkezés username-mel", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({ userID: "auth_test_user", password: "TestPass1!" });

            expect(res.status).toBe(200);
            expect(typeof res.body).toBe("string"); // JWT token
            expect(res.headers["set-cookie"]).toBeDefined();
            expect(res.headers["set-cookie"][0]).toMatch(/user_token=/);
        });

        test("sikeres bejelentkezés email-lel", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({ userID: "auth@gpass.test", password: "TestPass1!" });

            expect(res.status).toBe(200);
        });

        test("helytelen jelszóval 401-et ad vissza", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({ userID: "auth_test_user", password: "WrongPassword!" });

            expect(res.status).toBe(401);
        });

        test("nem létező felhasználóval 404-et ad vissza", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({ userID: "nobody_here", password: "Whatever1!" });

            expect(res.status).toBe(404);
        });

        test("hiányzó userID esetén 400-at ad vissza", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({ password: "TestPass1!" });

            expect(res.status).toBe(400);
        });
    });

    // ── GET /api/auth/status ──────────────────────────────────────────────────
    describe("GET /api/auth/status", () => {
        test("bejelentkezett user visszakapja saját adatait", async () => {
            const cookie = makeAuthCookie({
                ID: testUser.ID,
                username: testUser.username,
                email: testUser.email,
                isAdmin: testUser.isAdmin,
            });

            const res = await request(app)
                .get("/api/auth/status")
                .set("Cookie", cookie);

            expect(res.status).toBe(200);
            expect(res.body.username).toBe("auth_test_user");
            expect(res.body.email).toBe("auth@gpass.test");
        });

        test("cookie nélkül 401-et ad vissza", async () => {
            const res = await request(app).get("/api/auth/status");
            expect(res.status).toBe(401);
        });
    });

    // ── DELETE /api/auth/logout ───────────────────────────────────────────────
    describe("DELETE /api/auth/logout", () => {
        test("kijelentkezés törli a cookie-t", async () => {
            const cookie = makeAuthCookie({
                ID: testUser.ID,
                username: testUser.username,
                email: testUser.email,
                isAdmin: testUser.isAdmin,
            });

            const res = await request(app)
                .delete("/api/auth/logout")
                .set("Cookie", cookie);

            expect(res.status).toBe(200);
            const setCookie = res.headers["set-cookie"]?.[0] ?? "";
            expect(setCookie).toMatch(/user_token=;/);
        });

        test("bejelentkezés nélkül is 200-at ad vissza", async () => {
            const res = await request(app).delete("/api/auth/logout");
            expect(res.status).toBe(200);
        });
    });
});
