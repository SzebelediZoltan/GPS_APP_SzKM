require("dotenv").config({
    quiet: true,
    path: "./.env.test",
});

const jwt = require("jsonwebtoken");

/**
 * Generál egy érvényes JWT tokent a tesztekhez.
 * @param {Object} overrides - Felülírható mezők (pl. isAdmin: false)
 */
function generateTestToken(overrides = {}) {
    const payload = {
        userID: 1,
        username: "testuser",
        isAdmin: true,
        email: "test@example.com",
        ...overrides,
    };

    return jwt.sign(payload, process.env.JWT_SECRET || "test_secret");
}

/**
 * Supertest requesthez hozzáadja az auth cookie-t.
 * Használat: withAuth(request(app).get("/api/users"))
 */
function withAuth(req, overrides = {}) {
    const token = generateTestToken(overrides);
    return req.set("Cookie", `user_token=${token}`);
}

module.exports = { generateTestToken, withAuth };
