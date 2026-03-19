const { body } = require("express-validator");

// Minden route-hoz itt vannak összegyűjtve a bemeneti validációs szabályok.
// A validate() middleware ezeket kapja meg, és ha valamelyik megbukik,
// automatikusan 400-as ValidationError-t küld vissza.

// =====================
// AUTH
// =====================

// Bejelentkezéshez csak az azonosító és a jelszó kötelező —
// a pontos formátumot szándékosan nem szűkítjük, mert userID lehet email, username vagy ID is.
exports.login = [
    body("userID")
        .notEmpty().withMessage("userID megadása kötelező."),
    body("password")
        .notEmpty().withMessage("Jelszó megadása kötelező."),
];

// =====================
// USERS
// =====================

exports.createUser = [
    body("username")
        .notEmpty().withMessage("Felhasználónév megadása kötelező.")
        .isLength({ min: 3, max: 32 }).withMessage("A felhasználónév 3–32 karakter között legyen."),
    body("email")
        .notEmpty().withMessage("Email cím megadása kötelező.")
        .isEmail().withMessage("Érvénytelen email formátum."),
    body("password")
        .notEmpty().withMessage("Jelszó megadása kötelező.")
        .isLength({ min: 6 }).withMessage("A jelszó legalább 6 karakter legyen."),
];

// Update-nél minden mező opcionális — csak azt küldi a kliens, amit változtatni akar.
exports.updateUser = [
    body("username")
        .optional()
        .isLength({ min: 3, max: 32 }).withMessage("A felhasználónév 3–32 karakter között legyen."),
    body("email")
        .optional()
        .isEmail().withMessage("Érvénytelen email formátum."),
    body("password")
        .optional()
        .isLength({ min: 6 }).withMessage("A jelszó legalább 6 karakter legyen."),
];

// GPS koordinátáknál a határértékeket a Föld geometriája szabja meg.
exports.updateLocation = [
    body("latitude")
        .notEmpty().withMessage("Szélesség (latitude) megadása kötelező.")
        .isFloat({ min: -90, max: 90 }).withMessage("A latitude értéke -90 és 90 közé essen."),
    body("longitude")
        .notEmpty().withMessage("Hosszúság (longitude) megadása kötelező.")
        .isFloat({ min: -180, max: 180 }).withMessage("A longitude értéke -180 és 180 közé essen."),
];

// =====================
// CLANS
// =====================

exports.createClan = [
    body("name")
        .notEmpty().withMessage("Klán neve kötelező.")
        .isLength({ min: 2, max: 64 }).withMessage("A klán neve 2–64 karakter közé essen."),
    body("leader_id")
        .notEmpty().withMessage("Vezető (leader_id) megadása kötelező.")
        .isInt({ min: 1 }).withMessage("A leader_id érvényes egész szám kell legyen."),
    body("description")
        .optional()
        .isLength({ max: 255 }).withMessage("A leírás maximum 255 karakter lehet."),
];

exports.updateClan = [
    body("name")
        .optional()
        .isLength({ min: 2, max: 64 }).withMessage("A klán neve 2–64 karakter közé essen."),
    body("leader_id")
        .optional()
        .isInt({ min: 1 }).withMessage("A leader_id érvényes egész szám kell legyen."),
    body("description")
        .optional()
        .isLength({ max: 255 }).withMessage("A leírás maximum 255 karakter lehet."),
];

exports.changeLeader = [
    body("leader_id")
        .notEmpty().withMessage("Új vezető (leader_id) megadása kötelező.")
        .isInt({ min: 1 }).withMessage("A leader_id érvényes egész szám kell legyen."),
];

// =====================
// CLAN MEMBERS
// =====================

// A role-nak csak előre meghatározott értékei lehetnek, hogy az adatbázis konzisztens maradjon.
exports.addMember = [
    body("clan_id")
        .notEmpty().withMessage("Klán azonosító (clan_id) kötelező.")
        .isInt({ min: 1 }).withMessage("A clan_id érvényes egész szám kell legyen."),
    body("user_id")
        .notEmpty().withMessage("Felhasználó azonosító (user_id) kötelező.")
        .isInt({ min: 1 }).withMessage("A user_id érvényes egész szám kell legyen."),
    body("role")
        .optional()
        .isIn(["member", "officer", "leader"]).withMessage("Érvényes szerepkör: member, officer, leader."),
];

// =====================
// MARKERS
// =====================

exports.createMarker = [
    body("creator_id")
        .notEmpty().withMessage("Létrehozó azonosítója (creator_id) kötelező.")
        .isInt({ min: 1 }).withMessage("A creator_id érvényes egész szám kell legyen."),
    body("marker_type")
        .notEmpty().withMessage("Marker típusa (marker_type) kötelező.")
        .isLength({ min: 1, max: 64 }).withMessage("A marker_type max 64 karakter lehet."),
    body("lat")
        .notEmpty().withMessage("Szélesség (lat) megadása kötelező.")
        .isFloat({ min: -90, max: 90 }).withMessage("A lat értéke -90 és 90 közé essen."),
    body("lng")
        .notEmpty().withMessage("Hosszúság (lng) megadása kötelező.")
        .isFloat({ min: -180, max: 180 }).withMessage("A lng értéke -180 és 180 közé essen."),
];

exports.updateMarker = [
    body("marker_type")
        .optional()
        .isLength({ min: 1, max: 64 }).withMessage("A marker_type max 64 karakter lehet."),
    body("score")
        .optional()
        .isInt({ min: 0 }).withMessage("A score nem-negatív egész szám kell legyen."),
    body("lat")
        .optional()
        .isFloat({ min: -90, max: 90 }).withMessage("A lat értéke -90 és 90 közé essen."),
    body("lng")
        .optional()
        .isFloat({ min: -180, max: 180 }).withMessage("A lng értéke -180 és 180 közé essen."),
];

// =====================
// FRIENDS
// =====================

exports.createFriend = [
    body("sender_id")
        .notEmpty().withMessage("Küldő azonosítója (sender_id) kötelező.")
        .isInt({ min: 1 }).withMessage("A sender_id érvényes egész szám kell legyen."),
    body("receiver_id")
        .notEmpty().withMessage("Fogadó azonosítója (receiver_id) kötelező.")
        .isInt({ min: 1 }).withMessage("A receiver_id érvényes egész szám kell legyen."),
];

// A státusznak csak ez a három értéke lehet — más értéket az adatbázis sem fogadna el.
exports.updateFriend = [
    body("status")
        .notEmpty().withMessage("Státusz megadása kötelező.")
        .isIn(["sent", "accepted", "rejected"]).withMessage("Érvényes státusz: sent, accepted, rejected."),
];


// =====================
// CONTACT
// =====================

// Az üzenet minimuma 10 karakter, hogy ne lehessen üres vagy triviális üzenetet küldeni.
exports.sendContact = [
    body("name")
        .notEmpty().withMessage("Név megadása kötelező.")
        .isLength({ min: 2, max: 100 }).withMessage("A név 2–100 karakter közé essen."),
    body("email")
        .notEmpty().withMessage("Email cím megadása kötelező.")
        .isEmail().withMessage("Érvénytelen email formátum."),
    body("message")
        .notEmpty().withMessage("Üzenet megadása kötelező.")
        .isLength({ min: 10, max: 2000 }).withMessage("Az üzenet 10–2000 karakter közé essen."),
];
