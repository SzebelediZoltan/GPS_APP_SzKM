require("dotenv").config({
    path: "./.env.test",
    quiet: true,
});

const db = require("../api/db");
const authUtils = require("../api/utilities/authUtils");

/**
 * JWT cookie stringet generál egy teszt userhez.
 * @param {{ ID, username, email, isAdmin }} user
 * @returns {string}  pl. "user_token=eyJ..."
 */
function makeAuthCookie(user) {
    const token = authUtils.generateUserToken(user);
    return `user_token=${token}`;
}

/**
 * Az összes táblát truncate-eli a megfelelő sorrendben,
 * hogy a foreign key constraint ne akadályozza.
 */
async function cleanDb() {
    await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await db.TripPoint.destroy({ where: {}, truncate: true, force: true });
    await db.Trip.destroy({ where: {}, truncate: true, force: true });
    await db.FriendWith.destroy({ where: {}, truncate: true, force: true });
    await db.ClanMember.destroy({ where: {}, truncate: true, force: true });
    await db.Clan.destroy({ where: {}, truncate: true, force: true });
    await db.Marker.destroy({ where: {}, truncate: true, force: true });
    await db.User.destroy({ where: {}, truncate: true, force: true });
    await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
}

/**
 * Admin és sima user létrehozása a DB-ben, cookie-k visszaadása.
 * @returns {{ adminUser, normalUser, adminCookie, userCookie }}
 */
async function createBaseUsers({ adminUsername, adminEmail, normalUsername, normalEmail } = {}) {
    const adminUser = await db.User.create({
        username: adminUsername ?? "test_admin",
        email: adminEmail ?? "test_admin@gpass.test",
        password: "Admin1234!",
        isAdmin: true,
    });

    const normalUser = await db.User.create({
        username: normalUsername ?? "test_user",
        email: normalEmail ?? "test_user@gpass.test",
        password: "User1234!",
        isAdmin: false,
    });

    const adminCookie = makeAuthCookie({
        ID: adminUser.ID,
        username: adminUser.username,
        email: adminUser.email,
        isAdmin: adminUser.isAdmin,
    });

    const userCookie = makeAuthCookie({
        ID: normalUser.ID,
        username: normalUser.username,
        email: normalUser.email,
        isAdmin: normalUser.isAdmin,
    });

    return { adminUser, normalUser, adminCookie, userCookie };
}

module.exports = { makeAuthCookie, cleanDb, createBaseUsers, db };
