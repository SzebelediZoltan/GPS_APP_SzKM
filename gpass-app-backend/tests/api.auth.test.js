require("dotenv").config({ path: "./.env.test", quiet: true });
const request = require("supertest");
const app = require("../app");
const db = require("../api/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { transactionSetup, transactionTeardown } = require("./helpers/transactionHelper");

describe("/api/auth", () => {

    afterEach(async () => {
        jest.restoreAllMocks()
    });

    describe("/login", () => {

        afterEach(async () => {
            jest.restoreAllMocks()
        });

        describe("POST", () => {
            beforeEach(async () => {
                await transactionSetup(app, db);
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should set cookie on successful login", async () => {
                // Service mock csak login teszthez
                jest.mock("../api/services", () => {
                    return (database) => ({
                        userService: {
                            getUserForAuth: jest.fn().mockResolvedValue({
                                ID: 1,
                                username: "testuser",
                                email: "test@example.com",
                                password: "TestPassword123",
                                isAdmin: false,
                            })
                        }
                    });
                });

                // Bcrypt mock csak login teszthez
                jest.mock("bcrypt", () => ({
                    ...jest.requireActual("bcrypt"),
                    compare: jest.fn().mockResolvedValue(true),
                }));
                
                // Login kérés
                const res = await request(app)
                    .post("/api/auth/login")
                    .send({
                        userID: "testuser",
                        password: "TestPassword123"
                    });

                // Ellenőrzések
                expect(res.status).toBe(200);
                expect(res.headers["set-cookie"]).toBeDefined();
                expect(res.headers["set-cookie"][0]).toMatch(/user_token=/);
                expect(typeof res.body).toBe("string");
            });
        })
    })

    describe("/status", () => {
        describe("GET", () => {
            let testUser;
            let token;

            beforeEach(async () => {
                await transactionSetup(app, db);

                const t = app.get("getTransaction")();
                const hashedPassword = await bcrypt.hash("TestPassword123", 10);

                testUser = await db.User.create({
                    username: "statustest",
                    email: "status@example.com",
                    password: hashedPassword,
                    isAdmin: false,
                }, { transaction: t });

                // Valódi JWT token generálása
                token = jwt.sign(
                    {
                        userID: testUser.ID,
                        username: testUser.username,
                        isAdmin: testUser.isAdmin,
                        email: testUser.email
                    },
                    process.env.JWT_SECRET
                );
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should return user data on valid token", async () => {
                const res = await request(app)
                    .get("/api/auth/status")
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
                expect(res.body.username).toBe("statustest");
                expect(res.body.email).toBe("status@example.com");
                expect(res.body.isAdmin).toBe(false);
            });

            test("should return 401 without token", async () => {
                const res = await request(app)
                    .get("/api/auth/status");

                expect(res.status).toBe(401);
            });
        })
    })

    describe("/logout", () => {
        describe("DELETE", () => {
            let testUser;
            let token;

            beforeEach(async () => {
                await transactionSetup(app, db);

                const t = app.get("getTransaction")();
                const hashedPassword = await bcrypt.hash("TestPassword123", 10);

                testUser = await db.User.create({
                    username: "logouttest",
                    email: "logout@example.com",
                    password: hashedPassword,
                    isAdmin: false,
                }, { transaction: t });

                // Valódi JWT token generálása
                token = jwt.sign(
                    {
                        userID: testUser.ID,
                        username: testUser.username,
                        isAdmin: testUser.isAdmin,
                        email: testUser.email
                    },
                    process.env.JWT_SECRET
                );
            });

            afterEach(async () => {
                await transactionTeardown(app);
                jest.restoreAllMocks()
            });

            test("should clear cookie on logout", async () => {
                const res = await request(app)
                    .delete("/api/auth/logout")
                    .set("Cookie", `user_token=${token}`);

                expect(res.status).toBe(200);
                expect(res.headers["set-cookie"]).toBeDefined();
                expect(res.headers["set-cookie"][0]).toMatch(/user_token=;/);
            });

            test("should return 200 even without token", async () => {
                const res = await request(app)
                    .delete("/api/auth/logout");

                expect(res.status).toBe(200);
            });
        })
    })

})