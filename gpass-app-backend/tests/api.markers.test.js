require("dotenv").config({ path: "./.env.test", quiet: true });
const request = require("supertest");
const app = require("../app");
const db = require("../api/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { transactionSetup, transactionTeardown } = require("./helpers/transactionHelper");

const makeToken = (user) =>
    jwt.sign(
        { userID: user.ID, username: user.username, isAdmin: user.isAdmin, email: user.email },
        process.env.JWT_SECRET
    );

const createTestUser = async (app, overrides = {}) => {
    const t = app.get("getTransaction")();
    const hashedPassword = await bcrypt.hash("TestPassword123", 10);
    return db.User.create({
        username: overrides.username || "markeruser",
        email: overrides.email || "markeruser@example.com",
        password: hashedPassword,
        isAdmin: overrides.isAdmin ?? false,
    }, { transaction: t });
};

const createTestMarker = async (app, creatorId, overrides = {}) => {
    const t = app.get("getTransaction")();
    return db.Marker.create({
        creator_id: creatorId,
        marker_type: overrides.marker_type || "danger",
        lat: overrides.lat ?? 47.5,
        lng: overrides.lng ?? 19.1,
        score: overrides.score ?? 0,
    }, { transaction: t });
};

describe("/api/markers", () => {

    afterEach(async () => {
        jest.restoreAllMocks()
    });

    describe("GET", () => {
        beforeEach(async () => {
            await transactionSetup(app, db);
        });

        afterEach(async () => {
            await transactionTeardown(app);
            jest.restoreAllMocks()
        });

        test("should get all markers", async () => {
            const admin = await createTestUser(app, { username: "markeradmin", email: "markeradmin@example.com", isAdmin: true });
            const token = makeToken(admin);
            await createTestMarker(app, admin.ID);

            const res = await request(app)
                .get("/api/markers")
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
            jest.restoreAllMocks()
        });

        test("should create marker", async () => {
            const user = await createTestUser(app, { username: "markermaker", email: "markermaker@example.com" });
            const token = makeToken(user);

            const res = await request(app)
                .post("/api/markers")
                .set("Cookie", `user_token=${token}`)
                .send({ creator_id: user.ID, marker_type: "police", lat: 47.5, lng: 19.0 });

            expect(res.status).toBe(201);
            expect(res.body.marker_type).toBe("police");
        });
    });

    describe("/box", () => {
        describe("GET", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should get markers in box", async () => {
                const user = await createTestUser(app, { username: "boxuser", email: "boxuser@example.com" });
                const token = makeToken(user);
                await createTestMarker(app, user.ID, { lat: 47.5, lng: 19.1 });

                const res = await request(app)
                    .get("/api/markers/box?minLat=47&maxLat=48&minLng=19&maxLng=20")
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
            });
        });
    });

    describe("/type/:markerType", () => {
        describe("GET", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should get markers by type", async () => {
                const user = await createTestUser(app, { username: "typeuser", email: "typeuser@example.com" });
                const token = makeToken(user);
                await createTestMarker(app, user.ID, { marker_type: "accident" });

                const res = await request(app)
                    .get("/api/markers/type/accident")
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
                res.body.forEach(m => expect(m.marker_type).toBe("accident"));
            });
        });
    });

    describe("/creator/:userId", () => {
        describe("GET", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should get markers by creator", async () => {
                const user = await createTestUser(app, { username: "creatoruser", email: "creatoruser@example.com" });
                const token = makeToken(user);
                await createTestMarker(app, user.ID, { marker_type: "traffic" });

                const res = await request(app)
                    .get(`/api/markers/creator/${user.ID}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
            });
        });
    });

    describe("/:markerID", () => {

        describe("GET", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should get marker by ID", async () => {
                const user = await createTestUser(app, { username: "markergetone", email: "markergetone@example.com" });
                const token = makeToken(user);
                const marker = await createTestMarker(app, user.ID, { marker_type: "roadblock" });

                const res = await request(app)
                    .get(`/api/markers/${marker.id}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
                expect(res.body.marker_type).toBe("roadblock");
            });
        });

        describe("PUT", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should update marker", async () => {
                const user = await createTestUser(app, { username: "markerupdater", email: "markerupdater@example.com" });
                const token = makeToken(user);
                const marker = await createTestMarker(app, user.ID, { marker_type: "speedtrap" });

                const res = await request(app)
                    .put(`/api/markers/${marker.id}`)
                    .set("Cookie", `user_token=${token}`)
                    .send({ creator_id: user.ID, marker_type: "other", lat: 47.6, lng: 19.2 });

                expect(res.status).toBe(200);
            });
        });

        describe("DELETE", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should delete marker", async () => {
                const admin = await createTestUser(app, { username: "markerdeladmin", email: "markerdeladmin@example.com", isAdmin: true });
                const token = makeToken(admin);
                const marker = await createTestMarker(app, admin.ID);

                const res = await request(app)
                    .delete(`/api/markers/${marker.id}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
            });
        });
    });
});