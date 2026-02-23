const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// LISTA (admin)
router.get("/", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.getUsers);

// REGISZTRÁCIÓ (public)
router.post("/", userController.createUser);

// KERESÉS (logged in)
router.get("/search", [authMiddleware.userIsLoggedIn], userController.searchUsers);

// PARAM
router.param("userID", (req, res, next, userID) => {
    req.userID = userID;
    next();
});

// GET 1 user (logged in) – pl profil / user adat
router.get("/:userID", [authMiddleware.userIsLoggedIn], userController.getUser);

// UPDATE (logged in)
router.put("/:userID", [authMiddleware.userIsLoggedIn], userController.updateUser);

// DELETE (admin)
router.delete("/:userID", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], userController.deleteUser);

router.put("/location", [authMiddleware.userIsLoggedIn], userController.updateLocation);
router.get("/location/:userID",[authMiddleware.userIsLoggedIn],userController.getUserLocation);

module.exports = router;
