const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const rules = require("../middlewares/validationRules");

// LISTA (admin)
router.get("/", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.getUsers);

// REGISZTRÁCIÓ (public)
router.post("/", validate(rules.createUser), userController.createUser);

// KERESÉS (logged in)
router.get("/search", [authMiddleware.userIsLoggedIn], userController.searchUsers);

// PARAM
router.param("userID", (req, res, next, userID) => {
    req.userID = userID;
    next();
});

// GET 1 user (logged in)
router.get("/:userID", [authMiddleware.userIsLoggedIn], userController.getUser);

// HELYSZÍN FRISSÍTÉS (logged in)
router.put("/location", [authMiddleware.userIsLoggedIn, ...validate(rules.updateLocation)], userController.updateLocation);

// UPDATE (logged in)
router.put("/:userID", [authMiddleware.userIsLoggedIn, ...validate(rules.updateUser)], userController.updateUser);

// DELETE (admin)
router.delete("/:userID", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.deleteUser);

router.get("/location/:userID", [authMiddleware.userIsLoggedIn], userController.getUserLocation);

module.exports = router;
