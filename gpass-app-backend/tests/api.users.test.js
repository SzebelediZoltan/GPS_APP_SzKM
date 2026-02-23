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

describe("/api/users", () => {
    let adminUser;
    let normalUser;
    let adminCookie;
    let userCookie;

    beforeAll(async () => {
        await cleanDb();

        ({ adminUser, normalUser, adminCookie, userCookie } = await createBaseUsers({
            adminUsername: "users_admin",
            adminEmail: "users_admin@gpass.test",
            normalUsername: "users_normal",
            normalEmail: "users_normal@gpass.test",
        }));
    });

    afterAll(async () => {
        await cleanDb();
    });

    // ── POST /api/users ───────────────────────────────────────────────────────
    describe("POST /api/users – regisztráció", () => {
        test("új felhasználó sikeresen létrehozható", async () => {
            const res = await request(app)
                .post("/api/users")
                .send({
                    username: "brand_new_user",
                    email: "brand_new@gpass.test",
                    password: "NewPass1!",
                });

            expect(res.status).toBe(201);
            expect(res.body.username).toBe("brand_new_user");
            expect(res.body.email).toBe("brand_new@gpass.test");
            expect(res.body.password).toBeUndefined(); // jelszó nem kerül ki
        });

        test("hiányzó username esetén 400-at ad vissza", async () => {
            const res = await request(app)
                .post("/api/users")
                .send({ email: "no_name@gpass.test", password: "Pass1234!" });

            expect(res.status).toBe(400);
        });

        test("hiányzó jelszó esetén 400-at ad vissza", async () => {
            const res = await request(app)
                .post("/api/users")
                .send({ username: "no_pass_user", email: "no_pass@gpass.test" });

            expect(res.status).toBe(400);
        });

        test("hiányzó email esetén 400-at ad vissza", async () => {
            const res = await request(app)
                .post("/api/users")
                .send({ username: "no_email_user", password: "Pass1234!" });

            expect(res.status).toBe(400);
        });

        test("érvénytelen email formátum esetén hibát ad vissza", async () => {
            const res = await request(app)
                .post("/api/users")
                .send({ username: "bad_email_user", email: "not-an-email", password: "Pass1234!" });

            expect([400, 500]).toContain(res.status);
        });

        test("foglalt username esetén 400-at ad vissza", async () => {
            const res = await request(app)
                .post("/api/users")
                .send({ username: "users_admin", email: "other123@gpass.test", password: "Pass1234!" });

            expect(res.status).toBe(400);
        });

        test("foglalt email esetén 400-at ad vissza", async () => {
            const res = await request(app)
                .post("/api/users")
                .send({ username: "unique_new_name", email: "users_admin@gpass.test", password: "Pass1234!" });

            expect(res.status).toBe(400);
        });
    });

    // ── GET /api/users ────────────────────────────────────────────────────────
    describe("GET /api/users – lista (admin)", () => {
        test("admin jogosultsággal visszaadja az összes felhasználót", async () => {
            const res = await request(app)
                .get("/api/users")
                .set("Cookie", adminCookie);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(2);
        });

        test("sima felhasználó 401-et kap", async () => {
            const res = await request(app)
                .get("/api/users")
                .set("Cookie", userCookie);

            expect(res.status).toBe(401);
        });

        test("hitelesítés nélkül 401-et kap", async () => {
            const res = await request(app).get("/api/users");
            expect(res.status).toBe(401);
        });
    });

    // ── GET /api/users/search ─────────────────────────────────────────────────
    describe("GET /api/users/search", () => {
        test("query alapján visszaadja a megfelelő felhasználókat", async () => {
            const res = await request(app)
                .get("/api/users/search?query=users_normal")
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.some((u) => u.username === "users_normal")).toBe(true);
        });

        test("részleges névre is rátalál", async () => {
            const res = await request(app)
                .get("/api/users/search?query=users_")
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThanOrEqual(2);
        });

        test("üres query esetén 400-at ad vissza", async () => {
            const res = await request(app)
                .get("/api/users/search")
                .set("Cookie", userCookie);

            expect(res.status).toBe(400);
        });

        test("hitelesítés nélkül 401-et kap", async () => {
            const res = await request(app).get("/api/users/search?query=admin");
            expect(res.status).toBe(401);
        });
    });

    // ── GET /api/users/:userID ────────────────────────────────────────────────
    describe("GET /api/users/:userID", () => {
        test("bejelentkezett user lekérhet egy felhasználót ID alapján", async () => {
            const res = await request(app)
                .get(`/api/users/${normalUser.ID}`)
                .set("Cookie", userCookie);

            expect(res.status).toBe(200);
            expect(res.body.ID).toBe(normalUser.ID);
            expect(res.body.username).toBe("users_normal");
            expect(res.body.password).toBeUndefined();
        });

        test("nem létező felhasználó esetén 404-et ad vissza", async () => {
            const res = await request(app)
                .get("/api/users/99999")
                .set("Cookie", userCookie);

            expect(res.status).toBe(404);
        });

        test("hitelesítés nélkül 401-et kap", async () => {
            const res = await request(app).get(`/api/users/${normalUser.ID}`);
            expect(res.status).toBe(401);
        });
    });

    // ── PUT /api/users/:userID ────────────────────────────────────────────────
    describe("PUT /api/users/:userID – frissítés", () => {
        test("bejelentkezett user módosíthatja az adatait", async () => {
            const res = await request(app)
                .put(`/api/users/${normalUser.ID}`)
                .set("Cookie", userCookie)
                .send({ username: "users_normal_updated" });

            expect(res.status).toBe(200);
            expect(res.body.username).toBe("users_normal_updated");

            // visszaállítás
            await db.User.update({ username: "users_normal" }, { where: { ID: normalUser.ID } });
        });

        test("nem létező felhasználó módosítása 404-et ad vissza", async () => {
            const res = await request(app)
                .put("/api/users/99999")
                .set("Cookie", userCookie)
                .send({ username: "ghost_user" });

            expect(res.status).toBe(404);
        });

        test("már foglalt username-re módosítás 400-at ad vissza", async () => {
            const res = await request(app)
                .put(`/api/users/${normalUser.ID}`)
                .set("Cookie", userCookie)
                .send({ username: "users_admin" }); // már létezik

            expect(res.status).toBe(400);
        });
    });

    // ── DELETE /api/users/:userID ─────────────────────────────────────────────
    describe("DELETE /api/users/:userID – törlés (admin)", () => {
        test("admin sikeresen törölhet felhasználót", async () => {
            const toDelete = await db.User.create({
                username: "user_to_delete",
                email: "to_delete@gpass.test",
                password: "Delete1234!",
                isAdmin: false,
            });

            const res = await request(app)
                .delete(`/api/users/${toDelete.ID}`)
                .set("Cookie", adminCookie);

            expect(res.status).toBe(200);

            const found = await db.User.findByPk(toDelete.ID);
            expect(found).toBeNull();
        });

        test("sima felhasználó nem törölhet – 401-et kap", async () => {
            const res = await request(app)
                .delete(`/api/users/${adminUser.ID}`)
                .set("Cookie", userCookie);

            expect(res.status).toBe(401);
        });

        test("nem létező felhasználó törlése 404-et ad vissza", async () => {
            const res = await request(app)
                .delete("/api/users/99999")
                .set("Cookie", adminCookie);

            expect(res.status).toBe(404);
        });
    });
});
