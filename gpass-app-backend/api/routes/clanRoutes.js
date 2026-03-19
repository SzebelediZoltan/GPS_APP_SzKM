const express = require("express");
const router = express.Router();

const clanController = require("../controllers/clanController");
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const rules = require("../middlewares/validationRules");

// LISTA (logged in)
router.get("/", [authMiddleware.userIsLoggedIn], clanController.getClans);

// LÉTREHOZÁS (logged in)
router.post("/", [authMiddleware.userIsLoggedIn, ...validate(rules.createClan)], clanController.createClan);

// KERESÉS (logged in)
router.get("/search", [authMiddleware.userIsLoggedIn], clanController.searchClans);

// PARAM
router.param("clanID", (req, res, next, clanID) => {
    req.clanID = clanID;
    next();
});

// GET 1 (logged in)
router.get("/:clanID", [authMiddleware.userIsLoggedIn], clanController.getClan);

// UPDATE (logged in)
router.put("/:clanID", [authMiddleware.userIsLoggedIn, ...validate(rules.updateClan)], clanController.updateClan);

// LEADER CSERE (logged in)
router.patch("/:clanID/leader", [authMiddleware.userIsLoggedIn, ...validate(rules.changeLeader)], clanController.changeLeader);

// DELETE (logged in)
router.delete("/:clanID", [authMiddleware.userIsLoggedIn], clanController.deleteClan);

module.exports = router;
