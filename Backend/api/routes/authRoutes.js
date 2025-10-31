const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/login", authController.login);

router.get("/status", [ authMiddleware.userIsLoggedIn ], authController.status);

router.delete("/logout", authController.logout);

module.exports = router;