const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const rules = require("../middlewares/validationRules");

router.post("/login", validate(rules.login), authController.login);

router.get("/status", authMiddleware.userIsLoggedIn, authController.status);

router.delete("/logout", authController.logout);

module.exports = router;