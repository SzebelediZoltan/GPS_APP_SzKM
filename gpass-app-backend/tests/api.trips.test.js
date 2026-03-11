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
        username: overrides.username || "tripuser",
        email: overrides.email || "tripuser@example.com",
        password: hashedPassword,
        isAdmin: overrides.isAdmin ?? false,
    }, { transaction: t });
};

const createTestTrip = async (app, userId, overrides = {}) => {
    const t = app.get("getTransaction")();
    return db.Trip.create({
        user_id: userId,
        trip_name: overrides.trip_name || "TestTrip",
    }, { transaction: t });
};

describe("/api/trips", () => {

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

        test("should get all trips", async () => {
            const user = await createTestUser(app, { username: "triplist", email: "triplist@example.com" });
            const token = makeToken(user);
            await createTestTrip(app, user.ID, { trip_name: "ListTrip" });

            const res = await request(app)
                .get("/api/trips")
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

        test("should create trip", async () => {
            const user = await createTestUser(app, { username: "tripmaker", email: "tripmaker@example.com" });
            const token = makeToken(user);

            const res = await request(app)
                .post("/api/trips")
                .set("Cookie", `user_token=${token}`)
                .send({ user_id: user.ID, trip_name: "MyNewTrip" });

            expect(res.status).toBe(201);
            expect(res.body.trip_name).toBe("MyNewTrip");
            expect(res.body.user_id).toBe(user.ID);
        });
    });

    describe("/by-user/:userId", () => {
        describe("GET", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should get trips by user", async () => {
                const user = await createTestUser(app, { username: "tripbyuser", email: "tripbyuser@example.com" });
                const token = makeToken(user);
                await createTestTrip(app, user.ID, { trip_name: "UserTrip1" });
                await createTestTrip(app, user.ID, { trip_name: "UserTrip2" });

                const res = await request(app)
                    .get(`/api/trips/by-user/${user.ID}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body.length).toBeGreaterThanOrEqual(2);
            });
        });
    });

    describe("/by-user/:userId/name/:tripName", () => {
        describe("GET", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should get trip by user and name", async () => {
                const user = await createTestUser(app, { username: "tripbyname", email: "tripbyname@example.com" });
                const token = makeToken(user);
                const trip = await createTestTrip(app, user.ID, { trip_name: "NamedTrip" });

                const res = await request(app)
                    .get(`/api/trips/by-user/${user.ID}/name/${trip.trip_name}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
            });
        });
    });

    describe("/:tripID", () => {

        describe("GET", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should get trip by ID", async () => {
                const user = await createTestUser(app, { username: "tripgetone", email: "tripgetone@example.com" });
                const token = makeToken(user);
                const trip = await createTestTrip(app, user.ID, { trip_name: "GetOneTrip" });

                const res = await request(app)
                    .get(`/api/trips/${trip.id}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
                expect(res.body.trip_name).toBe("GetOneTrip");
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

            test("should update trip", async () => {
                const user = await createTestUser(app, { username: "tripupdater", email: "tripupdater@example.com" });
                const token = makeToken(user);
                const trip = await createTestTrip(app, user.ID, { trip_name: "UpdateTrip" });

                const res = await request(app)
                    .put(`/api/trips/${trip.id}`)
                    .set("Cookie", `user_token=${token}`)
                    .send({ user_id: user.ID, trip_name: "UpdatedTrip" });

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

            test("should delete trip", async () => {
                const admin = await createTestUser(app, { username: "tripadmin", email: "tripadmin@example.com", isAdmin: true });
                const token = makeToken(admin);
                const owner = await createTestUser(app, { username: "tripowner", email: "tripowner@example.com" });
                const trip = await createTestTrip(app, owner.ID, { trip_name: "DeleteTrip" });

                const res = await request(app)
                    .delete(`/api/trips/${trip.id}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
            });
        });
    });
});