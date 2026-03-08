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
        username: overrides.username || "tpuser",
        email: overrides.email || "tpuser@example.com",
        password: hashedPassword,
        isAdmin: overrides.isAdmin ?? false,
    }, { transaction: t });
};

const createTestTrip = async (app, userId, overrides = {}) => {
    const t = app.get("getTransaction")();
    return db.Trip.create({
        user_id: userId,
        trip_name: overrides.trip_name || "TPTrip",
    }, { transaction: t });
};

const createTestTripPoint = async (app, tripId, overrides = {}) => {
    const t = app.get("getTransaction")();
    return db.TripPoint.create({
        trip_id: tripId,
        lat: overrides.lat ?? 47.5,
        lng: overrides.lng ?? 19.1,
    }, { transaction: t });
};

describe("/api/trip-points", () => {

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

        test("should get all trip points", async () => {
            const user = await createTestUser(app, { username: "tplist", email: "tplist@example.com" });
            const token = makeToken(user);
            const trip = await createTestTrip(app, user.ID, { trip_name: "TPListTrip" });
            await createTestTripPoint(app, trip.id);

            const res = await request(app)
                .get("/api/trip-points")
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

        test("should create trip point", async () => {
            const user = await createTestUser(app, { username: "tpmaker", email: "tpmaker@example.com" });
            const token = makeToken(user);
            const trip = await createTestTrip(app, user.ID, { trip_name: "TPMakeTrip" });

            const res = await request(app)
                .post("/api/trip-points")
                .set("Cookie", `user_token=${token}`)
                .send({ trip_id: trip.id, lat: 47.6, lng: 19.2 });

            expect(res.status).toBe(201);
            expect(Number(res.body.lat)).toBeCloseTo(47.6, 3);
            expect(Number(res.body.lng)).toBeCloseTo(19.2, 3);
        });
    });

    describe("/by-trip/:tripId", () => {
        describe("GET", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should get points by trip", async () => {
                const user = await createTestUser(app, { username: "tpbytrip", email: "tpbytrip@example.com" });
                const token = makeToken(user);
                const trip = await createTestTrip(app, user.ID, { trip_name: "TPByTrip" });
                await createTestTripPoint(app, trip.id, { lat: 47.1, lng: 19.1 });
                await createTestTripPoint(app, trip.id, { lat: 47.2, lng: 19.2 });

                const res = await request(app)
                    .get(`/api/trip-points/by-trip/${trip.id}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body.length).toBeGreaterThanOrEqual(2);
            });
        });
    });

    describe("/:pointID", () => {

        describe("GET", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should get trip point by ID", async () => {
                const user = await createTestUser(app, { username: "tpgetone", email: "tpgetone@example.com" });
                const token = makeToken(user);
                const trip = await createTestTrip(app, user.ID, { trip_name: "TPGetOne" });
                const point = await createTestTripPoint(app, trip.id);

                const res = await request(app)
                    .get(`/api/trip-points/${point.id}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
                expect(res.body.id).toBe(point.id);
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

            test("should update trip point", async () => {
                const user = await createTestUser(app, { username: "tpupdater", email: "tpupdater@example.com" });
                const token = makeToken(user);
                const trip = await createTestTrip(app, user.ID, { trip_name: "TPUpdate" });
                const point = await createTestTripPoint(app, trip.id);

                const res = await request(app)
                    .put(`/api/trip-points/${point.id}`)
                    .set("Cookie", `user_token=${token}`)
                    .send({ trip_id: trip.id, lat: 48.0, lng: 20.0 });

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

            test("should delete trip point", async () => {
                const admin = await createTestUser(app, { username: "tpadmin", email: "tpadmin@example.com", isAdmin: true });
                const token = makeToken(admin);
                const owner = await createTestUser(app, { username: "tpowner", email: "tpowner@example.com" });
                const trip = await createTestTrip(app, owner.ID, { trip_name: "TPDelete" });
                const point = await createTestTripPoint(app, trip.id);

                const res = await request(app)
                    .delete(`/api/trip-points/${point.id}`)
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
            });
        });
    });
});