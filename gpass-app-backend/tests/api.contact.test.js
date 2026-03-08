require("dotenv").config({ path: "./.env.test", quiet: true });
const request = require("supertest");
const app = require("../app");
const db = require("../api/db");

const { transactionSetup, transactionTeardown } = require("./helpers/transactionHelper");

describe("/api/contact", () => {

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

        test("should send contact message", async () => {
            // Test implementation here
        });
    });
});
