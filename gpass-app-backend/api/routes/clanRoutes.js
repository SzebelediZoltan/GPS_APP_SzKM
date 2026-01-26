const express = require("express");
const router = express.Router();

const clanController = require("../controllers/clanController");
const authMiddleware = require("../middlewares/authMiddleware");

// LISTA (public vagy logged in — itt logged in-re raktam, te döntöd)
router.get("/", [authMiddleware.userIsLoggedIn], clanController.getClans);

// KERESÉS (logged in)
router.get("/search", [authMiddleware.userIsLoggedIn], clanController.searchClans);

// LÉTREHOZÁS (logged in)
router.post("/", [authMiddleware.userIsLoggedIn], clanController.createClan);

// PARAM
router.param("clanID", (req, res, next, clanID) => {
    req.clanID = clanID;
    next();
});

// GET 1 (logged in)
router.get("/:clanID", [authMiddleware.userIsLoggedIn], clanController.getClan);

// UPDATE (logged in)
router.put("/:clanID", [authMiddleware.userIsLoggedIn], clanController.updateClan);

// DELETE (admin) – ha akarod csak leadernek, azt majd service-ben szabályozzuk
router.delete("/:clanID", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], clanController.deleteClan);

module.exports = router;
